import os
from supabase import create_client, Client

url = "https://tnaoasoznlzmbkennoiy.supabase.co"
key = "sb_publishable_3ucZ__cyEDnZ0IDst9JOSw_B_4oOASg"
jwt_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRuYW9hc296bmx6bWJrZW5ub2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTc5OTYsImV4cCI6MjA5MDI5Mzk5Nn0.HabEUgqqzrGx7ng76dnaeKLLF_dvVTek8djPZOmYzU0"

print("Testing with JWT Key...")
try:
    supabase: Client = create_client(url, jwt_key)
    response = supabase.table("non_existent_table").select("*").limit(1).execute()
    print("JWT Connection Successful")
except Exception as e:
    print("JWT Error:", e)

print("\nTesting with sb_publishable Key...")
try:
    supabase2: Client = create_client(url, key)
    response2 = supabase2.table("non_existent_table").select("*").limit(1).execute()
    print("sb_publishable Connection Successful")
except Exception as e:
    print("sb_publishable Error:", e)
