<div align="center">
  <img src="docs/assets/sagri_banner.png" alt="SAGRI Banner" width="100%">
  <br><br>
  
  <img src="https://img.shields.io/badge/Status-Active-success.svg" alt="Status">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/Python-3.10%2B-blue" alt="Python">
  <img src="https://img.shields.io/badge/React-18-blue" alt="React">
  <img src="https://img.shields.io/badge/FastAPI-0.100%2B-green" alt="FastAPI">
  <br>
  <h1>🌾 SAGRI (Krishi Shayak)</h1>
  <h3>Smart Agriculture Real-time Intelligence</h3>
  <p>An advanced AI-powered farming assistant empowering farmers with data-driven insights.</p>
</div>

---

## 📑 Table of Contents

- [About The Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [UI Sneak Peek](#-ui-sneak-peek)
- [Directory Structure](#-directory-structure)
- [Getting Started](#-getting-started)
- [Machine Learning Models](#-machine-learning-models)
- [Contributors](#-contributors)
- [License](#-license)

---

## 📖 About The Project

**SAGRI (Krishi Shayak)** brings modern technology to the roots of agriculture. By leveraging cutting-edge Artificial Intelligence and Machine Learning, SAGRI provides actionable insights to farmers, helping them mitigate risks, prevent crop diseases, and make informed financial decisions. 

Whether it's identifying a plant disease from a single photo or predicting market prices for the next harvest, SAGRI is designed to be the ultimate digital companion for the modern farmer.

---

## ✨ Key Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **🔬 Disease Detection** | Instant diagnosis of plant health through advanced computer vision image analysis. | ✅ |
| **⚠️ Risk Prediction** | AI-driven assessment of crop failure risks based on real-time environmental data. | ✅ |
| **📈 Price Forecasting** | Market trend analysis and 6-month future price predictions to maximize profitability. | ✅ |
| **🌱 Smart Recommendations**| Tailored crop suggestions optimized for specific soil health and weather conditions. | ✅ |
| **🌍 Multi-language** | Completely accessible in English, Hindi, and Punjabi to bridge the language barrier. | ✅ |
| **🎙️ Voice Assistant** | Integrated voice navigation for hands-free and improved accessibility. | ✅ |

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer](https://img.shields.io/badge/Framer-black?style=for-the-badge&logo=framer&logoColor=blue)

### Backend & AI
![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-%23F7931E.svg?style=for-the-badge&logo=scikit-learn&logoColor=white)

### Database & Auth
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% User Interfaces
    User([👨‍🌾 Farmer / User])
    Voice[🎙️ Voice Assistant]
    UI[💻 React Frontend Vite + Tailwind]
    
    %% Interactions
    User -->|Interacts| UI
    User -->|Speaks| Voice
    Voice -->|Transcribes| UI
    
    %% Frontend to Backend
    UI -->|REST API Calls| API[🚀 FastAPI Backend]
    
    %% Backend Integrations
    API -->|Auth & User Data| Supabase[(🗄️ Supabase DB & Auth)]
    
    %% AI/ML Models (Backend Sub-systems)
    subgraph AI/ML Engine
        API -->|Image Data| Disease[🔬 Crop Disease Model MobileNet]
        API -->|Soil/Weather Data| Risk[⚠️ Risk Prediction Random Forest]
        API -->|Market Data| Price[📈 Price Forecast Prophet]
        API -->|Soil Data| Recs[🌱 Crop Recommendations]
    end
    
    %% External APIs (Optional representation)
    ExtWeather[🌦️ Weather API] -.-> API
    ExtMarket[💹 Market API] -.-> API

    classDef frontend fill:#61DAFB,stroke:#333,stroke-width:2px,color:#000;
    classDef backend fill:#009688,stroke:#333,stroke-width:2px,color:#fff;
    classDef database fill:#3ECF8E,stroke:#333,stroke-width:2px,color:#000;
    classDef ai fill:#FF9800,stroke:#333,stroke-width:2px,color:#000;
    
    class UI frontend;
    class API backend;
    class Supabase database;
    class Disease,Risk,Price,Recs ai;
```

---

## 📸 UI Sneak Peek

*(Add your beautiful screenshots here by replacing the placeholder links!)*

<p align="center">
  <img src="https://via.placeholder.com/400x250/000000/FFFFFF?text=Dashboard+Screenshot" alt="Dashboard View" width="45%">
  &nbsp;&nbsp;
  <img src="https://via.placeholder.com/400x250/000000/FFFFFF?text=Disease+Scanner+Screenshot" alt="Disease Scanner" width="45%">
</p>

---

## 📦 Directory Structure

```text
SAGRI/
├── backend/                  # Python FastAPI Backend
│   ├── models/               # Pre-trained AI Models (.pkl, .keras, .h5)
│   ├── routers/              # API Route definitions
│   ├── core/                 # App configurations and security
│   └── main.py               # FastAPI application entry point
├── docs/                     # Detailed technical guides and assets
│   └── assets/               # Banners, images, and diagrams
├── src/                      # React Frontend Source (Vite)
│   ├── components/           # Reusable UI components
│   ├── pages/                # Application views (Dashboard, Login, etc.)
│   ├── contexts/             # React Contexts (Language, Auth)
│   └── assets/               # Frontend images, icons, and styles
├── ml_training_scripts/      # Jupyter notebooks & Python scripts for model training
└── setup_all.py              # Automated unified installation script
```

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v16.x or later)
- [Python](https://www.python.org/) (v3.10 or later)
- [Git](https://git-scm.com/)

### 🛠️ One-Click Installation

For a seamless setup experience, run the automated setup script from the root directory:

```bash
python setup_all.py
```
*This script will automatically set up virtual environments, install dependencies for both frontend and backend, and prepare the project.*

### ⚙️ Manual Installation

If you prefer to set up the environments manually, follow these steps:

#### 1. Clone the repository
```bash
git clone https://github.com/AyushGU12/sagri_final.git
cd sagri_final
```

#### 2. Backend Setup
```bash
cd backend
# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the FastAPI server
uvicorn main:app --reload
```
*The backend API will run on `http://localhost:8000`*

#### 3. Frontend Setup
Open a new terminal window/tab:
```bash
# From the root directory, install NPM packages
npm install

# Start the Vite development server
npm run dev
```
*The React app will be available at `http://localhost:5173`*

---

## 🧠 Machine Learning Models

SAGRI relies on several sophisticated ML models:
- **MobileNetV2 (TensorFlow/Keras):** Utilized for the Crop Disease Detection module, offering high accuracy image classification with low latency.
- **Random Forest Classifier (Scikit-learn):** Analyzes multidimensional environmental data (humidity, temperature, soil pH) to predict crop failure risks.
- **Prophet (Meta):** Time-series forecasting model used to predict future market prices for various commodities.

---

## 👥 Contributors

This project was built by an amazing team. 

<a href="https://github.com/AyushGU12/sagri_final/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=AyushGU12/sagri_final" />
</a>

*Click the image above to see all contributors.*

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---
<div align="center">
  <b>Made with ❤️ for Indian Farmers</b>
</div>