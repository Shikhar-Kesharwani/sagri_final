import pandas as pd
import requests
import time
import os

DATA_PATH = os.path.join("data", "clean_prices.csv")
OUTPUT_PATH = os.path.join("data", "clean_prices_with_weather.csv")

# Center coordinates for Indian States (approximate)
STATE_COORDS = {
    "Andhra Pradesh": (15.9129, 79.7400),
    "Arunachal Pradesh": (28.2180, 94.7278),
    "Assam": (26.2006, 92.9376),
    "Bihar": (25.0961, 85.3131),
    "Chhattisgarh": (21.2787, 81.8661),
    "Goa": (15.2993, 74.1240),
    "Gujarat": (22.2587, 71.1924),
    "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1665),
    "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (15.3173, 75.7139),
    "Kerala": (10.8505, 76.2711),
    "Madhya Pradesh": (22.9734, 78.6569),
    "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.6637, 93.9063),
    "Meghalaya": (25.4670, 91.3662),
    "Mizoram": (23.1645, 92.9376),
    "Nagaland": (26.1584, 94.5624),
    "Odisha": (20.9517, 85.0985),
    "Punjab": (31.1471, 75.3412),
    "Rajasthan": (27.0238, 74.2179),
    "Sikkim": (27.5330, 88.5122),
    "Tamil Nadu": (11.1271, 78.6569),
    "Telangana": (18.1124, 79.0193),
    "Tripura": (23.9408, 91.9882),
    "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.0668, 79.0193),
    "West Bengal": (22.9868, 87.8550),
    # Union Territories (commonly in datasets)
    "Andaman and Nicobar": (11.7401, 92.6586),
    "Chandigarh": (30.7333, 76.7794),
    "Delhi": (28.7041, 77.1025),
    "Jammu and Kashmir": (33.7782, 76.5762),
    "Puducherry": (11.9416, 79.8083)
}

print(f"Loading {DATA_PATH}...")
if not os.path.exists(DATA_PATH):
    print("ERROR: clean_prices.csv not found!")
    exit(1)
    
df = pd.read_csv(DATA_PATH)

# Fetching monthly aggregated data directly from Open-Meteo
START_DATE = "2000-01-01"
END_DATE = "2026-06-10" # Must be strictly in the past for the Archive API

weather_records = []

print("Fetching Historical Weather Data from Open-Meteo for all 34 States...")
for state, (lat, lon) in STATE_COORDS.items():
    print(f"   Fetching weather for {state}...")
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={START_DATE}&end_date={END_DATE}&daily=temperature_2m_mean,precipitation_sum&timezone=Asia%2FKolkata"
    
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            daily_times = data['daily']['time']
            daily_temp = data['daily']['temperature_2m_mean']
            daily_precip = data['daily']['precipitation_sum']
            
            # Create a dataframe for this state
            state_weather = pd.DataFrame({
                'Date': pd.to_datetime(daily_times),
                'Temp': daily_temp,
                'Precip': daily_precip
            })
            
            # Aggregate to Monthly
            state_weather['Year'] = state_weather['Date'].dt.year
            state_weather['Month'] = state_weather['Date'].dt.month
            
            monthly_weather = state_weather.groupby(['Year', 'Month']).agg({
                'Temp': 'mean',
                'Precip': 'sum'  # Total monthly rainfall
            }).reset_index()
            
            monthly_weather['State'] = state
            weather_records.append(monthly_weather)
            
        else:
            print(f"   Failed to fetch {state}: {response.status_code}")
    except Exception as e:
        print(f"   Error fetching {state}: {e}")
        
    # Be polite to the free API to prevent rate limiting
    time.sleep(1.0)

print("\nCombining all weather data...")
all_weather_df = pd.concat(weather_records, ignore_index=True)

print("Merging weather into the massive price database...")
# Map variations
df['State_Clean'] = df['State'].replace({
    'Nct of Delhi': 'Delhi',
    'Chattisgarh': 'Chhattisgarh',
    'Orissa': 'Odisha',
    'Jammu and Kashmir': 'Jammu and Kashmir',
})

merged_df = pd.merge(df, all_weather_df, left_on=['Year', 'Month', 'State_Clean'], right_on=['Year', 'Month', 'State'], how='left', suffixes=('', '_y'))
merged_df = merged_df.drop(columns=['State_Clean', 'State_y'])

# Fill any missing state weather with the national average for that Year/Month
national_weather = all_weather_df.groupby(['Year', 'Month']).agg({'Temp': 'mean', 'Precip': 'mean'}).reset_index()
merged_df = pd.merge(merged_df, national_weather, on=['Year', 'Month'], how='left', suffixes=('', '_nat'))

merged_df['Temp'] = merged_df['Temp'].fillna(merged_df['Temp_nat'])
merged_df['Precip'] = merged_df['Precip'].fillna(merged_df['Precip_nat'])

merged_df = merged_df.drop(columns=['Temp_nat', 'Precip_nat'])

# Drop rows where even the national average is missing (e.g. future dates that Open-Meteo archive doesn't have yet)
merged_df = merged_df.dropna(subset=['Temp', 'Precip'])

merged_df = merged_df.rename(columns={'Temp': 'Temperature', 'Precip': 'Rainfall'})

print(f"Saving newly upgraded database to {OUTPUT_PATH}")
os.makedirs("data", exist_ok=True)
merged_df.to_csv(OUTPUT_PATH, index=False)
print("DONE! Database is primed with weather data.")
