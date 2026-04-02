# SAGRI - Smart Agriculture Real-time Intelligence (Krishi Shayak) 🌾

SAGRI is an advanced AI-powered farming assistant designed to empower farmers with data-driven insights. From disease detection to price forecasting, SAGRI brings modern technology to the roots of agriculture.

## 🚀 Core Features

*   **🔬 Crop Disease Detection**: Instant diagnosis of plant health through image analysis.
*   **⚠️ Risk Prediction**: AI assessment of crop failure risks based on environmental data.
*   **📈 Price Forecasting**: Market trend analysis and future price predictions.
*   **🌱 Smart Recommendations**: Tailored crop suggestions for optimal soil health.
*   **🌍 Multi-language Support**: Accessible in English, Hindi, and Punjabi.
*   **🎙️ Voice Assistant**: Integrated voice navigation for improved accessibility.

## 🛠️ Tech Stack

*   **Frontend**: React 18, Vite, Tailwind CSS, Framer Motion, Recharts.
*   **Backend**: FastAPI (Python 3.10+), Uvicorn.
*   **ML Models**: Random Forest (Scikit-learn), MobileNet (TensorFlow), Prophet.
*   **Database/Auth**: Supabase integration.

## 📦 Directory Structure

```text
.
├── backend/            # FastAPI Backend
│   ├── models/        # Trained AI Models (.pkl, .keras)
│   └── main.py        # API Entry point
├── src/               # React Frontend Source
├── ml_training_scripts/ # Python scripts to retrain AI models
├── docs/              # Detailed technical guides and setup documentation
└── setup_all.py       # Unified installation script
```

## 🚀 Getting Started

### One-Click Setup
If you have Node.js and Python installed, run:
```bash
python setup_all.py
```

### Manual Setup

#### 1. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

#### 2. Frontend
```bash
npm install
npm run dev
```

## 📄 License
This project is licensed under the [MIT License](LICENSE).

---
**Made with ❤️ for Indian Farmers**