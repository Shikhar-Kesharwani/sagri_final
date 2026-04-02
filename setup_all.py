import subprocess
import os
import sys

def run_command(command, cwd=None):
    print(f"🚀 Running: {command}")
    try:
        subprocess.check_call(command, shell=True, cwd=cwd)
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {e}")
        return False
    return True

def setup():
    root_dir = os.path.dirname(os.path.abspath(__file__))
    
    print("--- 🌾 SAGRI Unified Setup 🌾 ---")
    
    # 1. Frontend Setup
    print("\n📦 Setting up Frontend...")
    if not run_command("npm install", cwd=root_dir):
        print("💡 Tip: Ensure Node.js and npm are installed.")
    
    # 2. Backend Setup
    backend_dir = os.path.join(root_dir, "backend")
    print("\n📦 Setting up Backend...")
    
    # Create venv if not exists
    venv_dir = os.path.join(backend_dir, "venv")
    if not os.path.exists(venv_dir):
        run_command(f"{sys.executable} -m venv venv", cwd=backend_dir)
    
    # Install requirements
    pip_cmd = os.path.join(venv_dir, "Scripts", "pip") if os.name == 'nt' else os.path.join(venv_dir, "bin", "pip")
    if not run_command(f"{pip_cmd} install -r requirements.txt", cwd=backend_dir):
        print("💡 Tip: Ensure Python is installed.")

    print("\n✅ Setup Complete!")
    print("\nTo start:")
    print("1. Frontend: npm run dev")
    print("2. Backend: cd backend && venv\\Scripts\\activate && uvicorn main:app --reload")

if __name__ == "__main__":
    setup()
