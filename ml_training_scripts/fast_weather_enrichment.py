import pandas as pd
import requests
import time
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

DATA_PATH = 'backend/data/india_crop_risk_master.csv'
OUT_PATH = 'backend/data/district_yearly_weather.csv'

def process_district(district):
    try:
        # Step 1: Geocode
        geo_url = "https://geocoding-api.open-meteo.com/v1/search"
        geo_resp = requests.get(geo_url, params={'name': district, 'count': 10, 'format': 'json'}, timeout=5)
        if geo_resp.status_code != 200:
            return None
            
        geo_data = geo_resp.json()
        lat, lon = None, None
        
        if "results" in geo_data:
            for res in geo_data["results"]:
                if res.get("country_code") == "IN":
                    lat = res["latitude"]
                    lon = res["longitude"]
                    break
                    
        # If still not found, try stripping suffixes
        if lat is None:
            clean_name = district.replace(" DISTRICT", "").replace(" RURAL", "").replace(" URBAN", "")
            geo_resp2 = requests.get(geo_url, params={'name': clean_name, 'count': 10, 'format': 'json'}, timeout=5)
            if geo_resp2.status_code == 200:
                geo_data2 = geo_resp2.json()
                if "results" in geo_data2:
                    for res in geo_data2["results"]:
                        if res.get("country_code") == "IN":
                            lat = res["latitude"]
                            lon = res["longitude"]
                            break
                            
        if lat is None:
            return None # Geocoding failed
            
        # Step 2: Fetch Weather
        weather_url = "https://archive-api.open-meteo.com/v1/archive"
        params = {
            "latitude": lat,
            "longitude": lon,
            "start_date": "1997-01-01",
            "end_date": "2020-12-31",
            "daily": "temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,wind_speed_10m_max",
            "timezone": "Asia/Kolkata"
        }
        
        weather_resp = requests.get(weather_url, params=params, timeout=10)
        if weather_resp.status_code != 200:
            return None
            
        w_data = weather_resp.json()
        if "daily" not in w_data:
            return None
            
        daily = w_data["daily"]
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
        
        summer_df = df_daily[df_daily["month"].isin([3, 4, 5])]
        summer_agg = summer_df.groupby("year").agg({"tmax": "mean", "tmin": "mean", "precip": "sum"}).reset_index()
        
        rainy_df = df_daily[df_daily["month"].isin([6, 7, 8, 9])]
        rainy_agg = rainy_df.groupby("year").agg({"tmax": "mean", "tmin": "mean", "precip": "sum", "evap": "sum", "wind": "mean"}).reset_index()
        
        merged = pd.merge(summer_agg, rainy_agg, on="year", suffixes=("_summer", "_rainy"), how="outer")
        
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
        return None

def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    non_mendeley = df[df['Source'] != 'MENDELEY']
    districts = non_mendeley['District_Name'].dropna().astype(str).str.strip().str.upper().unique()
    districts = sorted(list(districts))
    
    # We will just process all of them to be safe and rewrite the file
    print(f"Starting highly-concurrent pipeline for {len(districts)} districts...")
    
    all_results = []
    success_count = 0
    
    with ThreadPoolExecutor(max_workers=25) as executor:
        future_to_dist = {executor.submit(process_district, d): d for d in districts}
        
        for future in as_completed(future_to_dist):
            d = future_to_dist[future]
            res = future.result()
            if res:
                all_results.extend(res)
                success_count += 1
                print(f"[{success_count}/{len(districts)}] OK: {d} (Got {len(res)} years)")
            else:
                print(f"[-] FAILED: {d}")
                
    if all_results:
        final_df = pd.DataFrame(all_results)
        final_df.to_csv(OUT_PATH, index=False)
        print(f"\nPipeline COMPLETE! Saved {len(final_df)} weather rows to {OUT_PATH}")
    else:
        print("\nPipeline failed entirely.")

if __name__ == "__main__":
    main()
