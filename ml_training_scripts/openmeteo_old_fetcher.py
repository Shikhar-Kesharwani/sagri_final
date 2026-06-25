import pandas as pd
import requests
import time
import os
import urllib.request
import json

DATA_PATH = 'backend/data/india_crop_risk_master.csv'
OUT_PATH = 'backend/data/district_yearly_weather_openmeteo_old.csv'

def geocode_district(district):
    geo_url = "https://geocoding-api.open-meteo.com/v1/search"
    try:
        geo_resp = requests.get(geo_url, params={'name': district, 'count': 5, 'format': 'json'}, timeout=10)
        if geo_resp.status_code == 200:
            data = geo_resp.json()
            if "results" in data:
                for res in data["results"]:
                    if res.get("country_code") == "IN":
                        return res["latitude"], res["longitude"]
    except requests.exceptions.RequestException:
        pass
    return None, None

import random

USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15',
    'Mozilla/5.0 (X11; Linux x86_64; rv:109.0) Gecko/20100101 Firefox/111.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36'
]

def fetch_openmeteo_weather(district, lat, lon):
    url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date=1966-01-01&end_date=1980-12-31&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,et0_fao_evapotranspiration,wind_speed_10m_max&timezone=Asia/Kolkata"
    req = urllib.request.Request(url, headers={'User-Agent': random.choice(USER_AGENTS), 'Connection': 'close'})
    try:
        # Open-Meteo takes ~30 seconds to compute ET0 and wind speed for 15 years
        time.sleep(2) # VERY strict rate limiting delay
        with urllib.request.urlopen(req, timeout=60) as response:
            data = json.loads(response.read().decode())
            
            if 'daily' not in data:
                return None
                
            daily = data['daily']
            df = pd.DataFrame(daily)
            df['time'] = pd.to_datetime(df['time'])
            
            # Replace missing
            df = df.replace([-999.0, -9999.0], pd.NA)
            
            df["year"] = df['time'].dt.year
            df["month"] = df['time'].dt.month
            
            # 1. Summer (Mar 3, Apr 4, May 5)
            summer_df = df[df["month"].isin([3, 4, 5])]
            summer_agg = summer_df.groupby("year").agg({
                "temperature_2m_max": "mean",
                "temperature_2m_min": "mean",
                "precipitation_sum": "sum"
            }).reset_index()
            
            # 2. Rainy (Jun 6, Jul 7, Aug 8, Sep 9)
            rainy_df = df[df["month"].isin([6, 7, 8, 9])]
            rainy_agg = rainy_df.groupby("year").agg({
                "temperature_2m_max": "mean",
                "temperature_2m_min": "mean",
                "precipitation_sum": "sum",
                "et0_fao_evapotranspiration": "mean",
                "wind_speed_10m_max": "mean"
            }).reset_index()
            
            merged = pd.merge(summer_agg, rainy_agg, on="year", suffixes=("_summer", "_rainy"), how="outer")
            
            final_rows = []
            for _, row in merged.iterrows():
                final_rows.append({
                    "District": district,
                    "Crop_Year": int(row["year"]),
                    "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)": round(row["temperature_2m_max_summer"], 2) if pd.notna(row["temperature_2m_max_summer"]) else None,
                    "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)": round(row["temperature_2m_min_summer"], 2) if pd.notna(row["temperature_2m_min_summer"]) else None,
                    "Summer MAR-MAY PERCIPITATION (Millimeters)": round(row["precipitation_sum_summer"], 2) if pd.notna(row["precipitation_sum_summer"]) else None,
                    "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)": round(row["temperature_2m_max_rainy"], 2) if pd.notna(row["temperature_2m_max_rainy"]) else None,
                    "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)": round(row["temperature_2m_min_rainy"], 2) if pd.notna(row["temperature_2m_min_rainy"]) else None,
                    "Rainy JUN-SEP PERCIPITATION (Millimeters)": round(row["precipitation_sum_rainy"], 2) if pd.notna(row["precipitation_sum_rainy"]) else None,
                    "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)": round(row["et0_fao_evapotranspiration"], 2) if pd.notna(row["et0_fao_evapotranspiration"]) else None,
                    "Rainy JUN-SEP WINDSPEED (Meter per second)": round(row["wind_speed_10m_max"], 2) if pd.notna(row["wind_speed_10m_max"]) else None,
                })
                
            return final_rows
    except urllib.error.HTTPError as e:
        print(f"HTTP Error {e.code}: {e.read().decode()}")
        if e.code == 429:
            return "RATE_LIMIT"
        return None
    except Exception as e:
        print(f"Error: {e}")
        return None

def main():
    print("Loading dataset...")
    df = pd.read_csv(DATA_PATH)
    non_mendeley = df[df['Source'] != 'MENDELEY']
    districts = non_mendeley['District_Name'].dropna().astype(str).str.strip().str.upper().unique()
    districts = sorted(list(districts))
    
    TARGET_SUCCESS = 700
    success_count = 0
    
    # Optional: Read existing so we can resume
    existing_districts = set()
    if os.path.exists(OUT_PATH):
        try:
            existing = pd.read_csv(OUT_PATH)
            existing_districts = set(existing['District'].unique())
        except:
            pass
            
    print(f"Starting Open-Meteo 1966-1980 fetcher. Resuming with {len(existing_districts)} already done.")
    
    for district in districts:
        if district in existing_districts:
            continue
            
        if success_count >= TARGET_SUCCESS:
            break
            
        lat, lon = geocode_district(district)
        if not lat:
            continue
            
        print(f"Fetching {district} (Open-Meteo 1966-1980)...", end=" ", flush=True)
        res = fetch_openmeteo_weather(district, lat, lon)
        
        if res == "RATE_LIMIT":
            print("RATE LIMITED! Sleeping for exactly 60 minutes...")
            time.sleep(3600)
            # Try again after an hour
            print(f"Waking up! Retrying {district}...")
            res = fetch_openmeteo_weather(district, lat, lon)
            
        if res and res != "RATE_LIMIT":
            df_new = pd.DataFrame(res)
            if os.path.exists(OUT_PATH):
                df_new.to_csv(OUT_PATH, mode='a', header=False, index=False)
            else:
                df_new.to_csv(OUT_PATH, index=False)
            success_count += 1
            print(f"OK ({success_count}/{TARGET_SUCCESS})")
        else:
            print("FAILED")
            time.sleep(60) # Wait 1 minute if blocked!

if __name__ == "__main__":
    main()
