from pathlib import Path
import base64
import io
import json
import logging
import random
import time

import joblib
import pandas as pd
import requests as http_requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# --- API Keys ---
FAST2SMS_API_KEY = "e8ngMPO4d1ctybvp2IomN3iTkUYuZVWzaFKfE6LqRBXDSQjwx0TNE8wlHfO15rnBIuLzcvdhX439VZmG"

app = FastAPI(title="Sagri ML Backend API")
logger = logging.getLogger("sagri.backend")

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Load Models ---
CROP_MODEL_PATH = MODEL_DIR / "crop_random_forest.pkl"
crop_model = None

if CROP_MODEL_PATH.exists():
    logger.info("Loaded trained Random Forest crop model.")
    crop_model = joblib.load(CROP_MODEL_PATH)
else:
    logger.warning("No trained crop model found. API will use a fallback mock response.")

DISEASE_MODEL_PATH = MODEL_DIR / "disease_mobilenet.keras"
DISEASE_CLASSES_PATH = MODEL_DIR / "disease_classes.txt"
disease_model = None
disease_classes = []

if DISEASE_MODEL_PATH.exists() and DISEASE_CLASSES_PATH.exists():
    try:
        import tensorflow as tf

        disease_model = tf.keras.models.load_model(DISEASE_MODEL_PATH)
        with open(DISEASE_CLASSES_PATH, "r", encoding="utf-8") as f:
            disease_classes = [line.strip() for line in f if line.strip()]
        logger.info("Loaded trained Disease Detection model.")
    except ImportError:
        logger.warning("Found disease model, but TensorFlow is not installed.")
    except Exception as e:
        logger.exception("Could not load disease model: %s", e)
else:
    logger.warning("No disease model found.")

PRICE_MODEL_PATH = MODEL_DIR / "price_forecast_model.pkl"
price_model_data = None

if PRICE_MODEL_PATH.exists():
    try:
        price_model_data = joblib.load(PRICE_MODEL_PATH)
        logger.info("Loaded trained Random Forest price forecasting model.")
    except Exception as e:
        logger.exception("Could not load price model: %s", e)
else:
    logger.warning("No price model found.")

HISTORICAL_DATA_PATH = BASE_DIR / "data" / "clean_prices_final_inflation.csv"
historical_prices_df = None

@app.on_event("startup")
def load_historical_data():
    global historical_prices_df
    logger.info("Loading clean_prices_final_inflation.csv for historical trends...")
    try:
        historical_prices_df = pd.read_csv(HISTORICAL_DATA_PATH)
    except Exception as e:
        logger.exception("Could not load historical data: %s", e)

RISK_MODEL_PATH = MODEL_DIR / "crop_risk_model.pkl"
risk_model_data = None

if RISK_MODEL_PATH.exists():
    logger.info("Loaded trained Random Forest crop risk model.")
    risk_model_data = joblib.load(RISK_MODEL_PATH)
else:
    logger.warning("No trained crop risk model found.")


# --- 2. In-Memory OTP Store ---
# Structure: { identifier(phone/email): { "otp": "123456", "expires": <unix_timestamp> } }
_otp_store: dict = {}
OTP_TTL_SECONDS = 300  # 5 minutes


def _generate_otp() -> str:
    return str(random.randint(100000, 999999))


def _store_otp(identifier: str, otp: str) -> None:
    _otp_store[identifier] = {
        "otp": otp,
        "expires": time.time() + OTP_TTL_SECONDS,
    }


def _verify_stored_otp(identifier: str, otp: str) -> tuple[bool, str]:
    entry = _otp_store.get(identifier)
    if not entry:
        return False, "No OTP found. Please request a new one."
    if time.time() > entry["expires"]:
        _otp_store.pop(identifier, None)
        return False, "OTP has expired. Please request a new one."
    if entry["otp"] != otp:
        return False, "Invalid OTP. Please try again."
    _otp_store.pop(identifier, None)  # One-time use — delete after success
    return True, "OTP verified successfully."


# --- 3. Request Models ---
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


class PriceForecastInput(BaseModel):
    crop_name: str
    state: str = "Maharashtra"  # Default fallback if frontend doesn't send it
    months_ahead: int = 6

class HistoricalPriceInput(BaseModel):
    crop_name: str
    state: str = "Maharashtra"
    months: int = 12


class RiskInput(BaseModel):
    cropType: str
    soilPh: float
    rainfall: float
    temperature: float
    humidity: float


class DiseaseInput(BaseModel):
    image_data: str


class SendSmsOtpInput(BaseModel):
    phone: str  # 10-digit Indian number


class SendEmailOtpInput(BaseModel):
    email: str


class VerifyOtpInput(BaseModel):
    identifier: str  # phone or email
    otp: str


# --- 4. API Endpoints ---
@app.get("/")
def read_root():
    return {"status": "online", "message": "Sagri ML Backend API is running!"}


# ------ OTP Endpoints ------

@app.post("/api/send-sms-otp")
def send_sms_otp(data: SendSmsOtpInput):
    phone = data.phone.strip()
    if len(phone) != 10 or not phone.isdigit():
        raise HTTPException(status_code=400, detail="Invalid phone number. Must be exactly 10 digits.")

    api_key = FAST2SMS_API_KEY
    if not api_key:
        raise HTTPException(status_code=503, detail="Fast2SMS API key not set.")

    otp = _generate_otp()
    _store_otp(phone, otp)

    headers = {"authorization": api_key}
    payload = {
        "message": f"Your SAGRI login OTP is {otp}. Valid for 5 minutes. Do not share this code with anyone.",
        "route": "q",
        "numbers": phone,
        "flash": 0,
    }

    try:
        resp = http_requests.post(
            "https://www.fast2sms.com/dev/bulkV2",
            headers=headers,
            json=payload,
            timeout=10,
        )
        result = resp.json()
        if not result.get("return", False):
            _otp_store.pop(phone, None)
            raise HTTPException(
                status_code=502,
                detail=f"Fast2SMS error: {result.get('message', 'Unknown error')}",
            )
        return {"success": True, "message": f"OTP sent to +91{phone}"}
    except http_requests.RequestException as e:
        _otp_store.pop(phone, None)
        raise HTTPException(status_code=502, detail=f"SMS service unreachable: {str(e)}")


@app.post("/api/verify-sms-otp")
def verify_sms_otp(data: VerifyOtpInput):
    ok, msg = _verify_stored_otp(data.identifier.strip(), data.otp.strip())
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}


@app.post("/api/send-email-otp")
def send_email_otp(data: SendEmailOtpInput):
    email = data.email.strip().lower()
    if "@" not in email or "." not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")

    otp = _generate_otp()
    _store_otp(email, otp)
    # Return OTP to the frontend — EmailJS will deliver the email from the browser
    return {"success": True, "otp": otp, "message": f"OTP generated for {email}"}


@app.post("/api/verify-email-otp")
def verify_email_otp(data: VerifyOtpInput):
    ok, msg = _verify_stored_otp(data.identifier.strip().lower(), data.otp.strip())
    if not ok:
        raise HTTPException(status_code=400, detail=msg)
    return {"success": True, "message": msg}


@app.post("/api/predict_crop")
def predict_crop(data: CropInput):
    if crop_model:
        try:
            input_df = pd.DataFrame([data.model_dump()])
            prediction = crop_model.predict(input_df)[0]
            return {"recommended_crop": prediction, "is_mock": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    mock_crops = ["wheat", "mungbean", "rice", "maize", "cotton", "coffee"]
    return {
        "recommended_crop": random.choice(mock_crops),
        "is_mock": True,
        "warning": "Actual model not found. Upload crop_random_forest.pkl",
    }


STATE_COORDS = {
    "Andhra Pradesh": (15.9129, 79.7400), "Arunachal Pradesh": (28.2180, 94.7278),
    "Assam": (26.2006, 92.9376), "Bihar": (25.0961, 85.3131),
    "Chhattisgarh": (21.2787, 81.8661), "Goa": (15.2993, 74.1240),
    "Gujarat": (22.2587, 71.1924), "Haryana": (29.0588, 76.0856),
    "Himachal Pradesh": (31.1048, 77.1665), "Jharkhand": (23.6102, 85.2799),
    "Karnataka": (15.3173, 75.7139), "Kerala": (10.8505, 76.2711),
    "Madhya Pradesh": (22.9734, 78.6569), "Maharashtra": (19.7515, 75.7139),
    "Manipur": (24.6637, 93.9063), "Meghalaya": (25.4670, 91.3662),
    "Mizoram": (23.1645, 92.9376), "Nagaland": (26.1584, 94.5624),
    "Odisha": (20.9517, 85.0985), "Punjab": (31.1471, 75.3412),
    "Rajasthan": (27.0238, 74.2179), "Sikkim": (27.5330, 88.5122),
    "Tamil Nadu": (11.1271, 78.6569), "Telangana": (18.1124, 79.0193),
    "Tripura": (23.9408, 91.9882), "Uttar Pradesh": (26.8467, 80.9462),
    "Uttarakhand": (30.0668, 79.0193), "West Bengal": (22.9868, 87.8550),
    "Andaman and Nicobar": (11.7401, 92.6586), "Chandigarh": (30.7333, 76.7794),
    "Delhi": (28.7041, 77.1025), "Jammu and Kashmir": (33.7782, 76.5762),
    "Puducherry": (11.9416, 79.8083)
}

@app.post("/api/forecast_price")
def forecast_price(data: PriceForecastInput):
    import datetime
    import requests

    if price_model_data:
        try:
            model = price_model_data['model']
            features = price_model_data['features']
            
            # --- LIVE WEATHER FORECAST FETCH ---
            live_temp = None
            live_rain = None
            recent_price = None
            
            lat_lon = None
            for s_name, coords in STATE_COORDS.items():
                if s_name.lower() in data.state.lower() or data.state.lower() in s_name.lower():
                    lat_lon = coords
                    break
            
            if lat_lon:
                try:
                    lat, lon = lat_lon
                    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=Asia%2FKolkata&forecast_days=14"
                    resp = requests.get(url, timeout=3.0)
                    if resp.status_code == 200:
                        weather_data = resp.json()['daily']
                        max_temps = weather_data['temperature_2m_max']
                        min_temps = weather_data['temperature_2m_min']
                        mean_temps = [(mx+mn)/2 for mx, mn in zip(max_temps, min_temps)]
                        live_temp = sum(mean_temps) / len(mean_temps)
                        
                        total_14_day_rain = sum(weather_data['precipitation_sum'])
                        live_rain = total_14_day_rain * (30/14)
                        logger.info(f"Live Weather Loaded for {data.state}: {live_temp:.1f}C, {live_rain:.1f}mm rain")
                except Exception as e:
                    logger.warning(f"Live Weather API failed: {e}")
            
            # Predict for the next N months (Autoregressive)
            today = datetime.date.today()
            forecast = []
            
            # Get the initial real-world lag price from database
            initial_lag_price = 1000.0
            if historical_prices_df is not None:
                try:
                    mask = (historical_prices_df['State'].str.lower() == data.state.lower()) & \
                           (historical_prices_df['Commodity'].str.lower() == data.crop_name.lower())
                    if not historical_prices_df[mask].empty:
                        initial_lag_price = historical_prices_df[mask]['Adjusted_Price'].iloc[-1]
                except Exception as e:
                    logger.warning(f"Could not fetch initial lag price: {e}")
            
            recent_price = initial_lag_price
            
            for i in range(data.months_ahead):
                # Jump forward exactly 1 month at a time
                target_month = (today.month + i - 1) % 12 + 1
                target_year = today.year + (today.month + i - 1) // 12
                # Create a fake date just for ISO string
                target_date = datetime.date(target_year, target_month, 1)
                
                df = pd.DataFrame(columns=features)
                df.loc[0] = 0 # Initialize with 0
                
                # Set time features (Monthly model)
                if "Year" in features: df.loc[0, "Year"] = target_year
                if "Month" in features: df.loc[0, "Month"] = target_month
                
                # Set expected weather (Live API preferred ONLY for the current month i=0)
                if "Temperature" in features and "Rainfall" in features:
                    if i == 0 and live_temp is not None and live_rain is not None:
                        df.loc[0, "Temperature"] = live_temp
                        df.loc[0, "Rainfall"] = live_rain
                    elif historical_prices_df is not None:
                        try:
                            mask = (historical_prices_df['State'].str.lower() == data.state.lower()) & (historical_prices_df['Month'] == target_month)
                            avg_weather = historical_prices_df[mask][['Temperature', 'Rainfall']].mean()
                            df.loc[0, "Temperature"] = avg_weather['Temperature'] if not pd.isna(avg_weather['Temperature']) else 25.0
                            df.loc[0, "Rainfall"] = avg_weather['Rainfall'] if not pd.isna(avg_weather['Rainfall']) else 50.0
                        except:
                            df.loc[0, "Temperature"] = 25.0
                            df.loc[0, "Rainfall"] = 50.0
                
                # Set Autoregressive Lag Feature
                # For month 0, this is the real history. For month 1-5, this is the prediction from the PREVIOUS loop!
                if "Adjusted_Price_1_Month_Ago" in features:
                    df.loc[0, "Adjusted_Price_1_Month_Ago"] = recent_price
                
                # Set commodity feature
                crop_col = f"Commodity_{data.crop_name.title()}"
                if crop_col in features:
                    df.loc[0, crop_col] = 1
                
                # Set state feature
                state_col = f"State_{data.state.title()}"
                if state_col in features:
                    df.loc[0, state_col] = 1
                
                prediction = model.predict(df)[0]
                
                # UPDATE THE ANCHOR FOR THE NEXT LOOP (Autoregressive step)
                recent_price = prediction
                
                forecast.append(
                    {
                        "date": target_date.isoformat(),
                        "predicted_price": round(prediction, 2),
                    }
                )

            return {
                "crop": data.crop_name,
                "forecast": forecast,
                "is_mock": False,
                "metadata": {
                    "temperature": live_temp,
                    "rainfall": live_rain,
                    "lag_price": initial_lag_price
                }
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    forecast = []
    base_price = 2000 if data.crop_name.lower() == "rice" else 1500
    today = datetime.date.today()
    for i in range(data.months_ahead):
        target_month = (today.month + i - 1) % 12 + 1
        target_year = today.year + (today.month + i - 1) // 12
        target_date = datetime.date(target_year, target_month, 1)
        projected_price = base_price + (i * 25.0) + random.uniform(-50, 50)
        forecast.append(
            {
                "date": target_date.isoformat(),
                "predicted_price": round(projected_price, 2),
            }
        )

    return {"crop": data.crop_name, "forecast": forecast, "is_mock": True}

@app.post("/api/historical_prices")
def get_historical_prices(data: HistoricalPriceInput):
    if historical_prices_df is not None:
        try:
            # Filter by commodity and state
            mask = (historical_prices_df['Commodity'].str.lower() == data.crop_name.lower()) & \
                   (historical_prices_df['State'].str.lower() == data.state.lower())
            
            filtered_df = historical_prices_df[mask].copy()
            
            if filtered_df.empty:
                return {"crop": data.crop_name, "state": data.state, "history": []}
                
            # Sort by Year and Month ascending
            filtered_df = filtered_df.sort_values(by=['Year', 'Month'], ascending=True)
            
            # Take the last N months
            recent_data = filtered_df.tail(data.months)
            
            history = []
            month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            
            for _, row in recent_data.iterrows():
                m_idx = int(row['Month']) - 1
                month_label = f"{month_names[m_idx]} '{str(row['Year'])[-2:]}"
                history.append({
                    "month": month_label,
                    "price": round(row['Modal_Price'], 2)
                })
                
            return {"crop": data.crop_name, "state": data.state, "history": history, "is_mock": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            
    # Mock fallback
    history = []
    base_price = 2000
    month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for i in range(data.months):
        history.append({
            "month": month_names[i % 12],
            "price": base_price + (i * 50) + random.randint(-100, 100)
        })
    return {"crop": data.crop_name, "state": data.state, "history": history, "is_mock": True}


@app.post("/api/predict_risk")
def predict_risk(data: RiskInput):
    if risk_model_data:
        try:
            model = risk_model_data["model"]
            features = risk_model_data["features"]

            input_dict = data.model_dump()
            crop = input_dict.pop("cropType").lower()

            df = pd.DataFrame(columns=features)
            df.loc[0] = 0
            df.loc[0, "soilPh"] = input_dict["soilPh"]
            df.loc[0, "rainfall"] = input_dict["rainfall"]
            df.loc[0, "temperature"] = input_dict["temperature"]
            df.loc[0, "humidity"] = input_dict["humidity"]

            crop_col = f"cropType_{crop}"
            if crop_col in features:
                df.loc[0, crop_col] = 1

            prediction = model.predict(df)[0]
            return {"riskLevel": round(prediction, 1), "is_mock": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

    return {"riskLevel": random.randint(10, 90), "is_mock": True}


@app.post("/api/detect_disease")
def detect_disease(data: DiseaseInput):
    if not disease_model or not disease_classes:
        logger.error("Disease model not loaded.")
        raise HTTPException(
            status_code=503,
            detail="Disease model not loaded. Ensure disease_mobilenet.keras is in backend/models and TensorFlow is installed.",
        )

    try:
        import numpy as np
        from PIL import Image

        logger.info("Received image for disease detection (payload length: %s)", len(data.image_data))

        if "," in data.image_data:
            _, encoded = data.image_data.split(",", 1)
        else:
            encoded = data.image_data

        img_bytes = base64.b64decode(encoded)
        logger.info("Decoded base64 bytes (size: %s)", len(img_bytes))

        try:
            pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            pil_img = pil_img.resize((224, 224))
            img_array = np.array(pil_img, dtype=np.float32)
            img_array = np.expand_dims(img_array, axis=0)
            logger.info("Preprocessed image array shape: %s", img_array.shape)
        except Exception as decode_err:
            logger.warning("Image decoding error: %s", decode_err)
            raise HTTPException(status_code=400, detail="Invalid image format. Please upload a valid JPG/PNG.")

        predictions = disease_model.predict(img_array)
        class_idx = int(np.argmax(predictions[0]))
        confidence = float(predictions[0][class_idx]) * 100
        disease_name = disease_classes[class_idx]
        is_healthy = "healthy" in disease_name.lower()

        logger.info("Disease prediction: %s (%.2f%%)", disease_name, confidence)

        return {
            "disease": disease_name.replace("_", " "),
            "confidence": round(confidence, 1),
            "severity": "None" if is_healthy else ("High" if confidence > 80 else "Medium"),
            "recommendation": (
                "Crop looks great! No disease detected."
                if is_healthy
                else f"AI identified possible {disease_name.replace('_', ' ')}. Please take action."
            ),
            "treatment": (
                []
                if is_healthy
                else [
                    "Isolate the affected plants immediately.",
                    "Consult a local agricultural expert.",
                    "Consider appropriate fungicide/pesticide treatment.",
                    "Remove and destroy severely affected leaves.",
                ]
            ),
            "color": "green" if is_healthy else "red",
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Backend error during disease detection: %s", e)
        raise HTTPException(status_code=500, detail=f"Internal Server Error: {str(e)}")
