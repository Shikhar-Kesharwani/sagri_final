"""
Build enhanced_crop_requirements.csv

This replaces the Kaggle dataset's crop water requirement values (20-300mm)
with REAL ICAR annual rainfall requirements for Indian agriculture.
Also adds:
  - season     : Kharif / Rabi / Zaid
  - irrigation : 1 = requires irrigation, 0 = rainfed acceptable
  - soil_texture: Sandy / Loamy / Clay / Laterite / Any

Source references:
  - ICAR Handbook of Agriculture (2022 edition)
  - ICAR Crop Production Guide
  - FAO AQUASTAT crop water requirements
"""

import pandas as pd
import numpy as np

# Each entry: (crop, N_min, N_max, P_min, P_max, K_min, K_max,
#              temp_min, temp_max, humidity_min, humidity_max,
#              ph_min, ph_max, annual_rainfall_min, annual_rainfall_max,
#              season, irrigation_needed, soil_texture)

CROP_SPECS = [
    # ---- Cereals (Kharif) ----
    ("rice",        80, 120, 40,  60,  40,  60,  20, 35, 70, 90, 5.0, 6.5, 1200, 1800, "Kharif",  1, "Clay"),
    ("maize",       80, 110, 40,  60,  30,  50,  18, 32, 55, 75, 5.5, 7.0,  600, 1200, "Kharif",  0, "Loamy"),
    ("jute",       100, 130, 60,  80,  40,  60,  23, 35, 70, 90, 6.0, 7.0, 1500, 2500, "Kharif",  0, "Loamy"),

    # ---- Cereals (Rabi) ----
    # wheat is not in the original 22 but added for completeness - will merge with Kaggle
    # We keep only the 22 crops that exist in Kaggle

    # ---- Pulses (Kharif) ----
    ("pigeonpeas",  20,  40, 20,  40,  20,  40,  18, 38, 50, 75, 5.5, 7.5,  600, 1200, "Kharif",  0, "Loamy"),
    ("mungbean",    20,  40, 20,  40,  20,  40,  25, 35, 50, 70, 6.0, 7.5,  400,  900, "Kharif",  0, "Loamy"),
    ("blackgram",   20,  40, 20,  40,  20,  40,  25, 35, 60, 80, 6.0, 7.5,  600, 1000, "Kharif",  0, "Loamy"),
    ("mothbeans",   20,  35, 15,  30,  15,  35,  25, 42, 30, 60, 6.0, 8.0,  200,  600, "Kharif",  0, "Sandy"),

    # ---- Pulses (Rabi) ----
    ("chickpea",    40,  80, 60,  80,  40,  80,  15, 25, 35, 60, 6.0, 8.0,  600, 1000, "Rabi",    0, "Loamy"),
    ("lentil",      20,  40, 40,  60,  20,  40,  15, 25, 55, 75, 6.0, 8.0,  350,  750, "Rabi",    0, "Loamy"),
    ("kidneybeans", 40,  80, 40,  70,  40,  80,  15, 28, 50, 75, 6.0, 7.5,  700, 1400, "Kharif",  0, "Loamy"),

    # ---- Oilseeds / Cash (Kharif) ----
    ("cotton",      60, 100, 40,  60,  40,  60,  20, 38, 40, 70, 6.0, 8.0,  500, 1000, "Kharif",  1, "Loamy"),

    # ---- Fruits (Perennial) ----
    ("banana",      80, 120, 20,  40,  60, 100,  24, 32, 70, 90, 6.0, 7.5, 1000, 2000, "Kharif",  1, "Loamy"),
    ("mango",       20,  40, 10,  30,  20,  40,  24, 38, 50, 75, 5.5, 7.5,  800, 1500, "Zaid",    0, "Loamy"),
    ("coconut",     20,  40, 10,  30,  60, 100,  22, 35, 70, 90, 5.5, 7.0, 1000, 3000, "Kharif",  0, "Sandy"),
    ("papaya",      50,  80, 30,  50,  50,  80,  22, 38, 60, 80, 6.0, 7.0,  800, 1500, "Kharif",  1, "Loamy"),
    ("orange",      20,  40, 10,  30,  10,  30,  15, 35, 60, 80, 6.0, 7.5,  750, 1500, "Rabi",    1, "Loamy"),
    ("apple",       20,  40, 10,  30,  10,  30,  15, 24, 60, 80, 5.5, 7.0,  800, 1500, "Rabi",    0, "Loamy"),
    ("grapes",      20,  40, 10,  30,  10,  30,  10, 38, 50, 75, 6.0, 7.5,  600, 1200, "Zaid",    1, "Loamy"),
    ("pomegranate", 20,  40, 10,  30,  10,  30,  18, 32, 40, 70, 6.5, 7.5,  400,  800, "Zaid",    1, "Loamy"),

    # ---- Spice / Beverage ----
    ("coffee",      80, 120, 20,  40,  30,  60,  20, 30, 65, 90, 5.0, 6.5, 1500, 2500, "Kharif",  0, "Laterite"),

    # ---- Vegetables / Cucurbits (Zaid) ----
    ("watermelon",  20,  40, 20,  40,  30,  50,  24, 35, 30, 60, 6.0, 7.5,  400,  700, "Zaid",    1, "Sandy"),
    ("muskmelon",   20,  40, 20,  40,  30,  50,  24, 35, 30, 60, 6.0, 7.5,  300,  600, "Zaid",    1, "Sandy"),
]

columns = [
    "label", "N_min", "N_max", "P_min", "P_max", "K_min", "K_max",
    "temp_min", "temp_max", "humidity_min", "humidity_max",
    "ph_min", "ph_max", "rainfall_min", "rainfall_max",
    "season", "irrigation", "soil_texture"
]

df = pd.DataFrame(CROP_SPECS, columns=columns)
df.to_csv("backend/data/enhanced_crop_requirements.csv", index=False)
print(f"Saved enhanced_crop_requirements.csv with {len(df)} crops")
print(df[["label","season","irrigation","soil_texture","rainfall_min","rainfall_max"]].to_string())
