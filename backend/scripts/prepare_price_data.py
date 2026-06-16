import os
import pandas as pd
import glob

# Ensure directories exist
os.makedirs("scripts", exist_ok=True)
os.makedirs("data", exist_ok=True)

# Path to the downloaded CSVs
RAW_DATA_DIR = r"C:\Users\HP\Downloads\dataset_price\csv"

print("Looking for all historical data files (2001-2026)...")
all_files = glob.glob(os.path.join(RAW_DATA_DIR, "*.csv"))

if not all_files:
    print(f"ERROR: Could not find CSV files in {RAW_DATA_DIR}.")
    exit(1)

print(f"SUCCESS: Found {len(all_files)} data files. Starting chunked processing...")

# The Top 30 crops we identified earlier
top_30_crops = [
    'Onion', 'Potato', 'Tomato', 'Brinjal', 'Wheat', 'Green Chilli', 'Banana', 
    'Bhindi (Ladies Finger)', 'Cabbage', 'Cauliflower', 'Bottle gourd', 
    'Cucumbar (Kheera)', 'Pumpkin', 'Bitter gourd', 'Paddy (Dhan)(Common)', 
    'Ginger (Green)', 'Carrot', 'Bengal Gram (Gram)(Whole)', 'Apple', 'Raddish', 
    'Maize', 'Lemon', 'Mustard', 'Garlic', 'Soyabean', 'Rice', 'Banana - Green', 
    'Papaya', 'Ridgeguard (Tori)', 'Capsicum'
]

cols_to_use = ['State', 'Commodity', 'Arrival_Date', 'Modal_Price']

aggregated_chunks = []

for file in sorted(all_files):
    print(f"Reading and aggregating {os.path.basename(file)}...")
    try:
        # Load the file
        df = pd.read_csv(file, usecols=cols_to_use, low_memory=False)
        
        # 1. Filter to Top 30 crops immediately to free memory
        df = df[df['Commodity'].isin(top_30_crops)].copy()
        
        # 2. Clean prices
        df = df.dropna(subset=['Modal_Price'])
        
        # 3. Format dates and extract Year/Month
        df['Arrival_Date'] = pd.to_datetime(df['Arrival_Date'], errors='coerce')
        df = df.dropna(subset=['Arrival_Date'])
        
        df['Year'] = df['Arrival_Date'].dt.year
        df['Month'] = df['Arrival_Date'].dt.month
        
        # 4. Group by Year, Month, State, and Commodity
        grouped_df = df.groupby(['Year', 'Month', 'State', 'Commodity'])['Modal_Price'].mean().reset_index()
        
        aggregated_chunks.append(grouped_df)
    except Exception as e:
        print(f"Error processing {os.path.basename(file)}: {e}")

if not aggregated_chunks:
    print("ERROR: No data was loaded.")
    exit(1)

# Combine all aggregated years
print("\nCombining all 25 years of aggregated data...")
final_df = pd.concat(aggregated_chunks, ignore_index=True)

# Do one final groupby just in case a year was split across two CSV files
print("Finalizing National and State Monthly Averages...")
final_df = final_df.groupby(['Year', 'Month', 'State', 'Commodity'])['Modal_Price'].mean().reset_index()

# Save the super-compressed, ultra-clean data
output_path = os.path.join("data", "clean_prices.csv")
print(f"Saving 25 years of clean ML data to {output_path}...")
final_df.to_csv(output_path, index=False)

print(f"DONE! Compressed millions of rows into just {len(final_df):,} highly optimized rows.")
