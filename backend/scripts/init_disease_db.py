import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "disease_log.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    # Create the disease log table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS disease_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            field_id TEXT NOT NULL,
            gps_lat REAL,
            gps_lon REAL,
            detected_class TEXT NOT NULL,
            confidence REAL NOT NULL,
            user_confirmed BOOLEAN,
            action_taken TEXT,
            image_path TEXT
        )
    ''')
    
    conn.commit()
    conn.close()
    print(f"Database initialized at {DB_PATH}")

if __name__ == "__main__":
    init_db()
