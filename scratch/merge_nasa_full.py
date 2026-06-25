import pandas as pd
import numpy as np

print("Loading master dataset...")
df_master = pd.read_csv('backend/data/india_crop_risk_master.csv')

print("Loading newly fetched NASA data (1981-2017)...")
df_nasa = pd.read_csv('backend/data/district_yearly_weather_nasa_full.csv')

# Clean up NASA strings to match exactly
df_nasa['District'] = df_nasa['District'].astype(str).str.strip().str.upper()
df_master['District_Name'] = df_master['District_Name'].astype(str).str.strip().str.upper()

# Ensure types match
df_nasa['Crop_Year'] = df_nasa['Crop_Year'].astype(int)
df_master['Crop_Year'] = df_master['Crop_Year'].astype(int)

# Merge
print("Merging data...")
# We do a left merge to pull in the NASA data into the master dataframe based on District and Year
merged = pd.merge(df_master, df_nasa, 
                  left_on=['District_Name', 'Crop_Year'], 
                  right_on=['District', 'Crop_Year'], 
                  how='left')

# The mapping from NASA to master column names
nasa_to_master = {
    'Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)': 'Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)',
    'Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)': 'Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)',
    'Summer MAR-MAY PERCIPITATION (Millimeters)': 'Summer MAR-MAY PERCIPITATION (Millimeters)',
    'Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)': 'Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)',
    'Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)': 'Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)',
    'Rainy JUN-SEP PERCIPITATION (Millimeters)': 'Rainy JUN-SEP PERCIPITATION (Millimeters)',
    'Rainy JUN-SEP WINDSPEED (Meter per second)': 'Rainy JUN-SEP WINDSPEED (Meter per second)'
}

replaced_count = 0
for col_nasa, col_master in nasa_to_master.items():
    col_x = col_master + "_x"
    col_y = col_master + "_y"
    
    if col_y in merged.columns and col_x in merged.columns:
        # We replace the _x column with the _y column where _y is not null and source is not Mendeley
        mask = (merged['Source'] != 'MENDELEY') & (merged[col_y].notna())
        merged.loc[mask, col_x] = merged.loc[mask, col_y]
        
        # We just count rows affected for the first variable
        if col_nasa == 'Rainy JUN-SEP PERCIPITATION (Millimeters)':
            replaced_count = mask.sum()
            # Mark them as NASA
            merged.loc[mask, 'Source'] = 'NASA_POWER_FULL'

# Drop all the _y columns and rename _x back to original
drop_cols = [c for c in merged.columns if c.endswith('_y')]
merged = merged.drop(columns=drop_cols)
rename_dict = {c: c[:-2] for c in merged.columns if c.endswith('_x')}
merged = merged.rename(columns=rename_dict)

if 'District' in merged.columns:
    merged = merged.drop(columns=['District'])

print(f"Successfully injected {replaced_count} completely real NASA records into the master dataset!")

merged.to_csv('backend/data/india_crop_risk_master.csv', index=False)
print("Saved back to master csv.")
