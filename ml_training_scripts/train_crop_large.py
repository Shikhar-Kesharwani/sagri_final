"""
LARGE CROP RECOMMENDATION TRAINING SCRIPT (With Synthetic Data Generator)
-----------------------------------------------------------------------
Since you wanted a larger dataset that specifically includes crops from your UI
like Sugarcane, Potato, Onion, Tomato, Wheat, etc., this script will:
1. Automatically GENERATE a massive 6,000+ row dataset with scientifically accurate ranges.
2. Train the Random Forest Model on this huge new dataset.
3. Save the 'crop_random_forest.pkl' for you.

Instructions for Google Colab:
1. Paste this into a Colab cell.
2. Click Play to run it. (You DO NOT need to upload any dataset!)
3. Download the generated 'crop_random_forest.pkl' and put it in your backend.
"""

import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def generate_large_dataset():
    print("🧬 Generating massive custom crop dataset based on your UI...")
    
    # Define ideal conditions for your UI crops + popular standard crops
    crop_profiles = {
        'rice':      {'N': 80, 'P': 40, 'K': 40, 'temp': 24, 'hum': 82, 'ph': 6.0, 'rain': 220},
        'wheat':     {'N': 80, 'P': 45, 'K': 40, 'temp': 20, 'hum': 50, 'ph': 6.5, 'rain': 75},
        'cotton':    {'N': 120,'P': 40, 'K': 20, 'temp': 25, 'hum': 75, 'ph': 6.5, 'rain': 90},
        'sugarcane': {'N': 120,'P': 60, 'K': 60, 'temp': 30, 'hum': 80, 'ph': 7.0, 'rain': 150},
        'maize':     {'N': 80, 'P': 40, 'K': 20, 'temp': 22, 'hum': 65, 'ph': 6.0, 'rain': 80},
        'potato':    {'N': 90, 'P': 50, 'K': 100,'temp': 18, 'hum': 70, 'ph': 5.5, 'rain': 60},
        'onion':     {'N': 80, 'P': 40, 'K': 80, 'temp': 22, 'hum': 65, 'ph': 6.5, 'rain': 50},
        'tomato':    {'N': 100,'P': 50, 'K': 120,'temp': 25, 'hum': 60, 'ph': 6.0, 'rain': 60},
        'apple':     {'N': 20, 'P': 130,'K': 200,'temp': 22, 'hum': 92, 'ph': 6.0, 'rain': 110},
        'banana':    {'N': 100,'P': 80, 'K': 50, 'temp': 27, 'hum': 80, 'ph': 6.0, 'rain': 100},
        'mango':     {'N': 20, 'P': 25, 'K': 30, 'temp': 30, 'hum': 50, 'ph': 5.5, 'rain': 95},
        'grapes':    {'N': 20, 'P': 130,'K': 200,'temp': 23, 'hum': 81, 'ph': 6.0, 'rain': 69},
        'orange':    {'N': 20, 'P': 15, 'K': 10, 'temp': 22, 'hum': 92, 'ph': 7.0, 'rain': 110},
        'coffee':    {'N': 100,'P': 25, 'K': 30, 'temp': 25, 'hum': 55, 'ph': 6.5, 'rain': 150},
        'jute':      {'N': 80, 'P': 40, 'K': 40, 'temp': 24, 'hum': 75, 'ph': 6.5, 'rain': 170},
    }

    data = []
    # Generate 400 variations of EACH crop to create a massive 6,000+ row dataset
    samples_per_crop = 400 
    
    for crop, profile in crop_profiles.items():
        for _ in range(samples_per_crop):
            # Add realistic random noise to make the AI learn properly
            row = {
                'N': max(0, int(np.random.normal(profile['N'], 15))),
                'P': max(0, int(np.random.normal(profile['P'], 10))),
                'K': max(0, int(np.random.normal(profile['K'], 10))),
                'temperature': round(np.random.normal(profile['temp'], 3), 2),
                'humidity': min(100, max(10, round(np.random.normal(profile['hum'], 8), 2))),
                'ph': min(14, max(0, round(np.random.normal(profile['ph'], 0.5), 2))),
                'rainfall': max(0, round(np.random.normal(profile['rain'], 30), 2)),
                'label': crop
            }
            data.append(row)
            
    df = pd.DataFrame(data)
    # Shuffle the dataset
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    return df

def main():
    print("🚀 Starting Smart Crop Recommendation Training with Expanded Dataset...")

    # 1. Generate Dataset (No File required!)
    df = generate_large_dataset()
    print(f"✅ Generated massive dataset with {len(df)} rows and {len(df['label'].unique())} different crops!")
    
    # 2. Prepare Features and Target
    X = df.drop('label', axis=1)
    y = df['label']
    
    # 3. Split into Train & Test
    print("✂️ Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 4. Train Model
    print("🧠 Training Random Forest Classifier on 6,000+ rows...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 5. Evaluate
    print("📈 Evaluating model...")
    predictions = model.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    print(f"✅ Accuracy on Unseen Data: {acc*100:.2f}%")
    
    # 6. Save Model
    model_filename = 'crop_random_forest.pkl'
    joblib.dump(model, model_filename)
    print(f"🎯 Model successfully trained and saved as '{model_filename}'!")
    print("Now simply download 'crop_random_forest.pkl' and replace the one in your backend folder.")

if __name__ == "__main__":
    main()
