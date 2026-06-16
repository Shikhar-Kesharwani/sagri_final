import pandas as pd
import os

INPUT_PATH = os.path.join("data", "clean_prices_with_weather.csv")
OUTPUT_PATH = os.path.join("data", "clean_prices_final.csv")

print(f"Loading {INPUT_PATH}...")
if not os.path.exists(INPUT_PATH):
    print("ERROR: clean_prices_with_weather.csv not found!")
    exit(1)

df = pd.read_csv(INPUT_PATH)

print("Sorting database perfectly by chronological order...")
# Sort by State, Commodity, Year, Month to ensure time flows sequentially
df = df.sort_values(by=['State', 'Commodity', 'Year', 'Month']).reset_index(drop=True)

print("Calculating the 'Price_1_Month_Ago' lag feature...")
# We use groupby to make sure we don't accidentally shift the price of 
# Wheat in Punjab onto the first month of Potato in Gujarat.
df['Price_1_Month_Ago'] = df.groupby(['State', 'Commodity'])['Modal_Price'].shift(1)

# Drop rows where the Lag feature is missing (the very first month of recorded history for every crop)
original_len = len(df)
df = df.dropna(subset=['Price_1_Month_Ago'])
new_len = len(df)
print(f"Dropped {original_len - new_len} rows because they represent the very first month of data (no previous month exists to reference).")

print(f"Saving final upgraded database to {OUTPUT_PATH}")
df.to_csv(OUTPUT_PATH, index=False)
print("DONE! Lag feature successfully injected.")
