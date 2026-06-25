import pandas as pd
import requests
import time
import os

COORD_PATH = 'backend/data/district_coordinates.csv'
OUT_PATH = 'backend/data/district_yearly_weather.csv'

def fetch_weather_for_district(lat, lon, district):
    url = "https://archive-api.open-meteo.com/v1/archive"
    params = {
        "latitude": lat,
        "longitude": lon,
        "start_date": "1997-01-01",
        "end_date": "2020-12-31",
        "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,wind_speed_10m_max",
        "timezone": "Asia/Kolkata"
    }
    
    try:
        resp = requests.get(url, params=params, timeout=30)
        if resp.status_code != 200:
            print(f"  -> Error API {resp.status_code}: {resp.text[:100]}")
            return None
            
        data = resp.json()
        if "daily" not in data:
            return None
            
        daily = data["daily"]
        df_daily = pd.DataFrame({
            "date": pd.to_datetime(daily["time"]),
            "tmax": daily["temperature_2m_max"],
            "tmin": daily["temperature_2m_min"],
            "precip": daily["precipitation_sum"],
            "evap": daily["et0_fao_evapotranspiration"],
            "wind": daily["wind_speed_10m_max"]
        })
        
        df_daily["year"] = df_daily["date"].dt.year
        df_daily["month"] = df_daily["date"].dt.month
        
        # 1. Summer (Mar 3, Apr 4, May 5)
        summer_df = df_daily[df_daily["month"].isin([3, 4, 5])]
        summer_agg = summer_df.groupby("year").agg({
            "tmax": "mean",
            "tmin": "mean",
            "precip": "sum"
        }).reset_index()
        
        # 2. Rainy (Jun 6, Jul 7, Aug 8, Sep 9)
        rainy_df = df_daily[df_daily["month"].isin([6, 7, 8, 9])]
        rainy_agg = rainy_df.groupby("year").agg({
            "tmax": "mean",
            "tmin": "mean",
            "precip": "sum",
            "evap": "sum",
            "wind": "mean"
        }).reset_index()
        
        # Merge seasonal aggregations
        merged = pd.merge(summer_agg, rainy_agg, on="year", suffixes=("_summer", "_rainy"), how="outer")
        
        # Format columns to exactly match our training script
        final_rows = []
        for _, row in merged.iterrows():
            final_rows.append({
                "District": district,
                "Crop_Year": int(row["year"]),
                "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)": round(row["tmax_summer"], 2) if pd.notna(row["tmax_summer"]) else None,
                "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)": round(row["tmin_summer"], 2) if pd.notna(row["tmin_summer"]) else None,
                "Summer MAR-MAY PERCIPITATION (Millimeters)": round(row["precip_summer"], 2) if pd.notna(row["precip_summer"]) else None,
                "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)": round(row["tmax_rainy"], 2) if pd.notna(row["tmax_rainy"]) else None,
                "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)": round(row["tmin_rainy"], 2) if pd.notna(row["tmin_rainy"]) else None,
                "Rainy JUN-SEP PERCIPITATION (Millimeters)": round(row["precip_rainy"], 2) if pd.notna(row["precip_rainy"]) else None,
                "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)": round(row["evap"], 2) if pd.notna(row["evap"]) else None,
                "Rainy JUN-SEP WINDSPEED (Meter per second)": round(row["wind"], 2) if pd.notna(row["wind"]) else None,
            })
            
        return final_rows
        
    except Exception as e:
        print(f"  -> Exception: {e}")
        return None

def main():
    if not os.path.exists(COORD_PATH):
        print(f"Error: {COORD_PATH} not found. Run geocoding first.")
        return
        
    coords = pd.read_csv(COORD_PATH)
    valid_coords = coords[coords['Latitude'].notna()]
    print(f"Found {len(valid_coords)} districts with valid coordinates to fetch.")
    
    # Check existing progress
    existing_districts = set()
    if os.path.exists(OUT_PATH):
        try:
            exist_df = pd.read_csv(OUT_PATH)
            existing_districts = set(exist_df['District'].unique())
            print(f"Loaded {len(existing_districts)} already fetched districts from cache.")
        except:
            pass
            
    results = []
    
    for i, row in valid_coords.iterrows():
        dist = row['District']
        if dist in existing_districts:
            continue
            
        lat = row['Latitude']
        lon = row['Longitude']
        
        print(f"[{i+1}/{len(valid_coords)}] Fetching weather for {dist} (Lat:{lat:.2f}, Lon:{lon:.2f})...")
        
        yearly_data = fetch_weather_for_district(lat, lon, dist)
        if yearly_data:
            results.extend(yearly_data)
            existing_districts.add(dist)
            print(f"  -> Success ({len(yearly_data)} years)")
        else:
            print(f"  -> FAILED")
            
        # Avoid hammering Open-Meteo too hard (10,000 reqs/day allowed, but let's be polite)
        time.sleep(1)
        
        # Save progress every 10 districts
        if len(existing_districts) % 10 == 0 and len(results) > 0:
            df_new = pd.DataFrame(results)
            # Append if exists
            if os.path.exists(OUT_PATH):
                df_new.to_csv(OUT_PATH, mode='a', header=False, index=False)
            else:
                df_new.to_csv(OUT_PATH, index=False)
            results = [] # clear memory
            print("--- Progress saved ---")
            
    # Final save
    if len(results) > 0:
        df_new = pd.DataFrame(results)
        if os.path.exists(OUT_PATH):
            df_new.to_csv(OUT_PATH, mode='a', header=False, index=False)
        else:
            df_new.to_csv(OUT_PATH, index=False)
            
    print("\nWeather fetch complete!")
    if os.path.exists(OUT_PATH):
        final_df = pd.read_csv(OUT_PATH)
        print(f"Total weather rows saved: {len(final_df)}")

if __name__ == "__main__":
    main()
