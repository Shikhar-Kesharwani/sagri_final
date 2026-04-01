from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os
import random

app = FastAPI(title="Sagri ML Backend API")

# Setup CORS to allow your React app (localhost:5173 / localhost:3000) to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Load Models (if they exist) ---
CROP_MODEL_PATH = "crop_random_forest.pkl"
crop_model = None

if os.path.exists(CROP_MODEL_PATH):
    print("✅ Loaded trained Random Forest crop model.")
    crop_model = joblib.load(CROP_MODEL_PATH)
else:
    print("⚠️ Warning: No trained crop model found. API will use a fallback mock response until you train and upload the model.")

# --- Load Disease Model ---
DISEASE_MODEL_PATH = "disease_mobilenet.keras"
DISEASE_CLASSES_PATH = "disease_classes.txt"
disease_model = None
disease_classes = []

if os.path.exists(DISEASE_MODEL_PATH) and os.path.exists(DISEASE_CLASSES_PATH):
    try:
        import tensorflow as tf
        disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
        with open(DISEASE_CLASSES_PATH, "r") as f:
            disease_classes = [line.strip() for line in f.readlines()]
        print("✅ Loaded trained Disease Detection model.")
    except ImportError:
        print("⚠️ Found disease model, but TensorFlow is not installed. Uncomment it in requirements.txt and run pip install.")
    except Exception as e:
        print(f"⚠️ Could not load disease model: {e}")
else:
    print("⚠️ Warning: No disease model found.")

# --- Load Prophet Model ---
PRICE_MODEL_PATH = "price_prophet_model.json"
price_model = None

if os.path.exists(PRICE_MODEL_PATH):
    try:
        from prophet.serialize import model_from_json
        with open(PRICE_MODEL_PATH, 'r') as fin:
            price_model = model_from_json(fin.read())
        print("✅ Loaded trained Prophet price forecasting model.")
    except ImportError:
        print("⚠️ Found price model, but prophet is not installed. Uncomment it in requirements.txt and run pip install.")
    except Exception as e:
        print(f"⚠️ Could not load price model: {e}")
else:
    print("⚠️ Warning: No price model found.")

# --- Load Risk Model ---
RISK_MODEL_PATH = "crop_risk_model.pkl"
risk_model_data = None

if os.path.exists(RISK_MODEL_PATH):
    print("✅ Loaded trained Random Forest crop risk model.")
    risk_model_data = joblib.load(RISK_MODEL_PATH)
else:
    print("⚠️ Warning: No trained crop risk model found.")


# --- 2. Define Data Models ---
class CropInput(BaseModel):
    # Example input expected from React Frontend form
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class PriceForecastInput(BaseModel):
    crop_name: str
    days_ahead: int = 30

class RiskInput(BaseModel):
    cropType: str
    soilPh: float
    rainfall: float
    temperature: float
    humidity: float

# --- 3. API Endpoints ---

@app.get("/")
def read_root():
    return {"status": "online", "message": "Sagri ML Backend API is running!"}

@app.post("/api/predict_crop")
def predict_crop(data: CropInput):
    """
    Endpoint to predict the best crop based on soil/weather conditions.
    """
    if crop_model:
        # We have a real trained model!
        try:
            # Convert JSON input to Pandas DataFrame exactly as scikit-learn expects
            input_df = pd.DataFrame([data.dict()])
            prediction = crop_model.predict(input_df)[0]
            return {"recommended_crop": prediction, "is_mock": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
    else:
        # Fallback if no real model is present yet
        mock_crops = ["wheat", "mungbean", "rice", "maize", "cotton", "coffee"]
        return {"recommended_crop": random.choice(mock_crops), "is_mock": True, "warning": "Actual model not found. Upload crop_random_forest.pkl"}


@app.post("/api/forecast_price")
def forecast_price(data: PriceForecastInput):
    """
    Endpoint to forecast prices for the next X days.
    """
    import datetime
    import random
    
    if price_model:
        # Real prediction mode
        try:
            # We predict exactly data.days_ahead from today
            future = price_model.make_future_dataframe(periods=data.days_ahead)
            forecast_df = price_model.predict(future)
            
            # Extract just the future portion (last n rows)
            future_predictions = forecast_df.tail(data.days_ahead)
            
            # Format to match UI expectations
            forecast = []
            for _, row in future_predictions.iterrows():
                # Add some unique crop multiplier since mock dataset was generic
                multiplier = 1.0
                if data.crop_name.lower() == 'wheat': multiplier = 1.1
                elif data.crop_name.lower() == 'cotton': multiplier = 1.5
                elif data.crop_name.lower() == 'sugarcane': multiplier = 0.8
                elif data.crop_name.lower() == 'rice': multiplier = 1.0
                
                final_price = float(row['yhat']) * multiplier
                
                forecast.append({
                    "date": row['ds'].strftime('%Y-%m-%d'),
                    "predicted_price": round(final_price, 2)
                })
                
            return {
                "crop": data.crop_name,
                "forecast": forecast,
                "is_mock": False
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
            
    else:
        # Fallback to mock
        forecast = []
        base_price = 2000 if data.crop_name.lower() == "rice" else 1500
        today = datetime.date.today()
        for i in range(data.days_ahead):
            target_date = today + datetime.timedelta(days=i)
            projected_price = base_price + (i * 2.5) + random.uniform(-50, 50)
            forecast.append({
                "date": target_date.isoformat(),
                "predicted_price": round(projected_price, 2)
            })
            
        return {
            "crop": data.crop_name,
            "forecast": forecast,
            "is_mock": True
        }

@app.post("/api/predict_risk")
def predict_risk(data: RiskInput):
    """
    Predict crop failure risk (0-100)
    """
    if risk_model_data:
        try:
            model = risk_model_data['model']
            features = risk_model_data['features']
            
            input_dict = data.dict()
            crop = input_dict.pop('cropType').lower()
            
            # Create a dataframe with all zeros for features
            df = pd.DataFrame(columns=features)
            df.loc[0] = 0
            
            df.loc[0, 'soilPh'] = input_dict['soilPh']
            df.loc[0, 'rainfall'] = input_dict['rainfall']
            df.loc[0, 'temperature'] = input_dict['temperature']
            df.loc[0, 'humidity'] = input_dict['humidity']
            
            crop_col = f"cropType_{crop}"
            if crop_col in features:
                df.loc[0, crop_col] = 1
                
            prediction = model.predict(df)[0]
            
            return {
                "riskLevel": round(prediction, 1),
                "is_mock": False
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Fallback to mock logic if model missing
        import random
        return {
            "riskLevel": random.randint(10, 90),
            "is_mock": True
        }

class DiseaseInput(BaseModel):
    image_data: str # Base64 Data URL

@app.post("/api/detect_disease")
def detect_disease(data: DiseaseInput):
    """
    Endpoint to predict plant diseases from a Base64 encoded image.
    """
    if disease_model and len(disease_classes) > 0:
        try:
            import tensorflow as tf
            import numpy as np
            import base64
            
            # 1. Parse Base64 image
            header, encoded = data.image_data.split(",", 1)
            img_bytes = base64.b64decode(encoded)
            
            # 2. Preprocess to match MobileNetV2 inputs
            img_tensor = tf.image.decode_image(img_bytes, channels=3)
            img_tensor = tf.image.resize(img_tensor, [224, 224])
            img_array = tf.expand_dims(img_tensor, 0)
            
            # 3. Predict
            predictions = disease_model.predict(img_array)
            class_idx = np.argmax(predictions[0])
            confidence = float(predictions[0][class_idx]) * 100
            disease_name = disease_classes[class_idx]
            
            is_healthy = "healthy" in disease_name.lower()
            
            return {
                "disease": disease_name.replace("_", " "),
                "confidence": round(confidence, 1),
                "severity": "None" if is_healthy else ("High" if confidence > 80 else "Medium"),
                "recommendation": "Crop looks great!" if is_healthy else f"AI identified {disease_name}.",
                "treatment": [] if is_healthy else ["Consult local expert for fungicide recommendations.", "Remove highly affected leaves."],
                "color": "green" if is_healthy else "red"
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))
    else:
        # Throw strict error if real model is not present
        raise HTTPException(
            status_code=503, 
            detail="The Real AI Model (disease_mobilenet.keras) could not be loaded. Please ensure it is in the backend folder and tensorflow is installed."
        )

