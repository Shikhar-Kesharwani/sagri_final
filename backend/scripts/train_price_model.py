import pandas as pd
import pickle
import os
import ast
from sklearn.ensemble import RandomForestRegressor

DATA_PATH = os.path.join("data", "clean_prices_final_inflation.csv")
MODEL_PATH = os.path.join("models", "price_forecast_model.pkl")
PARAMS_PATH = os.path.join("models", "optimal_params.txt")

print(f"Loading Super-Charged Database from {DATA_PATH}...")
if not os.path.exists(DATA_PATH):
    print("ERROR: Database not found. Run add_weather_features.py first!")
    exit(1)

df = pd.read_csv(DATA_PATH)

commodities = df['Commodity'].unique()
states = df['State'].unique()

print("Encoding Commodities and States... ")
# One-Hot Encode
encoded_data = pd.get_dummies(df, columns=['Commodity', 'State'])

# The features now include Year, Month, Temperature, Rainfall, plus the One-Hot encoded States and Commodities
X = encoded_data.drop(columns=['Modal_Price', 'Price_1_Month_Ago', 'Adjusted_Price'])
y = encoded_data['Adjusted_Price']

# Load the optimal parameters discovered by the Tuning script
params = {'n_estimators': 50, 'max_depth': 20, 'random_state': 42, 'n_jobs': -1}
if os.path.exists(PARAMS_PATH):
    try:
        with open(PARAMS_PATH, "r") as f:
            params_str = f.read()
            best_params = ast.literal_eval(params_str)
            params.update(best_params)
            print(f"Loaded Optimal Hyperparameters: {best_params}")
    except Exception as e:
        print(f"Could not load optimal params, using defaults. Error: {e}")

print(f"Training the Upgraded AI Brain on {len(df):,} rows with Weather Data...")
model = RandomForestRegressor(**params)
model.fit(X, y)

# Save the trained model
os.makedirs("models", exist_ok=True)
model_data = {
    'model': model,
    'features': X.columns.tolist(),
    'commodities': commodities.tolist(),
    'states': states.tolist()
}

print(f"Saving Upgraded Model to {MODEL_PATH}...")
with open(MODEL_PATH, 'wb') as f:
    pickle.dump(model_data, f)

print("\nSUCCESS! The Super-Charged AI Brain is trained and saved.")
