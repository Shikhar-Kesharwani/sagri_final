import requests
import base64
from PIL import Image
from io import BytesIO

# Create a dummy 224x224 green image (like a healthy leaf)
img = Image.new('RGB', (224, 224), color = (34, 139, 34))
buffered = BytesIO()
img.save(buffered, format="JPEG")
img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")

base64_string = f"data:image/jpeg;base64,{img_str}"

# Test the FastAPI endpoint
url = "http://localhost:8000/api/detect_disease"
payload = {"image_data": base64_string}

try:
    print("Testing connection to your local AI model...")
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        data = response.json()
        print("✅ SUCCESS! The API is working perfectly.")
        print("Response from your own ML Model:")
        print(f"Disease: {data.get('disease')}")
        print(f"Confidence: {data.get('confidence')}%")
        print(f"Is Mock: {data.get('is_mock')}")
    else:
        print(f"❌ ERROR: Status Code {response.status_code}")
        print(response.text)
except requests.exceptions.ConnectionError:
    print("❌ ERROR: The backend server is not running on port 8000.")
