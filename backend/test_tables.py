import os
from supabase import create_client, Client

url = "https://tnaoasoznlzmbkennoiy.supabase.co"
jwt_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYW9hc296bmx6bWJrZW5ub2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTc5OTYsImV4cCI6MjA5MDI5Mzk5Nn0.HabEUgqqzrGx7ng76dnaeKLLF_dvVTek8djPZOmYzU0"

supabase: Client = create_client(url, jwt_key)

try:
    res1 = supabase.table("predictions").select("*").limit(1).execute()
    print("Found 'predictions':", res1)
except Exception as e:
    print("'predictions' Error:", e)

try:
    res2 = supabase.table("prediction_history").select("*").limit(1).execute()
    print("Found 'prediction_history':", res2)
except Exception as e:
    print("'prediction_history' Error:", e)

try:
    res3 = supabase.table("users").select("*").limit(1).execute()
    print("Found 'users':", res3)
except Exception as e:
    print("'users' Error:", e)
