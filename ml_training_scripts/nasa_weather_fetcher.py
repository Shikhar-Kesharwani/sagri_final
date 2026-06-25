import pandas as pd
import requests
import time
import os

DATA_PATH = 'backend/data/india_crop_risk_master.csv'
OUT_PATH = 'backend/data/district_yearly_weather_nasa_full.csv'

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

def fetch_nasa_weather(district, lat, lon):
    url = 'https://power.larc.nasa.gov/api/temporal/daily/point'
    params = {
        'parameters': 'T2M_MAX,T2M_MIN,PRECTOTCORR,WS10M_MAX',
        'community': 'AG',
        'longitude': lon,
        'latitude': lat,
        'start': '19810101',
        'end': '20171231',
        'format': 'JSON'
    }
    
    try:
        resp = requests.get(url, params=params, timeout=20)
        if resp.status_code != 200:
            return None
            
        data = resp.json()
        if 'properties' not in data:
            return None
            
        params_data = data['properties']['parameter']
        
        # Convert to pandas
        df = pd.DataFrame(params_data)
        df.index = pd.to_datetime(df.index, format="%Y%m%d")
        
        # Replace missing value flag (-999.0) with NaN
        df = df.replace(-999.0, pd.NA)
        
        df["year"] = df.index.year
        df["month"] = df.index.month
        
        # 1. Summer (Mar 3, Apr 4, May 5)
        summer_df = df[df["month"].isin([3, 4, 5])]
        summer_agg = summer_df.groupby("year").agg({
            "T2M_MAX": "mean",
            "T2M_MIN": "mean",
            "PRECTOTCORR": "sum"
        }).reset_index()
        
        # 2. Rainy (Jun 6, Jul 7, Aug 8, Sep 9)
        rainy_df = df[df["month"].isin([6, 7, 8, 9])]
        rainy_agg = rainy_df.groupby("year").agg({
            "T2M_MAX": "mean",
            "T2M_MIN": "mean",
            "PRECTOTCORR": "sum",
            "WS10M_MAX": "mean"
        }).reset_index()
        
        merged = pd.merge(summer_agg, rainy_agg, on="year", suffixes=("_summer", "_rainy"), how="outer")
        
        final_rows = []
        for _, row in merged.iterrows():
            final_rows.append({
                "District": district,
                "Crop_Year": int(row["year"]),
                "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)": round(row["T2M_MAX_summer"], 2) if pd.notna(row["T2M_MAX_summer"]) else None,
                "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)": round(row["T2M_MIN_summer"], 2) if pd.notna(row["T2M_MIN_summer"]) else None,
                "Summer MAR-MAY PERCIPITATION (Millimeters)": round(row["PRECTOTCORR_summer"], 2) if pd.notna(row["PRECTOTCORR_summer"]) else None,
                "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)": round(row["T2M_MAX_rainy"], 2) if pd.notna(row["T2M_MAX_rainy"]) else None,
                "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)": round(row["T2M_MIN_rainy"], 2) if pd.notna(row["T2M_MIN_rainy"]) else None,
                "Rainy JUN-SEP PERCIPITATION (Millimeters)": round(row["PRECTOTCORR_rainy"], 2) if pd.notna(row["PRECTOTCORR_rainy"]) else None,
                "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)": None, # NASA doesn't provide this easily, will impute
                "Rainy JUN-SEP WINDSPEED (Meter per second)": round(row["WS10M_MAX"], 2) if pd.notna(row["WS10M_MAX"]) else None,
            })
            
        return final_rows
    except:
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
            
    print(f"Starting robust NASA POWER fetcher. Target: {TARGET_SUCCESS} new districts. Resuming with {len(existing_districts)} already done.")
    
    for district in districts:
        if district in existing_districts:
            continue
            
        if success_count >= TARGET_SUCCESS:
            break
            
        lat, lon = geocode_district(district)
        if not lat:
            continue
            
        print(f"Fetching {district} (NASA POWER)...", end=" ", flush=True)
        res = fetch_nasa_weather(district, lat, lon)
        
        if res:
            df_new = pd.DataFrame(res)
            if os.path.exists(OUT_PATH):
                df_new.to_csv(OUT_PATH, mode='a', header=False, index=False)
            else:
                df_new.to_csv(OUT_PATH, index=False)
            success_count += 1
            print(f"OK ({success_count}/{TARGET_SUCCESS})")
        else:
            print("FAILED")
            
        time.sleep(1.5) # NASA POWER rate limit respect

if __name__ == "__main__":
    main()
