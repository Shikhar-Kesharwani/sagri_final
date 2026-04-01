"""
CROP RECOMMENDATION TRAINING SCRIPT (Random Forest)
---------------------------------------------------
INSTRUCTIONS FOR GOOGLE COLAB:
1. Go to https://colab.research.google.com/
2. Paste this code into a new notebook cell.
3. Upload your Kaggle `kaggle.json` token to download the dataset automatically,
   OR manually upload the `Crop_recommendation.csv` to Colab.
4. Run the cell to train and save the model as `crop_random_forest.pkl`.
"""

import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import joblib

def main():
    print("🚀 Starting Crop Recommendation Training...")

    # Optional: Automatically download from Kaggle if token exists
    if not os.path.exists("Crop_recommendation.csv"):
        print("Dataset not found locally. Ensure you have 'kaggle.json' uploaded if running in Colab!")
        os.system("pip install -q kaggle")
        os.system("mkdir -p ~/.kaggle && cp kaggle.json ~/.kaggle/ && chmod 600 ~/.kaggle/kaggle.json")
        os.system("kaggle datasets download -d atharvaingle/crop-recommendation-dataset")
        os.system("unzip -q crop-recommendation-dataset.zip")
    
    # 1. Load Data
    print("📊 Loading dataset...")
    df = pd.read_csv('Crop_recommendation.csv')
    
    # 2. Prepare Features and Target
    X = df.drop('label', axis=1) # Nitrogen, Phosphorus, Potassium, temp, etc.
    y = df['label']              # Target crop name
    
    # 3. Split into Train & Test
    print("✂️ Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # 4. Train Model
    print("🧠 Training Random Forest Classifier...")
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # 5. Evaluate
    print("📈 Evaluating model...")
    predictions = model.predict(X_test)
    acc = accuracy_score(y_test, predictions)
    print(f"✅ Accuracy on Unseen Data: {acc*100:.2f}%")
    print("\nDetailed Report:\n", classification_report(y_test, predictions))
    
    # 6. Save Model
    model_filename = 'crop_random_forest.pkl'
    joblib.dump(model, model_filename)
    print(f"🎯 Model successfully trained and saved as '{model_filename}'!")
    print("Now you can download this .pkl file and put it in your backend folder.")

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"Error: {e}")
        print("If you are missing the dataset, make sure 'Crop_recommendation.csv' is in the same folder.")
