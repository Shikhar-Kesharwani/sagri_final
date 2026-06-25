import pandas as pd
import xarray as xr
import numpy as np

print("Loading dataset...")
ds = xr.open_dataset(r'C:\Users\HP\Downloads\104234ac5b227ec4bf4dda934169e5a.nc')

print("Loading master and coords...")
master_df = pd.read_csv('backend/data/india_crop_risk_master.csv')
coords_df = pd.read_csv('backend/data/district_coordinates.csv')

# Build coords dict
coords_dict = {}
for _, row in coords_df.iterrows():
    if pd.notna(row['Latitude']) and pd.notna(row['Longitude']):
        coords_dict[row['District'].upper()] = (row['Latitude'], row['Longitude'])

# Find all districts that need wind data in 1966-1980
mask = (master_df['Crop_Year'] >= 1966) & (master_df['Crop_Year'] <= 1980) & (master_df['Rainy JUN-SEP WINDSPEED (Meter per second)'].isna())
missing = master_df[mask]
districts = missing['District_Name'].unique()

print(f"Found {len(districts)} districts to process.")

results = []
for dist in districts:
    dist_upper = dist.strip().upper()
    if dist_upper not in coords_dict:
        continue
        
    lat, lon = coords_dict[dist_upper]
    
    try:
        # Get nearest grid point time series
        ts = ds.sel(latitude=lat, longitude=lon, method='nearest').to_dataframe()
        
        # Calculate absolute wind speed in m/s
        ts['wind_speed_ms'] = np.sqrt(ts['u10']**2 + ts['v10']**2)
        
        # Loop through years
        for year in range(1966, 1981):
            year_mask = (ts.index.year == year)
            if not year_mask.any():
                continue
                
            year_data = ts[year_mask]
            
            # Summer: Mar (3), Apr (4), May (5)
            summer_mask = year_data.index.month.isin([3, 4, 5])
            summer_wind = year_data[summer_mask]['wind_speed_ms'].mean() if summer_mask.any() else np.nan
            
            # Rainy: Jun (6), Jul (7), Aug (8), Sep (9)
            rainy_mask = year_data.index.month.isin([6, 7, 8, 9])
            rainy_wind = year_data[rainy_mask]['wind_speed_ms'].mean() if rainy_mask.any() else np.nan
            
            results.append({
                'District': dist_upper,
                'Crop_Year': year,
                'Summer MAR-MAY WINDSPEED (Meter per second)': summer_wind,
                'Rainy JUN-SEP WINDSPEED (Meter per second)': rainy_wind
            })
            
    except Exception as e:
        print(f"Error for {dist} at {lat}, {lon}: {e}")

out_df = pd.DataFrame(results)
out_path = 'backend/data/district_yearly_wind_era5.csv'
out_df.to_csv(out_path, index=False)
print(f"Extraction complete! Saved {len(out_df)} rows to {out_path}.")
