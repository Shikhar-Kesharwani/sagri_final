import pandas as pd
import json
import os
from prophet import Prophet
from prophet.serialize import model_to_json

DATA_PATH = os.path.join("data", "clean_prices.csv")
MODEL_PATH = os.path.join("models", "price_prophet_model.json")

print("Loading cleaned dataset...")
if not os.path.exists(DATA_PATH):
    print("ERROR: clean_prices.csv not found. Run prepare_price_data.py first!")
    exit(1)

df = pd.read_csv(DATA_PATH)
df['Arrival_Date'] = pd.to_datetime(df['Arrival_Date'])

print("Aggregating prices to daily averages for each commodity...")
# Group by Date and Commodity, taking the average price across all states/markets for the overall national trend
daily_prices = df.groupby(['Arrival_Date', 'Commodity'])['Modal_Price'].mean().reset_index()

commodities = daily_prices['Commodity'].unique()
print(f"Found {len(commodities)} unique commodities to train on.")

models = {}

os.makedirs("models", exist_ok=True)

print("Training Facebook Prophet AI Models (This will take a moment)...")

for i, crop in enumerate(commodities):
    print(f"[{i+1}/{len(commodities)}] Training model for: {crop}...")
    
    # Filter data for this specific crop
    crop_data = daily_prices[daily_prices['Commodity'] == crop].copy()
    
    # Prophet requires columns to be named 'ds' (datestamp) and 'y' (value)
    crop_data = crop_data.rename(columns={'Arrival_Date': 'ds', 'Modal_Price': 'y'})
    
    # Initialize and train the model
    # We use daily seasonality since prices fluctuate daily, and yearly for crop seasons
    m = Prophet(yearly_seasonality=True, daily_seasonality=False)
    
    try:
        m.fit(crop_data)
        # Serialize the model to a JSON string
        models[crop] = model_to_json(m)
    except Exception as e:
        print(f"  Warning: Could not train model for {crop}. Error: {e}")

print(f"Saving all {len(models)} trained models to {MODEL_PATH}...")
with open(MODEL_PATH, 'w') as f:
    json.dump(models, f)

print("\nSUCCESS! The AI Brain is trained and saved.")
