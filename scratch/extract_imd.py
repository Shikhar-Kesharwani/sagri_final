import pandas as pd
import imdlib as imd
import os
import numpy as np
from datetime import datetime

base_dir = r'C:\Users\HP\Downloads\New folder (2)\imd_1966_1980'
rain_dir = os.path.join(base_dir, 'rain', 'rain')
tmax_dir = os.path.join(base_dir, 'tmax', 'tmax')
tmin_dir = os.path.join(base_dir, 'tmin', 'tmin')

print("Loading coordinates...")
coords_df = pd.read_csv('backend/data/district_coordinates.csv')
coords_dict = {}
for _, row in coords_df.iterrows():
    if pd.notna(row['Latitude']) and pd.notna(row['Longitude']):
        coords_dict[row['District'].upper()] = (row['Latitude'], row['Longitude'])

print("Loading master dataset...")
master_df = pd.read_csv('backend/data/india_crop_risk_master.csv')
master_df['District_Name'] = master_df['District_Name'].astype(str).str.strip().str.upper()

# Identify districts that need data in 1966-1980
mask = (master_df['Crop_Year'] >= 1966) & (master_df['Crop_Year'] <= 1980) & (master_df['Rainy JUN-SEP PERCIPITATION (Millimeters)'].isna())
missing_rows = master_df[mask]

districts_to_process = missing_rows['District_Name'].unique()
print(f"Found {len(districts_to_process)} unique districts to process.")

# Prepare results list
results = []

years = range(1966, 1981)

for year in years:
    print(f"\nProcessing Year: {year}")
    try:
        # Load IMD Grids
        rain_data = imd.open_data('rain', year, year, 'yearwise', rain_dir).get_xarray()
        tmax_data = imd.open_data('tmax', year, year, 'yearwise', tmax_dir).get_xarray()
        tmin_data = imd.open_data('tmin', year, year, 'yearwise', tmin_dir).get_xarray()
        
        # Open-Meteo variables match logic
        for dist in districts_to_process:
            if dist not in coords_dict:
                continue
                
            lat, lon = coords_dict[dist]
            
            try:
                # Extract time series for the nearest grid point
                rain_ts = rain_data['rain'].sel(lat=lat, lon=lon, method='nearest').to_dataframe()
                tmax_ts = tmax_data['tmax'].sel(lat=lat, lon=lon, method='nearest').to_dataframe()
                tmin_ts = tmin_data['tmin'].sel(lat=lat, lon=lon, method='nearest').to_dataframe()
                
                # Merge into one dataframe for the year
                df_year = rain_ts.join(tmax_ts, rsuffix='_max').join(tmin_ts, rsuffix='_min')
                df_year = df_year.reset_index()
                
                df_year['month'] = df_year['time'].dt.month
                
                # Replace invalid data (-999.0) with NaN
                df_year.replace([-999.0, -999.9], np.nan, inplace=True)
                
                # Summer (Mar-May)
                summer = df_year[df_year['month'].isin([3, 4, 5])]
                summer_rain = summer['rain'].sum(skipna=True)
                summer_tmax = summer['tmax'].mean(skipna=True)
                summer_tmin = summer['tmin'].mean(skipna=True)
                
                # Rainy (Jun-Sep)
                rainy = df_year[df_year['month'].isin([6, 7, 8, 9])]
                rainy_rain = rainy['rain'].sum(skipna=True)
                rainy_tmax = rainy['tmax'].mean(skipna=True)
                rainy_tmin = rainy['tmin'].mean(skipna=True)
                
                # Append row
                results.append({
                    "District": dist,
                    "Crop_Year": year,
                    "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)": round(summer_tmax, 2) if pd.notna(summer_tmax) else None,
                    "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)": round(summer_tmin, 2) if pd.notna(summer_tmin) else None,
                    "Summer MAR-MAY PERCIPITATION (Millimeters)": round(summer_rain, 2) if pd.notna(summer_rain) else None,
                    "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)": round(rainy_tmax, 2) if pd.notna(rainy_tmax) else None,
                    "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)": round(rainy_tmin, 2) if pd.notna(rainy_tmin) else None,
                    "Rainy JUN-SEP PERCIPITATION (Millimeters)": round(rainy_rain, 2) if pd.notna(rainy_rain) else None
                })
            except Exception as e:
                # Some districts might be outside the grid bounds completely
                print(f"Error for {dist} at {lat}, {lon}: {e}")
                
    except Exception as e:
        print(f"Failed to process year {year}: {e}")

out_df = pd.DataFrame(results)
out_path = 'backend/data/district_yearly_weather_imd.csv'
out_df.to_csv(out_path, index=False)
print(f"\nExtraction complete! Saved {len(out_df)} rows to {out_path}.")
