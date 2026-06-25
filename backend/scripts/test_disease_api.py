import requests
import base64
import numpy as np
from PIL import Image
import io
import time

def test_disease_api():
    # Create a dummy green image
    img = Image.new('RGB', (224, 224), color = 'green')
    buffer = io.BytesIO()
    img.save(buffer, format="JPEG")
    img_b64 = base64.b64encode(buffer.getvalue()).decode("utf-8")
    
    payload = {"image_data": img_b64}
    
    try:
        start = time.time()
        response = requests.post("http://127.0.0.1:8001/api/detect_disease", json=payload, timeout=10)
        end = time.time()
        print(f"Status Code: {response.status_code}")
        print(f"Response Time: {end-start:.2f}s")
        print(f"Response Body: {response.json()}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_disease_api()
