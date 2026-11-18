# 🌾 SAGRI — Smart Agriculture Real-time Intelligence
### *Autonomous Multimodal AI Ecosystem & Instant Mandi Payout Engine for Indian Agriculture*

[![Dual Platform](https://img.shields.io/badge/Architecture-Dual--Platform%20Concurrent-10B981?style=for-the-badge&logo=react&logoColor=white)](https://github.com/Shikhar-Kesharwani/sagri_final)
[![Classic Frontend](https://img.shields.io/badge/Port%205173-SAGRI%20Classic-22C55E?style=for-the-badge&logo=vite&logoColor=white)](http://localhost:5173)
[![Modern Frontend](https://img.shields.io/badge/Port%205174-SAGRI%20Modern-3B82F6?style=for-the-badge&logo=react&logoColor=white)](http://localhost:5174)
[![FastAPI](https://img.shields.io/badge/Backend%20:8000-FastAPI%20REST-009688?style=for-the-badge&logo=fastapi&logoColor=white)](http://localhost:8000)
[![ONNX Runtime](https://img.shields.io/badge/Vision%20AI-MobileNetV2%20ONNX-005CED?style=for-the-badge&logo=onnx&logoColor=white)](https://onnxruntime.ai/)
[![XGBoost](https://img.shields.io/badge/Risk%20Radar-XGBoost%20Classifier-FF6F00?style=for-the-badge&logo=xgboost&logoColor=white)](https://xgboost.readthedocs.io/)
[![SQLite WAL](https://img.shields.io/badge/Persistence-SQLite%20ACID%20WAL-003B57?style=for-the-badge&logo=sqlite&logoColor=white)](https://sqlite.org/)
[![Fintech](https://img.shields.io/badge/Fintech-Razorpay%20Route%20APMC%20Split-0C2340?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com/)

---

## 🌟 Dual-Platform Architecture (Both Versions Active & Live)

SAGRI ships with **both frontends fully implemented and concurrent** within this single repository, sharing the same unified Python AI/ML backend and local ACID SQLite database:

| Feature / Dimension | 🌿 **Version 1: SAGRI Classic** (`src/`) | ✨ **Version 2: SAGRI Modern** (`new_frontend/`) |
| :--- | :--- | :--- |
| **Local Port** | **`http://localhost:5173`** | **`http://localhost:5174`** |
| **Design Language** | Vibrant Agricultural Emerald, Gamified Cards, 3D Canvas Visualizer | High-Precision Editorial (Linear/Palantir aesthetic), Radix UI, Clean Typography |
| **Target Audience** | Smallholder Farmers, Extension Field Officers, Vernacular Voice Users | Agronomists, Research Institutes, Institutional Commodity Buyers, Policy Analysts |
| **Navigation** | Sticky Top Navbar with Quick Modules + Live Voice Assistant Button | Sticky Editorial Header + Quick Command Palette (`Ctrl + K` / `Cmd + K`) |
| **Foliar Pathology** | Real-time image upload, visual crop pathology cards, treatment drawer | High-precision diagnostic breakdown with top-3 differential confidence |
| **Mandi Payout** | APMC Split Simulator (98% farmer / 2% cess), UTR generation, PDF receipt | Comprehensive mandi trend analysis, arrival volumes, real-time APMC settlement |
| **Cross-Navigation** | Includes **`✨ Modern 5174 ↗`** header button to switch instantly | Includes **`🌿 Classic 5173 ↗`** header button to switch instantly |
| **Persistence** | Synchronized with SQLite at `backend/data/sagri.db` + localStorage | Synchronized with SQLite at `backend/data/sagri.db` + localStorage |

---

## 🚀 Live Deployments & Repository Overview

* **🌿 Classic Agronomist Portal:** [`http://localhost:5173`](http://localhost:5173) *(Port 5173 — Full gamified farmer interface)*
* **✨ Modern Intelligence Suite:** [`http://localhost:5174`](http://localhost:5174) *(Port 5174 — High-precision editorial research interface)*
* **⚡ Unified ML Backend API:** [`http://localhost:8000`](http://localhost:8000) *(FastAPI, ONNX Runtime, Scikit-Learn, XGBoost, SQLite WAL)*
* **🌐 Production Cloud Deploy:** [https://sagriai.vercel.app](https://sagriai.vercel.app) *(Mirror: [sagri-final.vercel.app](https://sagri-final.vercel.app))*
* **📂 GitHub Repository:** [https://github.com/Shikhar-Kesharwani/sagri_final](https://github.com/Shikhar-Kesharwani/sagri_final)

---

## 🎯 The Core Problem SAGRI Solves

Over 140 million smallholder farmers in India suffer recurring **20% to 30% yield loss** and devastating margin shrinkage due to three systemic bottlenecks:

1. **Delayed Foliar Pathology:** Lack of accessible agricultural scientists leaves fungal and bacterial infections unchecked. Farmers apply incorrect, toxic chemicals based on guesswork.
2. **Mandi Price Opacity & Predatory Intermediaries:** Farmers accept distress pricing at APMC market gates because transportation costs, statutory fees, and historical arrival trends are hidden.
3. **Linguistic & Digital Barriers:** Over 65% of smallholders cannot navigate complex text-heavy government portals due to vernacular dialects and low digital literacy.

**SAGRI bridges this divide** through a multimodal AI architecture combining computer vision, agronomic constraint-gated crop recommendation, non-linear climate risk modeling, econometric mandi forecasting, and instant APMC UPI payout simulation.

---

## 🏗️ System Architecture & Dual-Platform Topology

```mermaid
flowchart TD
    subgraph ClientLayer ["🖥️ Dual Client Experience Layer"]
        Classic["🌿 SAGRI Classic (Port 5173)<br/>Vite + React + Tailwind + Motion<br/>Gamified Extension Portal"]
        Modern["✨ SAGRI Modern (Port 5174)<br/>Vite + React 18 + Radix UI<br/>Editorial High-Precision Suite"]
        CrossNav["↔️ Seamless Header Cross-Navigation Pills"]
        Classic <--> CrossNav <--> Modern
    end

    subgraph BackendLayer ["⚡ Unified ML & Inference Engine (FastAPI :8000)"]
        Vision["📷 Foliar Vision Pipeline<br/>MobileNetV2 ONNX (38 Classes)<br/>ImageNet Norm + 2-Pass TTA"]
        CropRec["🌱 Crop Suitability Ensemble<br/>Random Forest (22 Crops)<br/>ICAR Hard Exclusion Mask"]
        RiskRadar["⚠️ Climate Failure Radar<br/>XGBoost Classifier (65%) +<br/>Agro-climatic Shortfall (35%)"]
        PriceFC["📈 Mandi Econometric Model<br/>Autoregressive Time Series +<br/>Live Open-Meteo Weather API"]
        LLMAgent["🤖 Multi-Persona Agronomist<br/>Gemini 1.5 Flash (4 Personas)<br/>Vernacular Tool-Calling Engine"]
    end

    subgraph DataPersistence ["🗄️ Persistence & Telemetry Layer"]
        SQLite[(Local SQLite ACID Database<br/>WAL Mode: backend/data/sagri.db<br/>OTPs, History, Users, Listings)]
        Agmarknet[(Agmarknet 25-Year Mandi Inflation CSV)]
        WeatherAPI[(Open-Meteo Satellite API)]
    end

    subgraph FintechMandi ["💰 APMC Mandi Payout Rails"]
        RzpRoute["Razorpay Route Split Ledger<br/>98% Farmer UPI / 2% APMC Cess"]
        InstantPay["Instant UPI Payout Simulator<br/>UTR Receipt & PDF Generator"]
    end

    Classic -->|REST / JSON| BackendLayer
    Modern -->|REST / JSON| BackendLayer
    BackendLayer --> SQLite
    PriceFC --> Agmarknet
    PriceFC --> WeatherAPI
    Classic --> FintechMandi
    Modern --> FintechMandi
```

---

## 🧠 The 5 Core Machine Learning & AI Pipelines (Unadulterated Outputs)

All models deliver **authentic, unmanipulated probabilities** directly from inference engines (zero artificial inflation or random number generation):

### 1. 📷 Deep Learning Foliar Pathology (`/api/predict_disease`)
* **Architecture:** Quantized **MobileNetV2 Convolutional Neural Network** deployed in ONNX Runtime format (`16.2 MB`, $3.4\text{M}$ parameters).
* **Scope:** 38 plant pathology classes spanning 14 major agricultural crops (PlantVillage standard).
* **Pipeline:** Center square crop $\to$ bilateral interpolation to $224 \times 224$ px $\to$ ImageNet normalization ($\mu=[0.485, 0.456, 0.406], \sigma=[0.229, 0.224, 0.225]$) $\to$ **2-pass Test-Time Augmentation (TTA)** with horizontal flip averaging.
* **Calibrated Output:** Returns **honest, raw softmax probabilities** (zero artificial clamping), top-3 differential diagnosis, pathogen taxonomy (fungal, bacterial, viral), and CIBRC-approved chemical and bio-control remedies.

### 2. 🌱 Agronomic Crop Recommendation (`/api/predict_crop`)
* **Architecture:** 100-tree **Random Forest Classifier** trained on multi-modal soil and climatic features.
* **Feature Vector:** Soil Nitrogen (N), Phosphorus (P), Potassium (K), Soil pH, Temperature, Relative Humidity, and Precipitation.
* **Agronomic Constraint Layer:** Raw ML models can suggest water-intensive paddy in arid zones if nutrients match. SAGRI enforces **hard geographical exclusion masks** based on ICAR agro-climatic zones (`HARD_EXCLUSIONS`) and physiological boundaries (`BIO_LIMITS`) to prevent invalid agricultural advice.
* **Honest Scoring:** Displays genuine model prediction confidence percentages directly computed from tree ensemble votes.

### 3. ⚠️ Climate & Yield Failure Risk Radar (`/api/predict_risk`)
* **Architecture:** Hybrid fusion of an **XGBoost Classifier** ($65\%$) and a physical **Agro-climatic Shortfall Engine** ($35\%$).
* **Stress Telemetry:** Analyzes non-linear microclimatic stress: diurnal temperature swings, heat stress above physiological thresholds, rainfall deficits against crop water requirements, soil $N:P$ imbalances, and wind desiccation.
* **Deterministic Scoring:** Delivers a realistic, calibrated $0\%\text{--}100\%$ risk probability with **zero random dice rolls or jitter**.

### 4. 📈 Mandi Price Trajectory Forecasting (`/api/forecast_price`)
* **Architecture:** Autoregressive Econometric Time Series Model.
* **Dataset:** 25-year Agmarknet historical dataset normalized against the Consumer Food Price Index (`clean_prices_final_inflation.csv`).
* **Live Weather Telemetry:** Dispatches real-time requests to the **Open-Meteo API** to factor regional temperature and rainfall anomalies into forward-looking supply elasticity curves.
* **Output:** 6-month projected modal price per quintal + Instant Mandi APMC net settlement calculator.

### 5. 🤖 Multi-Persona AI Agronomist (`/api/expert-chat`)
* **Engine:** Google Gemini 1.5 Flash with localized vernacular prompting in English, Hindi, and Punjabi.
* **Personas:** 4 specialized domain agents:
  1. *General Field Agronomist*
  2. *Soil Health & Nutrient Specialist*
  3. *APMC Mandi Market & Commodities Analyst*
  4. *Integrated Pest Management (IPM) Pathologist*

---

## 🗄️ Local ACID SQLite Persistence Layer

To guarantee complete operational reliability in rural and offline environments, SAGRI eliminates dependency on volatile cloud databases:

* **Engine:** Embedded SQLite with **Write-Ahead Logging (`PRAGMA journal_mode=WAL;`)** at `backend/data/sagri.db`.
* **Zero Configuration:** Automatically initializes tables and seeds demo profiles on backend startup.
* **Permanent Data Tables:**
  * `otp_sessions`: High-security OTP credentials stored with 5-minute TTL.
  * `users`: Farmer profiles, land sizes, locations, and gamified Krishi points.
  * `prediction_history`: Full audit trail of every disease scan, crop advice, and risk assessment across both frontends.
  * `marketplace_listings`: Real-time farmer crop listings, equipment rentals, and seed inquiries.

---

## 🛠️ The Complete 12 Platform Modules

| Module | Route | Key Capabilities |
| :--- | :--- | :--- |
| **Disease Detection** | `/disease-detection` | ONNX MobileNetV2 leaf scan, top-3 differential diagnosis, CIBRC chemical/organic sprays |
| **Crop Recommendation** | `/crop-recommendation` | Random Forest NPK + weather analysis, ICAR exclusions, yield & revenue projection |
| **Price Forecasting** | `/price-forecasting` | 6-month modal price curve, inflation adjustments, live Open-Meteo weather correlation |
| **Risk Radar** | `/risk-radar` | XGBoost microclimate failure scoring, heat/drought stress analysis, mitigation advice |
| **Mandi Payout Engine** | `/market-rates` | APMC 98% farmer / 2% cess split ledger, instant UPI simulation, PDF transaction receipt |
| **Soil Health Matrix** | `/soil-health` | Soil texture classification, NPK balance ratios, targeted fertilizer prescription |
| **KCC Loans & Finance** | `/loans` | Kisan Credit Card eligibility calculator, interest subvention checks, document helper |
| **Government Schemes** | `/schemes` | Central & state agriculture schemes (PM-KISAN, PMFBY, PKVY) with subsidy criteria |
| **Buy Certified Seeds** | `/buy-seeds` | High-yield hybrid varieties, germination ratings, direct-to-farm ordering |
| **Rent Farm Machinery** | `/rent-machinery` | Tractor, harvester, and drone rental booking with hourly and per-acre rates |
| **Sell Produce (Mandi)** | `/sell-produce` | Direct listing for local buyers and traders, bypassing exploitative middlemen |
| **Expert Agronomist Chat** | `/expert-connect` | Gemini 1.5 Flash multi-persona voice and text advisory in Hindi, Punjabi, and English |

---

## ⚡ Quick Start & Development Guide

### 🚀 1-Click Windows Launcher (Fastest)

Double-click the pre-configured Windows batch script in the repository root:
```cmd
start_all_servers.bat
```
This automatically boots:
1. **ML Backend API** on `http://localhost:8000`
2. **Classic SAGRI Platform** on `http://localhost:5173`
3. **Modern SAGRI Intelligence** on `http://localhost:5174`
4. Launches your default browser to both portals simultaneously.

---

### 💻 Running in VS Code

We have pre-configured [`.vscode/tasks.json`](.vscode/tasks.json) and [`.vscode/launch.json`](.vscode/launch.json) for 1-click execution:

1. Open the project folder in VS Code (`code .`).
2. Press:
   $$\mathbf{Ctrl + Shift + B}$$
3. Select **`Run Modern Version (Backend + Port 5174)`** or **`Run Both Frontends + Backend`**.
4. *(Alternatively, press <kbd>F5</kbd> to launch with interactive debugging and browser opening).*

---

### ⌨️ Terminal Commands (Manual Setup)

#### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/Shikhar-Kesharwani/sagri_final.git
cd sagri_final

# Install root dependencies (Classic Platform - Port 5173)
npm install

# Install Modern Version dependencies (Port 5174)
cd new_frontend && npm install && cd ..

# Setup Python Virtual Environment for ML Backend (Port 8000)
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 2. Run Commands via NPM (Root Directory)
```bash
# Run Classic Platform (Port 5173)
npm run dev:classic

# Run Modern Intelligence Platform (Port 5174)
npm run dev:modern

# Run ML Backend Server (Port 8000)
npm run dev:backend

# Build both production bundles
npm run build:all
```

---

## 📊 Presentation Decks & Benchmark Assets Included

This repository includes full pitch decks, presentation slide generators, and ML model benchmarking scripts:

* **PowerPoint Master Deck:** [`SAGRI_Master_Presentation.pptx`](SAGRI_Master_Presentation.pptx)
* **Enterprise Master Pitch (PDF):** [`SAGRI_Enterprise_Master_Presentation.pdf`](SAGRI_Enterprise_Master_Presentation.pdf)
* **Professional Evaluation (PDF):** [`SAGRI_Professional_Presentation.pdf`](SAGRI_Professional_Presentation.pdf)
* **HTML Interactive Deck:** [`sagri_enterprise_presentation.html`](sagri_enterprise_presentation.html)
* **ML Model Audit Script:** [`backend/master_model_audit.py`](backend/master_model_audit.py)
* **ML Latency & Accuracy Benchmark:** [`backend/master_model_benchmark.py`](backend/master_model_benchmark.py)
* **Dual-Platform Architecture Guide:** [`SAGRI_DUAL_VERSION_GUIDE.md`](SAGRI_DUAL_VERSION_GUIDE.md)

---

## 📂 Repository File Structure

```
sagri_final/
├── backend/                             # FAST-INFERENCE MACHINE LEARNING ENGINE
│   ├── main.py                          # FastAPI routing, ONNX runtime, and model inference
│   ├── database.py                      # SQLite ACID storage (WAL mode)
│   ├── geo_exclusions.py                # ICAR regional crop exclusion matrix
│   ├── pathology_kb.py                  # CIBRC chemical & organic pathology knowledge base
│   ├── master_model_audit.py            # Rigorous audit script across all 5 models
│   ├── master_model_benchmark.py        # Latency and throughput benchmark suite
│   ├── data/
│   │   ├── sagri.db                     # Permanent on-disk SQLite database
│   │   └── clean_prices_final_inflation.csv # 25-year Agmarknet historical dataset
│   └── models/
│       ├── disease_model.onnx           # MobileNetV2 plant pathology vision model (16.2 MB)
│       ├── crop_random_forest.pkl       # 22-crop Scikit-Learn Random Forest ensemble
│       ├── crop_risk_model.pkl          # Trained XGBoost Classifier for failure risk
│       └── class_names.json             # 38 PlantVillage taxonomy classes
│
├── src/                                 # VERSION 1: CLASSIC SAGRI PLATFORM (Port 5173)
│   ├── app/
│   │   ├── components/                  # Header (with Port 5174 link), VoiceAssistant, Auth
│   │   ├── pages/                       # 12 agritech modules + 3D Canvas visualizer
│   │   └── lib/                         # Client services, Supabase & SQLite fallback
│   └── package.json                     # Root npm package configuration
│
├── new_frontend/                        # VERSION 2: MODERN INTELLIGENCE SUITE (Port 5174)
│   ├── src/
│   │   ├── app/                         # AppShell (with Port 5173 link), CommandPalette
│   │   ├── pages/                       # High-precision editorial UI tools
│   │   └── data/                        # Static regional datasets, agronomic profiles
│   └── package.json                     # Standalone modern frontend configuration
│
├── .vscode/                             # VS CODE 1-CLICK WORKSPACE CONFIGURATION
│   ├── tasks.json                       # Automated multi-process build tasks
│   └── launch.json                      # Single-key (F5) debug & browser launcher
│
├── start_all_servers.bat                # Windows single-click orchestrator launcher
├── SAGRI_DUAL_VERSION_GUIDE.md          # Dual-platform operations & architecture manual
├── SAGRI_Master_Presentation.pptx       # Master presentation deck
├── SAGRI_Enterprise_Master_Presentation.pdf # High-resolution enterprise deck
└── README.md                            # Primary project documentation
```

---

## 👥 Contributors & Acknowledgements

Developed by the **SAGRI Engineering Team** for the **Razorpay AI Builder** initiative. 

Dedicated to empowering India's 140+ million farmers with autonomous multimodal artificial intelligence and transparent financial rails.
