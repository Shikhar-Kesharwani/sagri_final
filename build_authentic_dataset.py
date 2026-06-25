"""
build_enhanced_dataset.py

Improvements over v1:
  1. Rainfall on the CORRECT scale — uses ICAR annual requirements, not Kaggle water-demand values
  2. Season column (Kharif / Rabi / Zaid / Perennial)
  3. Irrigation flag (1 = needs irrigation, 0 = rainfed OK)
  4. Soil texture compatibility gate (Sandy / Loamy / Clay / Laterite)
  5. Weighted match scoring (temperature=3pts, ph=2pts, NPK=1pt each, humidity=1pt)
  6. Agro-climatic zone stored for future district-level expansion
  7. match_score exported — used as sample_weight during retraining

Algorithm:
  For each Kaggle row:
    a. Map its rainfall/temperature/ph/NPK to ICAR crop requirement ranges
    b. For each state profile:
       - Hard gate: temperature must overlap
       - Hard gate: soil texture must be compatible with the crop
       - Hard gate: check HARD_EXCLUSIONS
       - Soft score: rainfall overlap? (using ICAR annual rainfall), ph overlap, NPK overlap
    c. Cap 60 rows per (crop, state) pair to prevent class imbalance
"""

import pandas as pd
import numpy as np
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geo_exclusions import HARD_EXCLUSIONS, is_soil_compatible, CROP_SEASON

SOURCE_KAGGLE  = "backend/data/Crop_recommendation.csv"
ICAR_REQS      = "backend/data/enhanced_crop_requirements.csv"
PROFILES       = "backend/data/state_profiles.csv"
OUTPUT         = "backend/data/authentic_state_crop_data.csv"

print("Loading data...")
kaggle_df = pd.read_csv(SOURCE_KAGGLE)
icar_df   = pd.read_csv(ICAR_REQS)
profiles  = pd.read_csv(PROFILES)

kaggle_df["label"] = kaggle_df["label"].str.lower().str.strip()

# Build ICAR requirements lookup by crop label
icar_lookup = {}
for _, row in icar_df.iterrows():
    icar_lookup[row["label"]] = row.to_dict()

print(f"Kaggle rows      : {len(kaggle_df)}")
print(f"ICAR crops       : {len(icar_lookup)}")
print(f"State profiles   : {len(profiles)}")


def score_state_match(kaggle_row, state_profile, icar_req):
    """
    Returns (score, disqualified) for a crop-state pair.

    Scoring weights (max = 10):
      Temperature overlap         : 3 pts  (most critical)
      pH overlap                  : 2 pts  (important for nutrient availability)
      Annual rainfall suitability : 2 pts  (ICAR-based real rainfall)
      Humidity match              : 1 pt
      N match                     : 0.5 pt
      P match                     : 0.5 pt
      K match                     : 0.5 pt
    """
    # ── Hard gates (disqualify entirely) ──────────────────────────
    temp = kaggle_row["temperature"]
    if not (state_profile["Temp_min"] <= temp <= state_profile["Temp_max"]):
        return 0, True

    state_soil = state_profile["Dominant_Soil"]
    crop_name  = kaggle_row["label"]
    if not is_soil_compatible(crop_name, state_soil):
        return 0, True

    # ── Soft scoring ──────────────────────────────────────────────
    score = 3.0  # base: temperature already passed

    # pH — state pH range vs Kaggle ph value
    ph = kaggle_row["ph"]
    if state_profile["pH_min"] <= ph <= state_profile["pH_max"]:
        score += 2.0

    # Annual rainfall — state actual rainfall vs ICAR crop requirement
    if icar_req:
        state_rain_mid = (state_profile["Rain_min"] + state_profile["Rain_max"]) / 2
        if icar_req["rainfall_min"] <= state_rain_mid <= icar_req["rainfall_max"]:
            score += 2.0

    # Humidity
    hum = kaggle_row["humidity"]
    if state_profile["Humidity_min"] <= hum <= state_profile["Humidity_max"]:
        score += 1.0

    # NPK — state soil average vs Kaggle crop value
    if state_profile["N_min"] <= kaggle_row["N"] <= state_profile["N_max"]:
        score += 0.5
    if state_profile["P_min"] <= kaggle_row["P"] <= state_profile["P_max"]:
        score += 0.5
    if state_profile["K_min"] <= kaggle_row["K"] <= state_profile["K_max"]:
        score += 0.5

    return round(score, 1), False


MAX_PER_PAIR = 60

print("\nBuilding enhanced dataset...")
output_rows  = []
pair_counts  = {}
skipped_rows = 0

for _, kaggle_row in kaggle_df.iterrows():
    crop     = kaggle_row["label"]
    excluded = HARD_EXCLUSIONS.get(crop, [])
    icar_req = icar_lookup.get(crop)
    season   = CROP_SEASON.get(crop, "Kharif")

    state_scores = []
    for _, sp in profiles.iterrows():
        if sp["State"] in excluded:
            continue

        score, disqualified = score_state_match(kaggle_row, sp, icar_req)
        if disqualified:
            continue

        state_scores.append((sp["State"], sp["Dominant_Soil"], sp["Agro_Zone"], score))

    # sort by score descending
    state_scores.sort(key=lambda x: x[3], reverse=True)

    added = False
    for state, soil, zone, score in state_scores:
        key = (crop, state)
        if pair_counts.get(key, 0) >= MAX_PER_PAIR:
            continue

        temp = kaggle_row["temperature"]
        hum = kaggle_row["humidity"]
        svp = 0.61078 * np.exp((17.27 * temp) / (temp + 237.3))
        vpd = svp * (1 - (hum / 100))

        n_val = kaggle_row["N"]
        p_val = kaggle_row["P"]
        k_val = kaggle_row["K"]

        n_p_ratio = n_val / p_val if p_val > 0 else n_val
        n_k_ratio = n_val / k_val if k_val > 0 else n_val

        # Convert soil string to physics
        SOIL_PHYSICS = {
            "Sandy": (85, 10, 5),
            "Loamy": (40, 40, 20),
            "Clay": (15, 15, 70),
            "Laterite": (20, 20, 60),
            "Black": (15, 20, 65),
            "Red": (50, 25, 25),
            "Silt": (10, 80, 10)
        }
        sand_pct, silt_pct, clay_pct = SOIL_PHYSICS.get(soil, (40, 40, 20)) # default loamy

        new_row = {
            "N":           n_val,
            "P":           p_val,
            "K":           k_val,
            "temperature": temp,
            "humidity":    hum,
            "ph":          kaggle_row["ph"],
            "rainfall":    kaggle_row["rainfall"],
            "label":       crop,
            "season":      season,
            "irrigation":  1 if icar_req and icar_req.get("irrigation") == 1 else 0,
            "soil_texture": soil,
            "Sand_Pct":    sand_pct,
            "Silt_Pct":    silt_pct,
            "Clay_Pct":    clay_pct,
            "VPD":         round(vpd, 3),
            "N_P_Ratio":   round(n_p_ratio, 3),
            "N_K_Ratio":   round(n_k_ratio, 3),
            "State":       state,
            "Agro_Zone":   zone,
            "match_score": score,
        }
        output_rows.append(new_row)
        pair_counts[key] = pair_counts.get(key, 0) + 1
        added = True

    if not added:
        skipped_rows += 1


output_df = pd.DataFrame(output_rows)

print(f"\n-- Results --------------------------------------------------")
print(f"  Input rows      : {len(kaggle_df)}")
print(f"  Output rows     : {len(output_df)}")
print(f"  Crops covered   : {output_df['label'].nunique()}")
print(f"  States covered  : {output_df['State'].nunique()}")
print(f"  Skipped rows    : {skipped_rows}")

print(f"\n-- Season distribution --------------------------------------")
print(output_df["season"].value_counts().to_string())

print(f"\n-- Soil texture distribution --------------------------------")
print(output_df["soil_texture"].value_counts().to_string())

print(f"\n-- Match score distribution (max=10) ------------------------")
print(output_df["match_score"].value_counts().sort_index(ascending=False).head(15).to_string())

print(f"\n-- Rows per crop --------------------------------------------")
print(output_df.groupby("label")["State"].count().sort_values(ascending=False).to_string())

print(f"\n-- Rows per state -------------------------------------------")
print(output_df["State"].value_counts().to_string())

all_crops   = set(kaggle_df["label"].unique())
found_crops = set(output_df["label"].unique())
missing     = all_crops - found_crops
if missing:
    print(f"\nWARNING: these crops got zero state matches: {missing}")
else:
    print(f"\nAll {len(all_crops)} crops have at least one state match.")

output_df.to_csv(OUTPUT, index=False)
print(f"\nSaved to: {OUTPUT}")
