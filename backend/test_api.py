import urllib.request
import json

# Your secret key
API_KEY = "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b"

# We are asking for just 5 records to test it out
URL = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={API_KEY}&format=json&limit=5"

print("Fetching data from Government Server...")

try:
    # 1. Open the URL
    response = urllib.request.urlopen(URL)
    
    # 2. Read the raw data
    data = response.read()
    
    # 3. Convert it into a Python Dictionary
    json_data = json.loads(data)
    
    # 4. Print out the prices!
    print("\nSUCCESS! Here are the 5 latest prices:\n")
    for record in json_data.get('records', []):
        state = record.get('state')
        market = record.get('market')
        commodity = record.get('commodity')
        modal_price = record.get('modal_price')
        
        print(f"🌾 {commodity} in {market}, {state} is ₹{modal_price}")

except Exception as e:
    print("❌ ERROR:", e)
