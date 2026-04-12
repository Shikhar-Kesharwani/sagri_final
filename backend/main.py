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

# --- Registered Emails Store (JSON file for persistence across restarts) ---
_EMAILS_FILE = Path(__file__).parent / "registered_emails.json"

def _load_registered_emails() -> set:
    if _EMAILS_FILE.exists():
        try:
            return set(json.loads(_EMAILS_FILE.read_text()))
        except Exception:
            return set()
    return set()

def _mark_email_registered(email: str) -> None:
    emails = _load_registered_emails()
    emails.add(email.strip().lower())
    _EMAILS_FILE.write_text(json.dumps(list(emails)))

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

PRICE_MODEL_PATH = MODEL_DIR / "price_prophet_model.json"
price_model = None

if PRICE_MODEL_PATH.exists():
    try:
        from prophet.serialize import model_from_json

        with open(PRICE_MODEL_PATH, "r", encoding="utf-8") as fin:
            price_model = model_from_json(fin.read())
        logger.info("Loaded trained Prophet price forecasting model.")
    except ImportError:
        logger.warning("Found price model, but prophet is not installed.")
    except Exception as e:
        logger.exception("Could not load price model: %s", e)
else:
    logger.warning("No price model found.")

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
    days_ahead: int = 30


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


# ------ Registered Email Check Endpoints ------

@app.get("/api/check-email-registered")
def check_email_registered(email: str):
    """Check if an email is already registered. Called BEFORE sending OTP."""
    exists = email.strip().lower() in _load_registered_emails()
    return {"exists": exists}


@app.post("/api/mark-email-registered")
def mark_email_registered(data: SendEmailOtpInput):
    """Persist email as registered after successful signup. Called AFTER signup completes."""
    _mark_email_registered(data.email)
    return {"success": True}


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


@app.post("/api/forecast_price")
def forecast_price(data: PriceForecastInput):
    import datetime

    if price_model:
        try:
            future = price_model.make_future_dataframe(periods=data.days_ahead)
            forecast_df = price_model.predict(future)
            future_predictions = forecast_df.tail(data.days_ahead)

            forecast = []
            for _, row in future_predictions.iterrows():
                multiplier = 1.0
                if data.crop_name.lower() == "wheat":
                    multiplier = 1.1
                elif data.crop_name.lower() == "cotton":
                    multiplier = 1.5
                elif data.crop_name.lower() == "sugarcane":
                    multiplier = 0.8
                elif data.crop_name.lower() == "rice":
                    multiplier = 1.0

                final_price = float(row["yhat"]) * multiplier
                forecast.append(
                    {
                        "date": row["ds"].strftime("%Y-%m-%d"),
                        "predicted_price": round(final_price, 2),
                    }
                )

            return {"crop": data.crop_name, "forecast": forecast, "is_mock": False}
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

    forecast = []
    base_price = 2000 if data.crop_name.lower() == "rice" else 1500
    today = datetime.date.today()
    for i in range(data.days_ahead):
        target_date = today + datetime.timedelta(days=i)
        projected_price = base_price + (i * 2.5) + random.uniform(-50, 50)
        forecast.append(
            {
                "date": target_date.isoformat(),
                "predicted_price": round(projected_price, 2),
            }
        )

    return {"crop": data.crop_name, "forecast": forecast, "is_mock": True}


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
