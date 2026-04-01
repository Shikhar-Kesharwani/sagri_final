import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
import joblib
import os

def generate_risk_dataset():
    print("🧬 Generating custom Crop Failure Risk dataset...")
    
    # Defining optimal conditions for crops in your UI
    optimal = {
        'wheat':     {'temp': 20, 'rain': 75,  'hum': 50, 'ph': 6.5},
        'rice':      {'temp': 24, 'rain': 220, 'hum': 82, 'ph': 6.0},
        'cotton':    {'temp': 25, 'rain': 90,  'hum': 75, 'ph': 6.5},
        'sugarcane': {'temp': 30, 'rain': 150, 'hum': 80, 'ph': 7.0},
        'maize':     {'temp': 22, 'rain': 80,  'hum': 65, 'ph': 6.0},
    }

    data = []
    samples = 1000
    
    for crop, opt in optimal.items():
        for _ in range(samples):
            # Generate random realistic values
            temp = float(np.random.normal(opt['temp'], 10))
            rain = float(max(0, np.random.normal(opt['rain'], 50)))
            hum = float(min(100, max(0, np.random.normal(opt['hum'], 20))))
            ph = float(min(14, max(0, np.random.normal(opt['ph'], 1.5))))
            
            # Calculate Risk based on deviation
            # Max deviation before 100% risk: 15C temp, 100mm rain, 40% hum, 2 pH
            temp_risk = min(100, (abs(temp - opt['temp']) / 15.0) * 100) * 0.35
            rain_risk = min(100, (abs(rain - opt['rain']) / 100.0) * 100) * 0.35
            hum_risk  = min(100, (abs(hum - opt['hum']) / 40.0) * 100) * 0.20
            ph_risk   = min(100, (abs(ph - opt['ph']) / 2.0) * 100) * 0.10
            
            total_risk = temp_risk + rain_risk + hum_risk + ph_risk
            
            # Add some randomness for noise
            total_risk = min(100, max(0, total_risk + np.random.normal(0, 5)))
            
            data.append({
                'cropType': crop,
                'soilPh': ph,
                'rainfall': rain,
                'temperature': temp,
                'humidity': hum,
                'riskLevel': total_risk
            })
            
    df = pd.DataFrame(data)
    # One-hot encode the crop string
    return pd.get_dummies(df, columns=['cropType'])

def main():
    print("🚀 Starting Crop Failure Risk Training...")
    df = generate_risk_dataset()
    
    X = df.drop('riskLevel', axis=1)
    y = df['riskLevel']
    
    print("✂️ Splitting data...")
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print("🧠 Training Random Forest Regressor on 5,000 rows...")
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    preds = model.predict(X_test)
    print(f"✅ R2 Score: {r2_score(y_test, preds):.2f}")
    
    # Save the model AND the feature columns so backend knows how to pad missing dummy vars
    # Instead of just saving locally, we'll save it straight into the backend for the user.
    out_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'backend', 'crop_risk_model.pkl')
    
    # In case they run this from another folder:
    if not os.path.isdir(os.path.dirname(out_path)):
        # Fallback to local
        out_path = 'crop_risk_model.pkl'
        
    joblib.dump({'model': model, 'features': list(X.columns)}, out_path)
    print(f"🎯 Saved '{out_path}'!")

if __name__ == "__main__":
    main()
