import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import RandomizedSearchCV
import os

DATA_PATH = os.path.join("data", "clean_prices_with_weather.csv")

print(f"Loading {DATA_PATH}...")
if not os.path.exists(DATA_PATH):
    print("ERROR: clean_prices_with_weather.csv not found!")
    exit(1)
    
df = pd.read_csv(DATA_PATH)

print("Encoding Commodities and States... (This might take a moment)")
encoded_data = pd.get_dummies(df, columns=['Commodity', 'State'])

X = encoded_data.drop(columns=['Modal_Price'])
y = encoded_data['Modal_Price']

print("Sampling 20% of data for rapid Hyperparameter Grid Search...")
sample_X = X.sample(frac=0.2, random_state=42)
sample_y = y.loc[sample_X.index]

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [20, 30, None],
    'min_samples_split': [2, 5, 10],
    'min_samples_leaf': [1, 2]
}

print("Configuring tuning engine to search for optimal mathematical parameters...")
rf = RandomForestRegressor(random_state=42, n_jobs=-1)
search = RandomizedSearchCV(
    estimator=rf,
    param_distributions=param_grid,
    n_iter=5, # Reduced iteration to keep execution under 1 minute for this test
    cv=3, 
    verbose=2, 
    random_state=42, 
    n_jobs=-1
)

print(f"Executing AI grid search on {len(sample_X)} rows...")
search.fit(sample_X, sample_y)

print("\n----------------------------------------")
print("SEARCH COMPLETE!")
print(f"The optimal parameters are: {search.best_params_}")
print(f"Best R2 score on sample data: {search.best_score_:.4f}")
print("----------------------------------------\n")

os.makedirs("models", exist_ok=True)
with open(os.path.join("models", "optimal_params.txt"), "w") as f:
    f.write(str(search.best_params_))
print("Optimal parameters saved!")
