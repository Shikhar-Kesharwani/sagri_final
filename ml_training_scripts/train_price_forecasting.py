"""
PRICE FORECASTING TRAINING SCRIPT (Prophet)
-------------------------------------------
INSTRUCTIONS FOR GOOGLE COLAB:
1. Go to https://colab.research.google.com/
2. Paste this code into a new notebook cell.
3. Prophet handles missing data and seasonality magically.
4. Replace 'your_prices_dataset.csv' with an actual dataset before running!
"""

import pandas as pd
from prophet import Prophet
import json
from prophet.serialize import model_to_json, model_from_json
import os

def main():
    print("🚀 Starting Price Forecasting Training...")

    dataset_path = 'mock_prices.csv'
    
    # --- Generate Mock Data if none exists for demonstration ---
    if not os.path.exists(dataset_path):
        print("⚠️ No dataset found. Generating mock historical price data for maize...")
        # Create 2 years of daily mock data with a slight upward trend and some noise
        dates = pd.date_range(start='2022-01-01', periods=730, freq='D')
        import numpy as np
        # Base price 2000 + trend + seasonal sin wave + noise
        prices = 2000 + np.arange(730) * 0.5 + np.sin(np.arange(730) / 365 * 2 * np.pi) * 300 + np.random.normal(0, 50, 730)
        
        mock_df = pd.DataFrame({'Date': dates, 'Price': prices})
        mock_df.to_csv(dataset_path, index=False)
        print(f"✅ Generated mock data: {dataset_path}")
    # -----------------------------------------------------------

    # 1. Load Data
    print("📊 Loading dataset...")
    df = pd.read_csv(dataset_path)

    # 2. Format specifically for Prophet
    # Prophet strictly requires columns: 'ds' for datetimes, 'y' for numeric values
    df_prophet = df.rename(columns={'Date': 'ds', 'Price': 'y'})
    df_prophet['ds'] = pd.to_datetime(df_prophet['ds'])

    # 3. Initialize and Train Model
    print("🧠 Training Prophet Model...")
    model = Prophet(yearly_seasonality=True, daily_seasonality=False)
    model.fit(df_prophet)

    # 4. Optional: Predict the next 30 days just to show it works
    print("🔮 Forecasting next 30 days...")
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)
    print("Preview of predictions:")
    print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

    # 5. Export Model (Prophet uses JSON serialization)
    print("💾 Saving Model...")
    model_filename = "price_prophet_model.json"
    with open(model_filename, 'w') as fout:
        fout.write(model_to_json(model))
        
    print(f"🎯 Model trained and saved as '{model_filename}'!")

if __name__ == "__main__":
    main()
