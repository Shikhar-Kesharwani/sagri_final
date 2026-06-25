import pandas as pd

df = pd.read_csv("backend/data/authentic_state_crop_data.csv")

print("=== DATASET OVERVIEW ===")
print(f"Total rows    : {len(df)}")
print(f"Total columns : {len(df.columns)}")
print(f"Columns       : {list(df.columns)}")
print(f"\nCrops  : {sorted(df['label'].unique())}")
print(f"States : {sorted(df['State'].unique())}")

print("\n=== ROWS PER STATE ===")
print(df['State'].value_counts())

print("\n=== SAMPLE ROWS ===")
print(df.sample(5).to_string())

print("\n=== SANITY CHECKS ===")
coconut_states = df[df['label']=='coconut']['State'].unique()
print(f"Coconut states (Punjab must NOT appear): {coconut_states}")

rice_states = df[df['label']=='rice']['State'].unique()
print(f"Rice states (Rajasthan must NOT appear): {rice_states}")

apple_states = df[df['label']=='apple']['State'].unique()
print(f"Apple states (Kerala must NOT appear): {apple_states}")

coffee_states = df[df['label']=='coffee']['State'].unique()
print(f"Coffee states (Punjab must NOT appear): {coffee_states}")

print("\n=== FINAL VERDICT ===")
checks = []
checks.append(("Columns include State and match_score", "State" in df.columns and "match_score" in df.columns))
checks.append(("Punjab NOT in coconut states", "Punjab" not in coconut_states))
checks.append(("Rajasthan NOT in rice states", "Rajasthan" not in rice_states))
checks.append(("Kerala NOT in apple states", "Kerala" not in apple_states))
checks.append(("At least 10 states", df['State'].nunique() >= 10))
checks.append(("Total rows > 2200", len(df) > 2200))

all_pass = True
for desc, result in checks:
    status = "PASS" if result else "FAIL"
    if not result: all_pass = False
    print(f"  [{status}] {desc}")

print(f"\n{'ALL CHECKS PASSED!' if all_pass else 'SOME CHECKS FAILED!'}")
