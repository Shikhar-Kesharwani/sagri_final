"""
retrain_model.py  — Enhanced v2 (Mathematical Pristine Version)

Changes from v1/v2-basic:
  - Added One-Hot Encoding for categorical features (season, soil_texture)
  - Added VPD, N/P Ratio, N/K Ratio
  - Replaced ordinal soil with continuous Soil Physics (Sand/Silt/Clay Pct)
  - Applies SMOTE to balance the dataset
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import accuracy_score, classification_report
import pickle
import json
import warnings

warnings.filterwarnings("ignore", category=UserWarning)

try:
    from imblearn.over_sampling import SMOTE
    from imblearn.pipeline import Pipeline as ImbPipeline
    HAS_SMOTE = True
except ImportError:
    HAS_SMOTE = False
    print("Warning: imbalanced-learn not installed. Skipping SMOTE.")

DATA        = "backend/data/authentic_state_crop_data.csv"
MODEL_OUT   = "backend/models/crop_random_forest.pkl"
FEATURES_OUT= "backend/models/model_features.json"

print("Loading dataset...")
df = pd.read_csv(DATA)
print(f"Total rows : {len(df)}")

# ── Explicit One-Hot Encoding ────────────────────────────────────────────────
seasons = ["Kharif", "Rabi", "Zaid", "Perennial"]
for s in seasons:
    df[f"season_{s}"] = (df["season"] == s).astype(int)

soil_textures = ["Sandy", "Loamy", "Clay", "Laterite", "Black", "Red", "Silt"]
for st in soil_textures:
    df[f"soil_{st}"] = (df["soil_texture"] == st).astype(int)

if "irrigation" not in df.columns:
    df["irrigation"] = 0

# ── Features (State is NOT included) ─────────────────────────────────────────
numeric_features = ["N", "P", "K", "temperature", "humidity", "ph", "rainfall", 
                    "Sand_Pct", "Silt_Pct", "Clay_Pct", 
                    "VPD", "N_P_Ratio", "N_K_Ratio"]

FEATURES = numeric_features

X = df[FEATURES]
y = df["label"]

print(f"\nFeatures used  : {len(FEATURES)}")

# ── Train/test split ────────────────────────────────────────────────────────
# CRITICAL FIX: Split must happen BEFORE SMOTE to prevent data leakage!
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# ── SMOTE Balancing (On Training Set ONLY) ──────────────────────────────────
if HAS_SMOTE:
    print("Applying SMOTE to balance training set ONLY...")
    smote = SMOTE(random_state=42)
    X_train_res, y_train_res = smote.fit_resample(X_train, y_train)
    print(f"Training set size after SMOTE: {len(X_train_res)} (was {len(X_train)})")
else:
    X_train_res, y_train_res = X_train, y_train

model = RandomForestClassifier(
    n_estimators=300,
    max_depth=25,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    class_weight="balanced", 
)

print(f"\nTraining model on {len(X_train_res)} rows...")
model.fit(X_train_res, y_train_res)

# ── Evaluation ────────────────────────────────────────────────────────────────
# Evaluate on truly unseen X_test
y_pred   = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"\nModel accuracy (on Unseen Test Set): {accuracy*100:.1f}%")

print("\n-- Per-crop precision and recall --------------------------------")
print(classification_report(y_test, y_pred))

print("Running 5-fold cross validation (Properly Pipelined)...")
if HAS_SMOTE:
    # CRITICAL FIX: SMOTE must be inside the CV pipeline so it only runs on training folds
    cv_pipeline = ImbPipeline([
        ('smote', SMOTE(random_state=42)),
        ('model', RandomForestClassifier(n_estimators=300, max_depth=25, min_samples_leaf=2, random_state=42, n_jobs=-1, class_weight="balanced"))
    ])
    cv_scores = cross_val_score(cv_pipeline, X, y, cv=5, scoring="accuracy", n_jobs=-1)
else:
    cv_scores = cross_val_score(model, X, y, cv=5, scoring="accuracy", n_jobs=-1)

print(f"CV accuracy : {cv_scores.mean()*100:.1f}% +/- {cv_scores.std()*100:.1f}%")

# ── Feature importance ────────────────────────────────────────────────────────
print("\n-- Feature importance -------------------------------------------")
for feat, imp in sorted(zip(FEATURES, model.feature_importances_), key=lambda x: x[1], reverse=True)[:15]:
    bar = "#" * int(imp * 50)
    print(f"  {feat:<15} {imp:.4f}  {bar}")

# ── Sample prediction ─────────────────────────────────────────────────────────
sample    = X_test.iloc[:1]
probs     = model.predict_proba(sample)[0]
top3_idx  = np.argsort(probs)[::-1][:3]
print("\n-- Sample top-3 prediction --------------------------------------")
for i in top3_idx:
    print(f"  {model.classes_[i]:<20} {probs[i]*100:.1f}%")

# ── Save model + feature list ─────────────────────────────────────────────────
with open(MODEL_OUT, "wb") as f:
    pickle.dump(model, f)

with open(FEATURES_OUT, "w") as f:
    json.dump({
        "features": FEATURES,
        "seasons": seasons,
        "soil_textures": soil_textures
    }, f, indent=2)

print(f"\nModel saved to   : {MODEL_OUT}")
print(f"Features saved to: {FEATURES_OUT}")
print("Done.")
