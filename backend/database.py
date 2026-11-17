"""
SAGRI Persistent SQLite Database Layer
Replaces volatile in-memory storage and unresolvable remote Supabase endpoints
with a zero-configuration, ACID-compliant local database.
"""

import os
import sqlite3
import json
import time
import logging
from pathlib import Path
from typing import Optional, List, Dict, Any, Tuple

logger = logging.getLogger("sagri_db")

DB_DIR = Path(__file__).resolve().parent / "data"
DB_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DB_DIR / "sagri.db"


def get_connection() -> sqlite3.Connection:
    """Return a thread-safe connection with dictionary-like row access."""
    conn = sqlite3.connect(str(DB_PATH), timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA journal_mode=WAL;")
    conn.execute("PRAGMA foreign_keys=ON;")
    return conn


def init_db() -> None:
    """Initialize database tables if they do not already exist."""
    with get_connection() as conn:
        cursor = conn.cursor()
        
        # 1. OTP Sessions table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS otp_sessions (
                identifier TEXT PRIMARY KEY,
                otp TEXT NOT NULL,
                expires_at REAL NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 2. Users table (permanent persistence for farmer profiles & logins)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE,
                phone TEXT UNIQUE,
                password_hash TEXT,
                name TEXT,
                role TEXT DEFAULT 'farmer',
                state TEXT,
                district TEXT,
                village TEXT,
                pincode TEXT,
                land_size TEXT,
                primary_crop TEXT,
                points INTEGER DEFAULT 100,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 3. Prediction History table (Crop Recommendation, Disease, Price, Risk)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS prediction_history (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT NOT NULL,
                prediction_type TEXT NOT NULL,
                result TEXT NOT NULL,
                input_data TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # 4. Marketplace Listings table (Sell crops, seeds, machinery bookings)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS marketplace_listings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_email TEXT,
                title TEXT NOT NULL,
                category TEXT NOT NULL,
                price REAL NOT NULL,
                quantity TEXT,
                location TEXT,
                contact TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)
        
        # Seed default admin / demo accounts if not existing
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'farmer@sagri.com';")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO users (id, email, phone, name, role, state, district, village, pincode, land_size, primary_crop, points)
                VALUES ('usr_farmer_demo', 'farmer@sagri.com', '9876543210', 'Ramesh Patel', 'farmer', 'Punjab', 'Ludhiana', 'Sahnewal', '141120', '5 acres', 'Wheat', 250);
            """)
            
        cursor.execute("SELECT COUNT(*) FROM users WHERE email = 'shikhar@sagri.app';")
        if cursor.fetchone()[0] == 0:
            cursor.execute("""
                INSERT INTO users (id, email, phone, name, role, state, district, village, pincode, land_size, primary_crop, points)
                VALUES ('usr_shikhar_admin', 'shikhar@sagri.app', '9999999999', 'Shikhar Admin', 'admin', 'Maharashtra', 'Pune', 'Baramati', '413102', '12 acres', 'Sugarcane', 500);
            """)

        conn.commit()
    logger.info("SAGRI SQLite Database initialized at %s", DB_PATH)


# --- OTP Store Operations ---
def db_store_otp(identifier: str, otp: str, expires_at: float) -> None:
    key = identifier.lower().strip()
    with get_connection() as conn:
        conn.execute("""
            INSERT INTO otp_sessions (identifier, otp, expires_at)
            VALUES (?, ?, ?)
            ON CONFLICT(identifier) DO UPDATE SET
                otp = excluded.otp,
                expires_at = excluded.expires_at,
                created_at = CURRENT_TIMESTAMP;
        """, (key, str(otp), float(expires_at)))
        conn.commit()


def db_verify_otp(identifier: str, provided_otp: str) -> Tuple[bool, str]:
    key = identifier.lower().strip()
    provided = str(provided_otp).strip()
    
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT otp, expires_at FROM otp_sessions WHERE identifier = ?", (key,))
        row = cursor.fetchone()
        
        if not row:
            return False, "No OTP found. Please request a new one."
            
        stored_otp = row["otp"]
        expires_at = row["expires_at"]
        
        if time.time() > expires_at:
            cursor.execute("DELETE FROM otp_sessions WHERE identifier = ?", (key,))
            conn.commit()
            return False, "OTP has expired. Please request a new one."
            
        if stored_otp == provided:
            cursor.execute("DELETE FROM otp_sessions WHERE identifier = ?", (key,))
            conn.commit()
            return True, "OTP verified successfully."
            
        return False, "Invalid OTP. Please try again."


# --- Prediction History Operations ---
def db_save_prediction(user_email: str, prediction_type: str, result: str, input_data: Any) -> int:
    clean_email = user_email.lower().strip() if user_email else "guest@sagri.app"
    input_str = json.dumps(input_data) if not isinstance(input_data, str) else input_data
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO prediction_history (user_email, prediction_type, result, input_data)
            VALUES (?, ?, ?, ?);
        """, (clean_email, prediction_type, result, input_str))
        conn.commit()
        return cursor.lastrowid


def db_get_predictions(user_email: Optional[str] = None, limit: int = 50) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        if user_email:
            cursor.execute("""
                SELECT id, user_email, prediction_type, result, input_data, timestamp
                FROM prediction_history
                WHERE user_email = ?
                ORDER BY timestamp DESC
                LIMIT ?;
            """, (user_email.lower().strip(), limit))
        else:
            cursor.execute("""
                SELECT id, user_email, prediction_type, result, input_data, timestamp
                FROM prediction_history
                ORDER BY timestamp DESC
                LIMIT ?;
            """, (limit,))
            
        rows = cursor.fetchall()
        results = []
        for r in rows:
            input_val = r["input_data"]
            try:
                input_val = json.loads(input_val) if input_val else {}
            except Exception:
                pass
            results.append({
                "id": r["id"],
                "user_email": r["user_email"],
                "prediction_type": r["prediction_type"],
                "result": r["result"],
                "input_data": input_val,
                "timestamp": r["timestamp"]
            })
        return results


# --- User Profile Operations ---
def db_get_user(identifier: str) -> Optional[Dict[str, Any]]:
    key = identifier.lower().strip()
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            SELECT id, email, phone, name, role, state, district, village, pincode, land_size, primary_crop, points, created_at
            FROM users
            WHERE email = ? OR phone = ?;
        """, (key, key))
        row = cursor.fetchone()
        if row:
            return dict(row)
        return None


def db_save_or_update_user(data: Dict[str, Any]) -> Dict[str, Any]:
    user_id = data.get("id") or f"usr_{int(time.time() * 1000)}"
    email = (data.get("email") or "").lower().strip() or None
    phone = (data.get("phone") or "").strip() or None
    name = data.get("name") or (email.split("@")[0] if email else "Farmer")
    role = data.get("role") or "farmer"
    state = data.get("state")
    district = data.get("district")
    village = data.get("village")
    pincode = data.get("pincode")
    land_size = data.get("land_size") or data.get("landSize")
    primary_crop = data.get("primary_crop") or data.get("primaryCrop")
    points = data.get("points") or 100

    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO users (id, email, phone, name, role, state, district, village, pincode, land_size, primary_crop, points)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                email = coalesce(excluded.email, users.email),
                phone = coalesce(excluded.phone, users.phone),
                name = coalesce(excluded.name, users.name),
                role = coalesce(excluded.role, users.role),
                state = coalesce(excluded.state, users.state),
                district = coalesce(excluded.district, users.district),
                village = coalesce(excluded.village, users.village),
                pincode = coalesce(excluded.pincode, users.pincode),
                land_size = coalesce(excluded.land_size, users.land_size),
                primary_crop = coalesce(excluded.primary_crop, users.primary_crop),
                points = coalesce(excluded.points, users.points);
        """, (user_id, email, phone, name, role, state, district, village, pincode, land_size, primary_crop, points))
        conn.commit()

    return db_get_user(email or phone or user_id) or data


# --- Marketplace Listings ---
def db_add_marketplace_listing(data: Dict[str, Any]) -> Dict[str, Any]:
    with get_connection() as conn:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO marketplace_listings (user_email, title, category, price, quantity, location, contact)
            VALUES (?, ?, ?, ?, ?, ?, ?);
        """, (
            (data.get("user_email") or "").lower().strip(),
            data.get("title", "Crop Produce"),
            data.get("category", "crop"),
            float(data.get("price", 0.0)),
            str(data.get("quantity", "1 Quintal")),
            data.get("location", "Local Mandi"),
            data.get("contact", "")
        ))
        conn.commit()
        listing_id = cursor.lastrowid
        cursor.execute("SELECT * FROM marketplace_listings WHERE id = ?", (listing_id,))
        return dict(cursor.fetchone())


def db_get_marketplace_listings(category: Optional[str] = None) -> List[Dict[str, Any]]:
    with get_connection() as conn:
        cursor = conn.cursor()
        if category:
            cursor.execute("SELECT * FROM marketplace_listings WHERE category = ? ORDER BY created_at DESC", (category,))
        else:
            cursor.execute("SELECT * FROM marketplace_listings ORDER BY created_at DESC")
        return [dict(r) for r in cursor.fetchall()]
