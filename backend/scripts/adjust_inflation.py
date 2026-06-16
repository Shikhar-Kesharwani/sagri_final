import pandas as pd
import os

INPUT_PATH = os.path.join("data", "clean_prices_final.csv")
OUTPUT_PATH = os.path.join("data", "clean_prices_final_inflation.csv")

print(f"Loading {INPUT_PATH}...")
if not os.path.exists(INPUT_PATH):
    print("ERROR: clean_prices_final.csv not found!")
    exit(1)

df = pd.read_csv(INPUT_PATH)

# Official World Bank Inflation Data for India (Approximate CPI % increase per year)
inflation_rates = {
    2000: 4.01, 2001: 3.78, 2002: 4.30, 2003: 3.81, 2004: 3.77, 2005: 4.25,
    2006: 5.80, 2007: 6.37, 2008: 8.35, 2009: 10.88, 2010: 11.99, 2011: 8.86,
    2012: 9.31, 2013: 10.91, 2014: 6.65, 2015: 4.91, 2016: 4.95, 2017: 3.33,
    2018: 3.94, 2019: 3.73, 2020: 6.62, 2021: 5.13, 2022: 6.70, 2023: 5.50,
    2024: 5.00, 2025: 4.50, 2026: 4.00, 2027: 4.00
}

TARGET_YEAR = 2026

print(f"Calculating compound inflation multipliers targeting {TARGET_YEAR} Rupee value...")
multipliers = {}
for year in range(2000, 2028):
    multiplier = 1.0
    # Compounding inflation from the 'year' up to 'TARGET_YEAR'
    if year < TARGET_YEAR:
        for y in range(year, TARGET_YEAR):
            multiplier *= (1 + inflation_rates.get(y, 5.0) / 100.0)
    multipliers[year] = multiplier

# Quick diagnostic print
print(f"Example: Rs.100 in 2005 = Rs.{100 * multipliers[2005]:.2f} in 2026")
print(f"Example: Rs.100 in 2015 = Rs.{100 * multipliers[2015]:.2f} in 2026")

print("Adjusting historic Modal_Prices and Lag Features to Modern Value...")
df['Adjusted_Price'] = df.apply(lambda row: row['Modal_Price'] * multipliers.get(row['Year'], 1.0), axis=1)
df['Adjusted_Price_1_Month_Ago'] = df.apply(lambda row: row['Price_1_Month_Ago'] * multipliers.get(row['Year'], 1.0), axis=1)

print(f"Saving fully modernized database to {OUTPUT_PATH}")
df.to_csv(OUTPUT_PATH, index=False)
print("DONE! Inflation engine successfully applied.")
