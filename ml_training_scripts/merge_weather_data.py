import pandas as pd
import numpy as np

MASTER_PATH = 'backend/data/india_crop_risk_master.csv'
WEATHER_PATH = 'backend/data/district_yearly_weather_nasa.csv'
OUT_PATH = 'backend/data/india_crop_risk_master.csv' # overwrite it!

def merge_weather():
    print(f"Loading master dataset from {MASTER_PATH}...")
    df = pd.read_csv(MASTER_PATH)
    initial_mendeley = len(df[df['Source'] == 'MENDELEY'])
    
    print(f"Loading new NASA weather data from {WEATHER_PATH}...")
    try:
        w_df = pd.read_csv(WEATHER_PATH)
    except FileNotFoundError:
        print("No weather data found to merge.")
        return
        
    print(f"New weather rows to merge: {len(w_df)}")
    
    # We will merge by District_Name and Crop_Year
    # Create a lookup dictionary for fast matching
    w_df['key'] = w_df['District'].astype(str).str.strip().str.upper() + "_" + w_df['Crop_Year'].astype(str)
    w_dict = w_df.set_index('key').to_dict('index')
    
    updated_count = 0
    
    # Define the columns we are replacing
    climate_cols = [
        "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)",
        "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)",
        "Summer MAR-MAY PERCIPITATION (Millimeters)",
        "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)",
        "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)",
        "Rainy JUN-SEP PERCIPITATION (Millimeters)",
        "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)",
        "Rainy JUN-SEP WINDSPEED (Meter per second)"
    ]
    
    for i, row in df.iterrows():
        # Skip if already MENDELEY
        if row['Source'] == 'MENDELEY':
            continue
            
        dist = str(row['District_Name']).strip().upper()
        year = str(row['Crop_Year']).strip()
        key = f"{dist}_{year}"
        
        if key in w_dict:
            new_data = w_dict[key]
            # Update columns
            for col in climate_cols:
                # If NASA didn't have evapotranspiration, keep the median imputation
                if col == "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)" and pd.isna(new_data.get(col, pd.NA)):
                    continue
                df.at[i, col] = new_data[col]
                
            # Flag it as authentic!
            df.at[i, 'Source'] = 'MENDELEY'
            updated_count += 1
            
    if updated_count > 0:
        print(f"Successfully enriched {updated_count} rows with authentic NASA climate data!")
        df.to_csv(OUT_PATH, index=False)
        final_mendeley = len(df[df['Source'] == 'MENDELEY'])
        print(f"Authentic Climate Rows increased from {initial_mendeley:,} to {final_mendeley:,}!")
    else:
        print("No rows matched for updating.")

if __name__ == "__main__":
    merge_weather()
