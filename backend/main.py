from pathlib import Path
import base64
import io
import json
import logging
import random
import time
import sys
import os
from dotenv import load_dotenv

load_dotenv()

import joblib
import numpy as np
import pandas as pd
import requests as http_requests
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
try:
    from supabase import create_client, Client
except (ImportError, AttributeError):
    # Handle shadowing or uninstalled supabase gracefully
    create_client, Client = None, None

# Import geographic exclusions
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from geo_exclusions import HARD_EXCLUSIONS

# --- API Keys ---
FAST2SMS_API_KEY = os.getenv("FAST2SMS_API_KEY")

app = FastAPI(title="Sagri ML Backend API")
logger = logging.getLogger("sagri.backend")

_start_time = time.time()

# --- Health Check Endpoints ---
@app.get("/health")
async def health():
    return {"status": "ok", "uptime": round(time.time() - _start_time, 2)}

@app.get("/ready")
async def ready():
    return {"status": "ready"}

@app.get("/live")
async def live():
    return {"status": "alive"}

BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "models"

# --- Supabase Configuration ---
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase_client = None
if create_client and SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as err:
        logger.warning("Could not initialize Supabase client: %s", err)

allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [origin.strip() for origin in allowed_origins_env.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if allowed_origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 1. Load Models ---
CROP_MODEL_PATH = MODEL_DIR / "crop_random_forest.pkl"
CROP_FEATURES_PATH = MODEL_DIR / "model_features.json"
crop_model = None
crop_model_meta = None

if CROP_MODEL_PATH.exists():
    try:
        loaded_crop_data = joblib.load(CROP_MODEL_PATH)
        if isinstance(loaded_crop_data, dict):
            crop_model = loaded_crop_data.get("model")
            if "features" in loaded_crop_data:
                crop_model_meta = {"features": loaded_crop_data["features"]}
        else:
            crop_model = loaded_crop_data
        
        if not crop_model_meta and CROP_FEATURES_PATH.exists():
            with open(CROP_FEATURES_PATH, "r") as f:
                crop_model_meta = json.load(f)
        logger.info("Loaded trained Random Forest crop model and features.")
    except Exception as e:
        logger.exception("Failed to load crop model: %s", e)
else:
    logger.warning("No trained crop model found. API will use a fallback mock response.")

# --- 1b. Load State Profiles (ICAR/IMD data) ---
STATE_PROFILES_PATH = BASE_DIR / "data" / "state_profiles.csv"
STATE_PROFILES = {}
if STATE_PROFILES_PATH.exists():
    profiles_df = pd.read_csv(STATE_PROFILES_PATH)
    for _, row in profiles_df.iterrows():
        STATE_PROFILES[row["State"]] = {
            "N":           round((row["N_min"]        + row["N_max"])        / 2),
            "P":           round((row["P_min"]        + row["P_max"])        / 2),
            "K":           round((row["K_min"]        + row["K_max"])        / 2),
            "ph":          round((row["pH_min"]       + row["pH_max"])       / 2, 1),
            "temperature": round((row["Temp_min"]     + row["Temp_max"])     / 2, 1),
            "humidity":    round((row["Humidity_min"] + row["Humidity_max"]) / 2, 1),
            "rainfall":    round((row["Rain_min"]     + row["Rain_max"])     / 2, 1),
        }
    logger.info(f"Loaded state profiles for {len(STATE_PROFILES)} states.")
else:
    logger.warning("No state_profiles.csv found. State profile endpoint will be unavailable.")

DISEASE_ONNX_PATH = MODEL_DIR / "disease_model.onnx"
DISEASE_CLASSES_JSON_PATH = MODEL_DIR / "class_names.json"
DISEASE_MODEL_PATH = MODEL_DIR / "disease_mobilenet.keras"
DISEASE_CLASSES_PATH = MODEL_DIR / "disease_classes.txt"

disease_model_onnx = None
disease_model_keras = None
disease_classes = []

if DISEASE_ONNX_PATH.exists() and DISEASE_CLASSES_JSON_PATH.exists():
    try:
        import onnxruntime as ort
        disease_model_onnx = ort.InferenceSession(str(DISEASE_ONNX_PATH))
        with open(DISEASE_CLASSES_JSON_PATH, "r", encoding="utf-8") as f:
            disease_classes = json.load(f)
        logger.info("Loaded trained ONNX Disease Detection model.")
    except Exception as e:
        logger.exception("Could not load ONNX disease model: %s", e)
elif DISEASE_MODEL_PATH.exists() and DISEASE_CLASSES_PATH.exists():
    try:
        import tensorflow as tf
        disease_model_keras = tf.keras.models.load_model(DISEASE_MODEL_PATH)
        with open(DISEASE_CLASSES_PATH, "r", encoding="utf-8") as f:
            disease_classes = [line.strip() for line in f if line.strip()]
        logger.info("Loaded trained Keras Disease Detection model.")
    except ImportError:
        logger.warning("Found Keras disease model, but TensorFlow is not installed.")
    except Exception as e:
        logger.exception("Could not load Keras disease model: %s", e)
else:
    logger.warning("No disease model found (neither ONNX nor Keras).")

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


# --- 2. Supabase OTP Store ---
# Using the `otp_sessions` table in Supabase instead of memory
OTP_TTL_SECONDS = 300  # 5 minutes

def _generate_otp() -> str:
    return str(random.randint(100000, 999999))

def _store_otp(identifier: str, otp: str) -> None:
    expires_at = time.time() + OTP_TTL_SECONDS
    # Upsert the OTP session into Supabase
    try:
        supabase_client.table("otp_sessions").upsert({
            "identifier": identifier,
            "otp": otp,
            "expires_at": expires_at
        }).execute()
    except Exception as e:
        logger.error(f"Failed to store OTP in Supabase: {e}")
        raise HTTPException(status_code=500, detail="Database error while saving OTP.")

def _verify_stored_otp(identifier: str, otp: str) -> tuple[bool, str]:
    try:
        response = supabase_client.table("otp_sessions").select("*").eq("identifier", identifier).execute()
        data = response.data
        if not data:
            return False, "No OTP found. Please request a new one."
        
        entry = data[0]
        
        if time.time() > entry["expires_at"]:
            supabase_client.table("otp_sessions").delete().eq("identifier", identifier).execute()
            return False, "OTP has expired. Please request a new one."
            
        if str(entry["otp"]) != str(otp):
            return False, "Invalid OTP. Please try again."
            
        # One-time use — delete after success
        supabase_client.table("otp_sessions").delete().eq("identifier", identifier).execute()
        return True, "OTP verified successfully."
    except Exception as e:
        logger.error(f"Failed to verify OTP from Supabase: {e}")
        return False, "Database error while verifying OTP."


# --- 3. Request Models ---
class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    state: str = ""  # Optional: used for geographic filtering (not model input)
    season: str = "Kharif"
    soil_texture: str = "Loamy"
    irrigation: int = 0
    is_controlled_env: bool = False


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
    windspeed: float = 2.5
    nitrogen: float = 60.0
    phosphate: float = 30.0
    potash: float = 20.0
    season: str = ""


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
            supabase_client.table("otp_sessions").delete().eq("identifier", phone).execute()
            raise HTTPException(
                status_code=502,
                detail=f"Fast2SMS error: {result.get('message', 'Unknown error')}",
            )
        return {"success": True, "message": f"OTP sent to +91{phone}"}
    except http_requests.RequestException as e:
        supabase_client.table("otp_sessions").delete().eq("identifier", phone).execute()
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
    # Biological Guardrails
    if data.temperature > 45 or data.temperature < 5:
        return {"error": True, "message": f"Lethal Conditions: A temperature of {data.temperature}°C exceeds the biological survival threshold for standard crops (causes severe protein denaturation or freezing). No recommendation possible."}
    if data.ph > 9.0 or data.ph < 4.0:
        return {"error": True, "message": f"Lethal Conditions: A soil pH of {data.ph} is toxic. It will cause severe root damage or micronutrient lockout. No recommendation possible."}
    if data.N > 300 or data.P > 300 or data.K > 300:
        return {"error": True, "message": "Lethal Conditions: Nutrient levels exceeding 300 kg/ha will cause severe osmotic stress and fertilizer burn. No recommendation possible."}
    if data.humidity < 10:
        return {"error": True, "message": f"Lethal Conditions: {data.humidity}% humidity is too low. Plants will suffer acute desiccation and stomatal closure. No recommendation possible."}

    if crop_model:
        actual_crop_model = crop_model.get("model") if isinstance(crop_model, dict) else crop_model
        try:
            if crop_model_meta:
                import numpy as np
                
                # Mathematical derivatives
                svp = 0.61078 * np.exp((17.27 * data.temperature) / (data.temperature + 237.3))
                vpd = svp * (1 - (data.humidity / 100))
                
                n_p_ratio = data.N / data.P if data.P > 0 else data.N
                n_k_ratio = data.N / data.K if data.K > 0 else data.N

                IDEAL_NPK = {
                    "apple": (21, 134, 200),
                    "banana": (100, 82, 50),
                    "blackgram": (40, 67, 19),
                    "chickpea": (40, 68, 80),
                    "coconut": (22, 17, 31),
                    "coffee": (101, 29, 30),
                    "cotton": (118, 46, 20),
                    "grapes": (23, 133, 200),
                    "jute": (78, 47, 40),
                    "kidneybeans": (21, 68, 20),
                    "lentil": (19, 68, 19),
                    "maize": (78, 48, 20),
                    "mango": (20, 27, 30),
                    "mothbeans": (21, 48, 20),
                    "mungbean": (21, 47, 20),
                    "muskmelon": (100, 18, 50),
                    "orange": (20, 17, 10),
                    "papaya": (50, 59, 50),
                    "pigeonpeas": (21, 68, 20),
                    "pomegranate": (19, 19, 40),
                    "rice": (80, 48, 40),
                    "watermelon": (99, 17, 50)
                }

                def get_prescription(crop_name):
                    ideal_n, ideal_p, ideal_k = IDEAL_NPK.get(crop_name.lower(), (50, 50, 50))
                    msg = []
                    if data.N < ideal_n - 10: msg.append(f"+{int(ideal_n - data.N)}kg/ha N")
                    if data.P < ideal_p - 10: msg.append(f"+{int(ideal_p - data.P)}kg/ha P")
                    if data.K < ideal_k - 10: msg.append(f"+{int(ideal_k - data.K)}kg/ha K")
                    if not msg: return "Soil nutrients are optimal!"
                    return "Add " + ", ".join(msg)

                # Soil physical mapping
                SOIL_PHYSICS = {
                    "Sandy": (85, 10, 5),
                    "Loamy": (40, 40, 20),
                    "Clay": (15, 15, 70),
                    "Laterite": (20, 20, 60),
                    "Black": (15, 20, 65),
                    "Red": (50, 25, 25),
                    "Silt": (10, 80, 10)
                }
                sand_pct, silt_pct, clay_pct = SOIL_PHYSICS.get(data.soil_texture, (40, 40, 20))

                feat_dict = {
                    "N": data.N,
                    "P": data.P,
                    "K": data.K,
                    "temperature": data.temperature,
                    "humidity": data.humidity,
                    "ph": data.ph,
                    "Sand_Pct": sand_pct,
                    "Silt_Pct": silt_pct,
                    "Clay_Pct": clay_pct,
                    "VPD": round(vpd, 3),
                    "N_P_Ratio": round(n_p_ratio, 3),
                    "N_K_Ratio": round(n_k_ratio, 3)
                }

                simulated_rainfalls = [data.rainfall]
                if data.irrigation == 1:
                    simulated_rainfalls.append(data.rainfall + 400)
                    simulated_rainfalls.append(data.rainfall + 1000)

                combined_probs = {}
                for rain in simulated_rainfalls:
                    feat_dict["rainfall"] = rain
                    features = [[feat_dict.get(f, 0) for f in crop_model_meta["features"]]]
                    probs = actual_crop_model.predict_proba(features)[0]
                    for crop, prob in zip(actual_crop_model.classes_, probs):
                        combined_probs[crop] = max(combined_probs.get(crop, 0), prob)

                crop_probs = sorted(combined_probs.items(), key=lambda x: x[1], reverse=True)

            else:
                # Fallback for old model
                features = [[data.N, data.P, data.K, data.temperature, data.humidity, data.ph, data.rainfall]]
                probs = actual_crop_model.predict_proba(features)[0]
                all_crops = actual_crop_model.classes_
                crop_probs = sorted(zip(all_crops, probs), key=lambda x: x[1], reverse=True)

            # Apply geographic exclusions if state is provided and NOT in controlled environment
            excluded_crops = []
            if data.state and not data.is_controlled_env:
                for crop_name, exclusion_states in HARD_EXCLUSIONS.items():
                    if data.state in exclusion_states:
                        excluded_crops.append(crop_name)

            results       = []
            crops_removed = []

            for crop, prob in crop_probs:
                if crop in excluded_crops:
                    crops_removed.append(crop)
                    continue
                if len(results) >= 3:
                    break

                if prob >= 0.70:
                    note = "Strong match - soil conditions closely suit this crop."
                elif prob >= 0.40:
                    note = "Good match - most soil conditions are suitable."
                else:
                    note = "Possible - conditions are marginal, consider soil amendment."

                results.append({
                    "crop": crop,
                    "confidence": round(float(prob) * 100, 1),
                    "note": note,
                    "prescription": get_prescription(crop)
                })

            return {
                "recommended_crop": results[0]["crop"] if results else "unknown",
                "top3": results,
                "state_used": data.state if data.state else "not specified",
                "crops_excluded": crops_removed,
                "is_mock": False,
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    mock_crops = ["wheat", "mungbean", "rice", "maize", "cotton", "coffee"]
    return {
        "recommended_crop": random.choice(mock_crops),
        "is_mock": True,
        "warning": "Actual model not found. Upload crop_random_forest.pkl",
    }


@app.get("/api/states")
def list_states():
    """Return list of all available Indian states for the crop recommendation dropdown."""
    return {"states": sorted(STATE_PROFILES.keys())}


@app.get("/api/state-profile/{state_name}")
def get_state_profile(state_name: str):
    """Return ICAR average soil/weather values for a state to pre-fill the form."""
    if state_name not in STATE_PROFILES:
        return {
            "error": f"State '{state_name}' not found.",
            "available_states": sorted(STATE_PROFILES.keys()),
        }
    return {
        "state": state_name,
        "profile": STATE_PROFILES[state_name],
        "note": "These are ICAR average values for this state. Replace with your actual soil test results for better accuracy.",
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
            model          = risk_model_data["model"]
            features       = risk_model_data["features"]
            model_type     = risk_model_data.get("model_type", "unknown")
            crop_encoder   = risk_model_data.get("crop_encoder")
            season_encoder = risk_model_data.get("season_encoder")

            input_dict = data.model_dump()
            crop_name  = input_dict.get("cropType", "rice").strip().upper()

            # Build a zero-filled feature row matching training columns
            import numpy as np
            row = {f: 0.0 for f in features}

            # --- Map frontend inputs to model features ---
            temperature = float(input_dict.get("temperature", 25))
            rainfall    = float(input_dict.get("rainfall", 100))

            row["temp_mean"]       = temperature
            row["temp_rainy_max"]  = temperature + 3.0
            row["temp_summer_max"] = temperature + 5.0
            row["temp_rainy_min"]  = temperature - 4.0
            row["temp_summer_min"] = temperature - 4.0
            row["temp_range"]      = 10.0              # typical diurnal range India
            row["total_rainfall"]  = rainfall
            row["rainfall_rainy"]  = rainfall * 0.7
            row["rainfall_summer"] = rainfall * 0.3
            row["evapotranspiration"] = rainfall * 0.4
            row["drought_stress"]  = temperature / max(rainfall, 1.0)  # heat/rain ratio
            row["rain_efficiency"] = (rainfall * 0.4) / max(rainfall * 0.7, 1.0)
            row["windspeed"]       = float(input_dict.get("windspeed", 2.5))
            row["nitrogen"]        = float(input_dict.get("nitrogen", 60.0))
            row["phosphate"]       = float(input_dict.get("phosphate", 30.0))
            row["potash"]          = float(input_dict.get("potash", 20.0))
            
            # Avoid division by zero
            phos = row["phosphate"] if row["phosphate"] > 0 else 1.0
            row["np_ratio"]        = row["nitrogen"] / phos

            row["irrigated_area"]  = 5.0
            row["log_area"]        = 2.0
            row["Crop_Year"]       = 2020
            row["decade"]          = 2020
            
            season_val = input_dict.get("season", "").strip().title()
            row["season_enc"] = 0
            if season_encoder is not None and season_val:
                known_seasons = list(season_encoder.classes_)
                if season_val in known_seasons:
                    row["season_enc"] = int(season_encoder.transform([season_val])[0])

            # Encode crop name
            if crop_encoder is not None:
                known = list(crop_encoder.classes_)
                if crop_name in known:
                    row["crop_enc"] = int(crop_encoder.transform([crop_name])[0])
                else:
                    # Find closest match
                    match = next((c for c in known if crop_name in c or c in crop_name), known[0])
                    row["crop_enc"] = int(crop_encoder.transform([match])[0])

            df_input = pd.DataFrame([row])[features]

            if model_type == "xgboost_classifier":
                # Returns probability of crop failure (0.0 – 1.0)
                failure_prob = float(model.predict_proba(df_input)[0][1])
                risk_level   = round(failure_prob * 100, 1)
            else:
                # Legacy regressor fallback
                risk_level = round(float(model.predict(df_input)[0]), 1)

            return {"riskLevel": risk_level, "is_mock": False}
        except Exception as e:
            logger.exception("Risk prediction error: %s", e)
            raise HTTPException(status_code=500, detail=str(e))

    return {"riskLevel": random.randint(10, 90), "is_mock": True}



@app.post("/api/detect_disease")
def detect_disease(data: DiseaseInput):
    if not (disease_model_onnx or disease_model_keras) or not disease_classes:
        logger.error("Disease model not loaded.")
        raise HTTPException(
            status_code=503,
            detail="Disease model not loaded. Ensure disease_model.onnx or disease_mobilenet.keras is present.",
        )

    try:
        import numpy as np
        from PIL import Image, ImageEnhance

        logger.info("Received image for disease detection (payload length: %s)", len(data.image_data))

        if "," in data.image_data:
            _, encoded = data.image_data.split(",", 1)
        else:
            encoded = data.image_data

        img_bytes = base64.b64decode(encoded)
        logger.info("Decoded base64 bytes (size: %s)", len(img_bytes))

        try:
            base_pil_img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
            
            # --- TTA (Test-Time Augmentation) Generation ---
            augmented_images = [
                base_pil_img,                                                # Original
                base_pil_img.transpose(Image.FLIP_LEFT_RIGHT),               # Flipped
                ImageEnhance.Brightness(base_pil_img).enhance(1.2),          # Brightened
                ImageEnhance.Brightness(base_pil_img).enhance(0.8),          # Darkened
                ImageEnhance.Contrast(base_pil_img).enhance(1.2),            # High Contrast
            ]
            
            if disease_model_onnx:
                all_probs = []
                def softmax(x):
                    e_x = np.exp(x - np.max(x))
                    return e_x / e_x.sum(axis=1, keepdims=True)
                    
                input_name = disease_model_onnx.get_inputs()[0].name
                mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
                std = np.array([0.229, 0.224, 0.225], dtype=np.float32)

                for aug_img in augmented_images:
                    aug_img = aug_img.resize((224, 224))
                    img_array = np.array(aug_img, dtype=np.float32)
                    
                    img_array = img_array / 255.0
                    img_array = (img_array - mean) / std
                    
                    img_array = np.transpose(img_array, (2, 0, 1))
                    img_array = np.expand_dims(img_array, axis=0)
                    
                    predictions = disease_model_onnx.run(None, {input_name: img_array})[0]
                    probs = softmax(predictions)[0]
                    all_probs.append(probs)
                
                # Mathematical Averaging of all 5 passes
                avg_probs = np.mean(all_probs, axis=0)
                class_idx = int(np.argmax(avg_probs))
                confidence = float(avg_probs[class_idx]) * 100
                logger.info("Averaged probabilities over 5 TTA passes.")
                
            else:
                # Fallback to Keras model
                pil_img = base_pil_img.resize((224, 224))
                img_array = np.array(pil_img, dtype=np.float32)
                img_array = np.expand_dims(img_array, axis=0)
                logger.info("Preprocessed Keras image array shape: %s", img_array.shape)
                predictions = disease_model_keras.predict(img_array)
                class_idx = int(np.argmax(predictions[0]))
                confidence = float(predictions[0][class_idx]) * 100

        except Exception as decode_err:
            logger.warning("Image processing error: %s", decode_err)
            raise HTTPException(status_code=400, detail="Invalid image format or preprocessing failed.")

        disease_name = disease_classes[class_idx]
        is_healthy = "healthy" in disease_name.lower()

        logger.info("Disease prediction: %s (%.2f%%)", disease_name, confidence)
        
        # Load the treatment database
        treatment_path = MODEL_DIR / "treatment_db.json"
        treatment_info = None
        if treatment_path.exists():
            with open(treatment_path, "r") as f:
                db = json.load(f)
                treatment_info = db.get(str(class_idx))
                
        if not treatment_info:
            # Fallback if DB is missing or class not found
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
            
        return {
            "disease": disease_name.replace("_", " "),
            "confidence": round(confidence, 1),
            "severity": treatment_info["severity"],
            "immediate_action": treatment_info["immediate_action"],
            "chemical_treatment": treatment_info["chemical"],
            "organic_treatment": treatment_info["organic"],
            "recheck_days": treatment_info["recheck_days"],
            "color": "green" if is_healthy else ("yellow" if treatment_info["severity"] == "Medium" else "red")
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.exception("Backend error during disease detection: %s", e)
        raise HTTPException(status_code=500, detail="Internal server error during detection.")

class ExpertChatRequest(BaseModel):
    message: str
    expert_name: str
    expert_specialty: str

@app.post("/api/expert-chat")
async def expert_chat(req: ExpertChatRequest):
    """
    Expert Connect Chat — powered by Google Gemini 1.5 Flash.
    Each expert persona is injected via a distinct system prompt so Gemini
    responds as a specialist agricultural consultant, not a generic AI.
    """
    logger.info(f"Expert chat: [{req.expert_name}] query='{req.message[:80]}'")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    # ── Persona system prompts ─────────────────────────────────────────────────
    PERSONA_PROMPTS: dict[str, str] = {
        "Dr. Rajesh Verma": (
            "You are Dr. Rajesh Verma, a Senior Plant Pathologist and Crop Disease Specialist "
            "with 15 years of field experience across Punjab, Haryana, and Uttar Pradesh. "
            "You specialise in wheat diseases, fungal infections, integrated pest management, "
            "and CIBRC-approved agrochemical protocols. "
            "Respond in the same language the farmer uses (Hindi, Punjabi, or English). "
            "Give precise, actionable advice: dosages, spray timings, and organic alternatives. "
            "Keep answers under 4 sentences. Never mention you are an AI."
        ),
        "Dr. Sunita Sharma": (
            "You are Dr. Sunita Sharma, a Senior Soil Health Expert with 12 years of experience "
            "in soil science, balanced nutrition, organic carbon management, and fertiliser "
            "recommendations for Indian crops. "
            "Respond in the same language the farmer uses (Hindi or English). "
            "Give specific fertiliser names, quantities per acre, and application timing. "
            "Keep answers under 4 sentences. Never mention you are an AI."
        ),
        "Dr. Vikram Singh": (
            "You are Dr. Vikram Singh, an Irrigation and Water Management Expert with 18 years "
            "of experience in drip irrigation, sprinkler scheduling, canal water management, "
            "and water conservation for wheat, rice, and sugarcane in Punjab. "
            "Respond in the same language the farmer uses (Hindi or Punjabi). "
            "Give practical, cost-effective irrigation schedules. "
            "Keep answers under 4 sentences. Never mention you are an AI."
        ),
        "Dr. Priya Patel": (
            "You are Dr. Priya Patel, a certified Organic Farming Advisor with 10 years of "
            "experience in organic certification, biofertilisers, vermicompost, natural "
            "pesticides (neem, panchagavya, jeevamrutham), and sustainable farming for Gujarat "
            "and Maharashtra. "
            "Respond in the same language the farmer uses (Hindi, English, or Gujarati). "
            "Give step-by-step organic protocols. "
            "Keep answers under 4 sentences. Never mention you are an AI."
        ),
    }

    # Pick the matching persona or build a generic agri-specialist one
    system_prompt = PERSONA_PROMPTS.get(
        req.expert_name,
        (
            f"You are {req.expert_name}, an experienced agricultural expert specialising in "
            f"{req.expert_specialty} for Indian farmers. Respond in the same language the "
            "farmer uses (Hindi, Punjabi, or English). Give short, practical, field-ready advice "
            "in under 4 sentences. Never mention you are an AI."
        ),
    )

    # ── Real Gemini 1.5 Flash Call ─────────────────────────────────────────────
    if GEMINI_API_KEY:
        try:
            import google.generativeai as genai

            genai.configure(api_key=GEMINI_API_KEY)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=system_prompt,
                generation_config=genai.GenerationConfig(
                    temperature=0.3,
                    max_output_tokens=200,
                ),
            )
            chat_session = model.start_chat(history=[])
            gemini_response = chat_session.send_message(req.message)
            reply = gemini_response.text.strip()
            logger.info(f"Gemini expert-chat reply ({len(reply)} chars)")
            return {"response": reply}

        except Exception as e:
            logger.warning(f"Gemini expert-chat failed, using intelligent fallback: {e}")

    # ── Intelligent Fallback (when GEMINI_API_KEY is missing / quota exceeded) ─
    msg_lower = req.message.lower()
    specialty_lower = req.expert_specialty.lower()

    if any(w in msg_lower for w in ["hello", "hi", "namaste", "sat sri akal", "kem cho"]):
        reply = (
            f"Namaste! I am {req.expert_name}, specialist in {req.expert_specialty}. "
            "Please describe your farm situation in detail so I can give you precise advice."
        )
    elif any(w in msg_lower for w in ["disease", "blight", "rust", "fungus", "spot", "rot", "pest", "insect", "kida"]):
        reply = (
            "For accurate disease identification, upload a clear photo of the affected leaf in "
            "our Disease Detection tool. Once diagnosed, I can suggest the exact CIBRC-approved "
            "chemical dosage and organic biocontrol protocol for your crop."
        )
    elif any(w in msg_lower for w in ["price", "mandi", "sell", "bhav", "rate", "bechna"]):
        reply = (
            "Check the Price Forecasting page for live mandi trends and our 6-month price "
            "trajectory model. The Instant Mandi Payout Calculator there will give you the "
            "exact net settlement after APMC cess deduction."
        )
    elif any(w in msg_lower for w in ["soil", "nitrogen", "phosphorus", "potassium", "ph", "fertilizer", "khad"]):
        reply = (
            f"As a {specialty_lower} specialist, I recommend getting a formal soil test from "
            "your nearest Krishi Vigyan Kendra first. Based on typical deficiencies in your "
            "region, applying DAP at 50 kg/acre and MOP at 25 kg/acre before sowing is a "
            "strong starting protocol."
        )
    elif any(w in msg_lower for w in ["water", "irrigation", "drip", "sprinkler", "paani", "sinchai"]):
        reply = (
            "For wheat, irrigation at CRI (Crown Root Initiation, 21 DAS) and heading stages "
            "is critical. Drip irrigation can reduce water use by 40% versus flood irrigation. "
            "Install a soil moisture sensor to avoid overwatering and reduce fungal risk."
        )
    elif any(w in msg_lower for w in ["organic", "jeevamrutham", "panchagavya", "neem", "vermicompost", "jaivik"]):
        reply = (
            "For organic disease control, spray 5% Neem Seed Kernel Extract (NSKE) every "
            "10 days. Apply Jeevamrutham (200L/acre) to boost soil microbiome. "
            "Trichoderma viride mixed with vermicompost at 2.5 kg/acre controls soil-borne pathogens."
        )
    else:
        reply = (
            f"That's an important question for {specialty_lower}. Based on current ICAR "
            f"advisory for your crop, monitor the situation closely for the next 5-7 days "
            "and document any visible changes. If symptoms worsen, use our Disease Detection "
            "AI for an instant diagnosis. Feel free to share more details!"
        )

    return {"response": reply}


@app.get('/health/deploy')
def health_deploy(): return {'status': 'ok'}
@app.get('/ready/deploy')
def ready_deploy(): return {'status': 'ready'}
