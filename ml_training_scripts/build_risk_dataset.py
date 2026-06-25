"""
Phase 2: Data Engineering Pipeline
====================================
Merges three authentic Indian agricultural datasets:
  1. Mendeley (12,803 rows) - Climate + Yield merged for 560 districts (1990–2015)
  2. Kaggle (246,091 rows) - Official Indian Govt APY data
  3. ICRISAT (16,146 rows) - Deep historical yield data for 29 crops (1966–2017)

Outputs: backend/data/india_crop_risk_master.csv
"""

import pandas as pd
import numpy as np
import os

# ─────────────────────────────────────────────
# PATHS
# ─────────────────────────────────────────────
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(BASE, "backend", "data")

MENDELEY_PATH = os.path.join(DATA, "mendeley_merged_climate_yield.xls")
KAGGLE_PATH   = os.path.join(DATA, "kaggle_crop_production.csv")
ICRISAT_PATH  = os.path.join(DATA, "icrisat_dld.csv")
OUTPUT_PATH   = os.path.join(DATA, "india_crop_risk_master.csv")

# ─────────────────────────────────────────────
# STEP A: Process ICRISAT (Wide → Long format)
# ─────────────────────────────────────────────
print("=" * 60)
print("Loading ICRISAT dataset...")
icrisat_raw = pd.read_csv(ICRISAT_PATH)

# The crops we care about (those with AREA + PRODUCTION + YIELD columns)
icrisat_crops = [
    "RICE", "WHEAT", "SORGHUM", "PEARL MILLET", "MAIZE", "FINGER MILLET",
    "BARLEY", "CHICKPEA", "PIGEONPEA", "GROUNDNUT", "SESAMUM",
    "RAPESEED AND MUSTARD", "SAFFLOWER", "CASTOR", "LINSEED",
    "SUNFLOWER", "SOYABEAN", "OILSEEDS", "SUGARCANE", "COTTON"
]

icrisat_rows = []
for crop in icrisat_crops:
    area_col  = f"{crop} AREA (1000 ha)"
    prod_col  = f"{crop} PRODUCTION (1000 tons)"
    yield_col = f"{crop} YIELD (Kg per ha)"

    if yield_col not in icrisat_raw.columns:
        continue

    subset = icrisat_raw[["State Name", "Dist Name", "Year", area_col, prod_col, yield_col]].copy()
    subset.columns = ["State_Name", "District_Name", "Crop_Year", "Area", "Production", "Yield_kg_ha"]
    subset["Crop"] = crop.title()
    subset["Source"] = "ICRISAT"
    icrisat_rows.append(subset)

icrisat_long = pd.concat(icrisat_rows, ignore_index=True)
icrisat_long.dropna(subset=["Yield_kg_ha"], inplace=True)
# ICRISAT area is in 1000 ha, production in 1000 tons — normalise yield to kg/ha (already in kg/ha)
print(f"ICRISAT processed: {icrisat_long.shape[0]:,} rows, {icrisat_long['Crop'].nunique()} crops")

# ─────────────────────────────────────────────
# STEP B: Process Kaggle (246k official APY)
# ─────────────────────────────────────────────
print("\nLoading Kaggle dataset...")
kaggle = pd.read_csv(KAGGLE_PATH)
kaggle.rename(columns={"Season": "Season"}, inplace=True)

# Compute yield where missing (Production tons / Area ha * 1000 to get kg/ha)
kaggle["Yield_kg_ha"] = (kaggle["Production"] / kaggle["Area"]) * 1000
kaggle.dropna(subset=["Yield_kg_ha"], inplace=True)
kaggle = kaggle[kaggle["Yield_kg_ha"] < 50000]   # drop impossible values (data errors)
kaggle = kaggle[kaggle["Yield_kg_ha"] > 10]       # drop near-zero garbage

kaggle_out = kaggle[["State_Name", "District_Name", "Crop_Year", "Season", "Crop", "Area", "Production", "Yield_kg_ha"]].copy()
kaggle_out["Source"] = "KAGGLE"
print(f"Kaggle processed: {kaggle_out.shape[0]:,} rows")

# ─────────────────────────────────────────────
# STEP C: Process Mendeley (climate-merged XLS)
# ─────────────────────────────────────────────
print("\nLoading Mendeley dataset (this has the weather data!)...")
mendeley_raw = pd.read_excel(MENDELEY_PATH)

# Mendeley is in wide format: one row per district per year with columns for
# each crop's yield AND monthly climate data. We'll extract it per crop.
mendeley_crops = {
    "Rice":        "RICE YIELD (Kg per ha)",
    "Pearl Millet":"PEARL MILLET YIELD (Kg per ha)",
    "Chickpea":    "CHICKPEA YIELD (Kg per ha)",
    "Groundnut":   "GROUNDNUT YIELD (Kg per ha)",
    "Sugarcane":   "SUGARCANE YIELD (Kg per ha)",
}

# Climate columns to carry forward (seasonal aggregates for simplicity)
climate_cols = [
    "Summer MAR-MAY MAXIMUM TEMPERATURE (Centigrate)",
    "Rainy JUN-SEP MAXIMUM TEMPERATURE (Centigrate)",
    "Summer MAR-MAY MINIMUM TEMPERATURE (Centigrate)",
    "Rainy JUN-SEP MINIMUM TEMPERATURE (Centigrate)",
    "Rainy JUN-SEP PERCIPITATION (Millimeters)",
    "Summer MAR-MAY PERCIPITATION (Millimeters)",
    "Rainy JUN-SEP ACTUAL EVAPOTRANSPIRATION (Millimeters)",
    "Rainy JUN-SEP WINDSPEED (Meter per second)",
    "NITROGEN CONSUMPTION (tons)",
    "PHOSPHATE CONSUMPTION (tons)",
    "POTASH CONSUMPTION (tons)",
    "GROSS IRRIGATED AREA (1000 ha)",
]

mendeley_rows = []
for crop_name, yield_col in mendeley_crops.items():
    if yield_col not in mendeley_raw.columns:
        continue
    keep_cols = ["State Name", "Dist Name", "Year", yield_col] + [c for c in climate_cols if c in mendeley_raw.columns]
    subset = mendeley_raw[keep_cols].copy()
    subset.rename(columns={
        "State Name":  "State_Name",
        "Dist Name":   "District_Name",
        "Year":        "Crop_Year",
        yield_col:     "Yield_kg_ha",
    }, inplace=True)
    subset["Crop"] = crop_name
    subset["Source"] = "MENDELEY"
    mendeley_rows.append(subset)

mendeley_long = pd.concat(mendeley_rows, ignore_index=True)
mendeley_long.dropna(subset=["Yield_kg_ha"], inplace=True)
mendeley_long = mendeley_long[mendeley_long["Yield_kg_ha"] > 10]
print(f"Mendeley processed: {mendeley_long.shape[0]:,} rows, {mendeley_long['Crop'].nunique()} crops")

# ─────────────────────────────────────────────
# STEP D: Merge all three datasets
# ─────────────────────────────────────────────
print("\nMerging all three datasets...")
master = pd.concat([icrisat_long, kaggle_out, mendeley_long], ignore_index=True, sort=False)

# Standardise string columns
for col in ["State_Name", "District_Name", "Crop"]:
    master[col] = master[col].astype(str).str.strip().str.upper()

# Deduplicate on state + district + crop + year
master.drop_duplicates(subset=["State_Name", "District_Name", "Crop", "Crop_Year"], keep="last", inplace=True)
master.sort_values(["State_Name", "District_Name", "Crop", "Crop_Year"], inplace=True)
print(f"After merge & deduplication: {master.shape[0]:,} rows")

# ─────────────────────────────────────────────
# STEP E: Engineer the Failure Risk Target
# ─────────────────────────────────────────────
print("\nEngineering crop_failure label (5-year rolling mean, 25% threshold)...")

master["rolling_mean_yield"] = (
    master.groupby(["State_Name", "District_Name", "Crop"])["Yield_kg_ha"]
    .transform(lambda x: x.shift(1).rolling(5, min_periods=3).mean())
)

master["yield_shock_pct"] = (
    (master["rolling_mean_yield"] - master["Yield_kg_ha"]) / master["rolling_mean_yield"]
) * 100

# Binary failure flag: 1 = yield dropped >25% below 5-year norm
master["crop_failure"] = (master["yield_shock_pct"] > 25).astype(int)

# Drop rows where we couldn't calculate rolling mean (first few years)
master.dropna(subset=["rolling_mean_yield"], inplace=True)

# Verify failure rate is between 10–25% (as Claude advised)
failure_rate = master["crop_failure"].mean() * 100
print(f"Failure rate in dataset: {failure_rate:.2f}%")
if failure_rate < 10:
    print("[WARNING] Failure rate below 10%! Consider lowering threshold to 20%.")
elif failure_rate > 30:
    print("[WARNING] Failure rate above 30%! Consider raising threshold to 30%.")
else:
    print("[OK] Failure rate is in the healthy 10-30% range.")

# ─────────────────────────────────────────────
# STEP F: Final Cleanup & Validation
# ─────────────────────────────────────────────
print("\nRunning final cleanup and validation...")

# Drop states with fewer than 5 years of data
year_counts = master.groupby(["State_Name", "Crop"])["Crop_Year"].nunique()
valid_groups = year_counts[year_counts >= 5].index
master = master[master.set_index(["State_Name", "Crop"]).index.isin(valid_groups)]

# Drop yield outliers (already done above, but double-check)
master = master[(master["Yield_kg_ha"] > 10) & (master["Yield_kg_ha"] < 50000)]

print(f"\n[DONE] FINAL DATASET SHAPE: {master.shape[0]:,} rows x {master.shape[1]} columns")
print(f"   States covered: {master['State_Name'].nunique()}")
print(f"   Districts covered: {master['District_Name'].nunique()}")
print(f"   Crops covered: {master['Crop'].nunique()}")
print(f"   Year range: {int(master['Crop_Year'].min())} – {int(master['Crop_Year'].max())}")
print(f"   Crop Failure cases: {master['crop_failure'].sum():,} / {master.shape[0]:,}")

# ─────────────────────────────────────────────
# STEP G: Save Master Dataset
# ─────────────────────────────────────────────
master.to_csv(OUTPUT_PATH, index=False)
print(f"\n[SAVED] Master dataset saved to: {OUTPUT_PATH}")
