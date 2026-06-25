import pandas as pd
import requests
import time
import os
import json

DATA_PATH = 'backend/data/india_crop_risk_master.csv'
OUT_PATH = 'backend/data/district_coordinates.csv'

def geocode_districts():
    print("Loading dataset to find districts needing geocoding...")
    df = pd.read_csv(DATA_PATH)
    
    # We only need to geocode non-Mendeley rows (the ones missing weather)
    # But it doesn't hurt to geocode all unique districts we can find, just in case.
    non_mendeley = df[df['Source'] != 'MENDELEY']
    
    # Clean district names
    districts = non_mendeley['District_Name'].dropna().astype(str).str.strip().str.upper().unique()
    districts = sorted(list(districts))
    
    print(f"Found {len(districts)} unique districts to geocode.")
    
    # Load existing to resume if interrupted
    existing_data = {}
    if os.path.exists(OUT_PATH):
        try:
            exist_df = pd.read_csv(OUT_PATH)
            for _, row in exist_df.iterrows():
                existing_data[row['District']] = (row['Latitude'], row['Longitude'])
            print(f"Loaded {len(existing_data)} already geocoded districts from cache.")
        except Exception as e:
            print(f"Could not load existing cache: {e}")
            
    results = []
    
    # Use a custom user agent as requested by Nominatim TOS
    headers = {
        'User-Agent': 'AgriCropRiskModel/1.0 (contact: student@example.com)'
    }
    
    for i, district in enumerate(districts):
        if district in existing_data:
            lat, lon = existing_data[district]
            results.append({'District': district, 'Latitude': lat, 'Longitude': lon})
            continue
            
        print(f"[{i+1}/{len(districts)}] Geocoding {district}...")
        
        # Clean up some common issues in Indian district names
        search_query = f"{district}, India"
        
        try:
            url = f"https://geocoding-api.open-meteo.com/v1/search"
            params = {
                'name': district,
                'count': 1,
                'format': 'json'
            }
            
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if "results" in data and len(data["results"]) > 0:
                    lat = float(data["results"][0]['latitude'])
                    lon = float(data["results"][0]['longitude'])
                    results.append({'District': district, 'Latitude': lat, 'Longitude': lon})
                    print(f"  -> Found: {lat}, {lon}")
                else:
                    # Try a broader search by removing some suffixes
                    clean_district = district.replace(' DISTRICT', '').replace(' RURAL', '').replace(' URBAN', '')
                    params['name'] = clean_district
                    time.sleep(0.2)
                    
                    retry_resp = requests.get(url, params=params, timeout=10)
                    retry_data = retry_resp.json() if retry_resp.status_code == 200 else {}
                    
                    if "results" in retry_data and len(retry_data["results"]) > 0:
                        lat = float(retry_data["results"][0]['latitude'])
                        lon = float(retry_data["results"][0]['longitude'])
                        results.append({'District': district, 'Latitude': lat, 'Longitude': lon})
                        print(f"  -> Found (retry): {lat}, {lon}")
                    else:
                        print(f"  -> NOT FOUND")
                        results.append({'District': district, 'Latitude': None, 'Longitude': None})
            else:
                print(f"  -> API Error: {response.status_code}")
                results.append({'District': district, 'Latitude': None, 'Longitude': None})
                
        except Exception as e:
            print(f"  -> Request Exception: {e}")
            results.append({'District': district, 'Latitude': None, 'Longitude': None})
            
        time.sleep(0.1)  # Faster since Open-Meteo allows it
        
        # Save progress every 50 requests
        if (i + 1) % 50 == 0:
            pd.DataFrame(results).to_csv(OUT_PATH, index=False)
            print("--- Progress saved ---")
            
    # Final save
    out_df = pd.DataFrame(results)
    out_df.to_csv(OUT_PATH, index=False)
    
    success_count = out_df['Latitude'].notna().sum()
    print(f"\nGeocoding Complete!")
    print(f"Successfully geocoded: {success_count}/{len(districts)} districts")
    print(f"Failed: {len(districts) - success_count}")
    print(f"Saved to {OUT_PATH}")

if __name__ == "__main__":
    geocode_districts()
