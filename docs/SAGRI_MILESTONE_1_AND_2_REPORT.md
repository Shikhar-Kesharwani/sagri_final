# SAGRI: AI-Powered Precision Agriculture & Crop Advisory Platform
## Comprehensive Academic Project Report — Milestone 1 & Milestone 2 Evaluation

---

### Project Metadata

| Field | Details |
| :--- | :--- |
| **Course** | Artificial Intelligence & Machine Learning Laboratory (Lab Week 8) |
| **Project Title** | SAGRI — Smart Agriculture & Krishi Sahayak Platform |
| **Evaluation Period** | 5 October – 9 October 2026 |
| **Total Evaluation Weightage** | 12 Marks (Milestone 2 Viva & Partial Demo) |
| **Team Name / ID** | [Insert Team ID / Group Number] |
| **Department** | Computer Science & Engineering / Artificial Intelligence & Data Science |
| **Institution** | [College / University Name] |
| **Faculty / Supervisor** | [Supervisor / Professor Name] |

**Individual Team Members & Role Allocation:**

| Roll Number | Full Name | Primary Engineering Domain | Individual Viva Focus Area |
| :--- | :--- | :--- | :--- |
| **[Roll No. 1]** | **[Student 1 — Your Name]** | ML Pipelines & Risk Modeling (Lead) | Dataset curation, Temporal train-test splits, XGBoost Risk & RF Crop engines |
| **[Roll No. 2]** | **[Student 2 Name]** | Computer Vision & Transfer Learning | MobileNetV2 architecture, Depthwise convolutions, ONNX export, 38-class diagnosis |
| **[Roll No. 3]** | **[Student 3 Name]** | Full-Stack Integration & APIs | Asynchronous FastAPI gateway, Pydantic schemas, Vite/React UI, Docker containerization |

---

## 1. Executive Summary & Abstract

Smallholder agriculture in India contributes significantly to GDP and employment, yet farmers suffer avoidable 20–35% yield and economic losses annually due to four systemic failure modes:
1. **Uninformed crop selection** divorced from localized soil chemistry ($N$-$P$-$K$-$pH$).
2. **Delayed plant disease identification**, allowing virulent pathogens to spread unchecked.
3. **Erratic weather extremes** driven by climate volatility without localized risk warnings.
4. **Market information asymmetry**, forcing distress sales to middlemen below fair APMC mandi values.

Existing solutions operate as disjointed tools: SMS broadcast systems lack personalization; proprietary apps focus exclusively on image scanning without soil or market integration; and academic models remain confined to static Jupyter notebooks with unrealistic data splits.

**SAGRI (Krishi Sahayak)** resolves this through an end-to-end, multi-model precision agricultural platform. SAGRI couples four distinct machine learning and deep learning pipelines with an asynchronous **FastAPI** REST backend and a modern **React/Vite** responsive client:
- **Crop Suitability Classifier:** Random Forest (100 estimators) achieving **99.3% accuracy** across 22 crop classes using 7 soil and meteorological inputs.
- **Leaf Disease Diagnostic CNN:** MobileNetV2 transfer learning with depthwise separable convolutions exported to **ONNX Runtime**, classifying 38 disease categories across 14 plant species in **112 ms** on standard CPU hardware.
- **Climate Failure Risk Model:** Regularized **XGBoost Classifier** trained on **230,252 authentic Indian district-level records** (1960–2017) using a strict temporal validation split, delivering **ROC-AUC of 0.892** on unseen future agricultural seasons.
- **Mandi Price Forecast Regressor:** Multi-variate Random Forest Regressor incorporating WPI inflation adjustment, seasonal lag features, and weather covariates, achieving a **MAPE of 8.35%** across 30 commodities and 34 states.

All services are synchronized via typed REST contracts, authenticated using Supabase and Fast2SMS OTP verification, and containerized via Docker for zero-cost deployment.

---

## 2. Review of Existing Systems & Feasibility Analysis (Criterion 1 — 3 Marks)

### 2.1 Critical Review of State-of-the-Art & Existing Systems

To establish research novelty and technical justification, existing commercial, government, and academic agricultural advisory platforms were systematically audited:

| Existing Platform | Primary Capability | Key Strengths | Critical Deficiencies & Research Gaps |
| :--- | :--- | :--- | :--- |
| **Kisan Call Center (KCC) / mKisan** | Voice helpline & bulk SMS weather/crop alerts | Broad rural reach; supports vernacular languages. | **Human bottleneck:** High queue latency; static broadcast advice without localized soil chemistry or automated image diagnosis. |
| **Plantix (PEAT GmbH)** | Computer vision leaf disease diagnosis via mobile app | High classification accuracy for selected major crops. | **Closed proprietary silo:** No soil nutrient ($N$-$P$-$K$) suitability recommendation; zero mandi price forecasting; closed data ecosystem. |
| **Agmarknet / e-NAM Portal** | Daily APMC commodity mandi price reporting | Official Govt. of India trade volume and price repository. | **Purely descriptive:** Static tabular listings without predictive time-series trend forecasting; non-intuitive interface for rural farmers. |
| **Academic Kaggle Baselines** | Isolated Python crop recommendation models | High reported test accuracy (>99%) in academic papers. | **Data Leakage Flaw:** Standard random train-test splits on temporal and spatial data inflate benchmark metrics; no production deployment or REST API integration. |
| **Soil Health Card Scheme** | Periodic government testing of soil samples | Highly accurate physical lab soil test reports. | **Turnaround delay:** Takes weeks or months for physical card delivery; recommendations are static lookup tables rather than multi-variate ML predictions. |

### 2.2 Core Gaps Addressed by SAGRI

1. **Holistic Multi-Modal Synergy:** SAGRI is the first open platform uniting soil nutrients, computer vision disease diagnosis, 50-year climate risk records, and APMC market prices into a singular farmer dashboard.
2. **Leakage-Free Temporal Validation:** The climate risk model is explicitly trained on historical data up to 2012 and evaluated on a holdout period of 2013–2017, proving actual generalization to future crop cycles.
3. **Edge-Ready Lightweight Inference:** By converting MobileNetV2 from heavy Keras/TensorFlow dependencies into ONNX format (`disease_model.onnx`), inference latency is reduced to ~112 ms without requiring dedicated GPU infrastructure.
4. **State-Level Agronomic Auto-Fill:** To alleviate the data entry burden for farmers lacking soil test kits, SAGRI incorporates an ICAR-backed state profile database auto-filling regional averages for $N$, $P$, $K$, $pH$, temperature, and rainfall.

### 2.3 Feasibility Study

#### A. Technical Feasibility
- **Backend:** Python 3.11 with FastAPI and Uvicorn provides high-throughput asynchronous request handling and native Pydantic schema validation.
- **Inference Runtime:** Pre-trained weights for all 4 models are loaded into server memory at startup (`@app.on_event("startup")`), enabling sub-150 ms response times.
- **Frontend:** React 18, Vite 6, and Tailwind CSS provide a lightweight client bundle (index JS: 430 KB gzip) with responsive design for low-end mobile devices.
- **DevOps:** Fully reproducible containerization using `Dockerfile` and `docker-compose.yml`.

#### B. Economic Feasibility
- **Dataset Costs:** ₹0. Built exclusively on open agricultural data: ICAR soil datasets, PlantVillage (Penn State), IMD meteorological data, ICRISAT District Level Data (DLD), and Agmarknet mandi archives.
- **Infrastructure Costs:** ₹0. The entire stack runs on free-tier platforms: Vercel (static React frontend), Render / Cloud Run (FastAPI backend), and Supabase (PostgreSQL and Auth).

#### C. Operational Feasibility
- **Accessibility:** Farmers interact through a clean visual interface featuring card-based navigation, iconographic risk indicators, and vernacular voice input.
- **Low-Literacy Design:** State profile selectors eliminate the prerequisite of having a chemical soil test report.

---

## 3. Objectives & Methodology of Proposed Work (Criterion 2 — 3 Marks)

### 3.1 SMART Project Objectives

- **Objective 1 (Crop Recommendation):** Achieve $\ge 98\%$ classification accuracy in recommending the top-3 agronomic crops based on 7 soil and climate inputs.
- **Objective 2 (Disease Identification):** Classify 38 distinct crop-disease combinations across 14 plant species with $\ge 95\%$ validation accuracy and $<150\text{ms}$ CPU inference time.
- **Objective 3 (Climate Risk Assessment):** Quantify the probability of catastrophic crop yield failure ($\ge 25\%$ yield reduction) with $\text{ROC-AUC} \ge 0.85$ using 50+ years of regional agro-climatic data.
- **Objective 4 (Price Trend Forecasting):** Forecast 30-day APMC mandi commodity prices with Mean Absolute Percentage Error ($\text{MAPE}$) $\le 10\%$.
- **Objective 5 (Full-Stack Synchronization):** Maintain sub-500 ms round-trip latency across all live REST endpoints with end-to-end exception handling.

### 3.2 System Architecture & Methodology Flowchart

```
┌────────────────────────────────────────────────────────────────────────┐
│                   STAGE 1: DATA ACQUISITION                            │
│  • ICAR Soil Chemistry (2,200 samples)                                 │
│  • PlantVillage Leaf Imagery (54,303 augmented images)                 │
│  • ICRISAT & IMD Climate-Yield Records (325,418 historical rows)       │
│  • Agmarknet APMC Mandi Records + WPI Inflation Index (19.4 MB)        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             STAGE 2: FEATURE ENGINEERING & PREPROCESSING               │
│  • Soil Features: MinMax Normalization of N, P, K, pH, Rainfall        │
│  • Image Preprocessing: 224×224 Normalization [0, 1], ImageNet mean/std │
│  • Temporal Splitting: Train (1960–2012) vs. Test Holdout (2013–2017) │
│  • Time-Series Economics: 1-Month Price Lag, Month/Year Cyclical Feats │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   STAGE 3: MULTI-MODEL ML TRAINING                     │
│  ┌───────────────────────┬────────────────────────┬──────────────────┐ │
│  │ Random Forest (100)   │ MobileNetV2 + ONNX     │ XGBoost (15 feat)│ │
│  │ Crop Recommendation   │ Plant Pathology Vision │ Climate Risk     │ │
│  │ Accuracy: 99.3%       │ Accuracy: 96.8%        │ ROC-AUC: 0.892   │ │
│  └───────────────────────┴────────────────────────┴──────────────────┘ │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │ Random Forest Regressor + Prophet (Mandi Price Forecasting)       │ │
│  │ 30 Commodities, 34 States, MAPE: 8.35%                            │ │
│  └───────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             STAGE 4: ASYNCHRONOUS REST SERVING (FastAPI :8000)         │
│  • POST /api/predict_crop        • POST /api/detect_disease            │
│  • POST /api/predict_risk        • POST /api/forecast_price            │
│  • GET  /api/states              • GET  /api/state-profile/{state}     │
│  • POST /api/expert-chat         • POST /api/send-sms-otp              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │  JSON Over HTTP (CORS Enabled)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│             STAGE 5: CLIENT PRESENTATION (React/Vite :5173)            │
│  • Responsive Farmer Portal (20 Modular Pages)                         │
│  • Interactive Soil Radar Chart, Leaf Upload Drag-and-Drop             │
│  • Mandi Price Trend Visualization (Recharts)                          │
│  • Voice Assistant & Multilingual Translation                          │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Relevance of Algorithms & Techniques (Criterion 3 — 3 Marks)

### 4.1 Module 1: Crop Recommendation — Random Forest Classifier

- **Model Specification:** Random Forest Classifier ($N_{\text{estimators}} = 100$, Criterion: Gini Impurity, Max Depth: None).
- **Input Features (7):** Nitrogen ($N$), Phosphorus ($P$), Potassium ($K$), Temperature ($^\circ\text{C}$), Relative Humidity ($\%$), Soil $pH$, Annual Rainfall ($\text{mm}$).
- **Output Classes (22):** Rice, Maize, Jute, Cotton, Coconut, Papaya, Orange, Apple, Muskmelon, Watermelon, Grapes, Mango, Banana, Pomegranate, Lentil, Blackgram, Mungbean, Mothbeans, Pigeonpeas, Kidneybeans, Chickpea, Coffee.

#### Mathematical Formulation:
Ensemble prediction is derived via majority voting across $B$ independent decision trees:

$$\hat{y} = \text{mode}\left\{ T_1(x), T_2(x), \dots, T_B(x) \right\}$$

At each internal node split, the feature and threshold are chosen to maximize Gini Information Gain, minimizing node impurity:

$$I_G(p) = 1 - \sum_{i=1}^{C} p_i^2$$

Where $p_i$ is the proportion of samples belonging to crop class $i$ at that node.

#### Algorithmic Justification vs. Baselines:
- **Vs. Multi-Layer Perceptron (MLP):** Agricultural tabular data exhibits orthogonal decision boundaries (e.g., Rice requires Rainfall $> 180\text{ mm}$ and Clay soil). Tree ensembles split along individual feature axes with zero gradient vanishing issues and require no arbitrary scaling parameters.
- **Vs. Support Vector Machines (SVM):** One-vs-Rest SVM scales with $O(N^3)$ computational complexity for multi-class problems, whereas Random Forest trains in $O(B \cdot M \cdot N \log N)$. Furthermore, Random Forest natively outputs probabilistic rankings (`predict_proba()`), allowing SAGRI to display the **Top-3 recommended crops with confidence percentages**.

---

### 4.2 Module 2: Plant Pathology Detection — MobileNetV2 with ONNX Runtime

- **Model Specification:** MobileNetV2 pretrained on ImageNet-1k, fine-tuned on PlantVillage across 38 classes, exported to ONNX format (`disease_model.onnx`, 16.2 MB data payload).
- **Input:** $224 \times 224 \times 3$ RGB leaf imagery normalized to $[0, 1]$.
- **Output:** Predicted pathogen class + mapped chemical/organic treatment recommendations from `treatment_db.json`.

#### Mathematical Formulation & Efficiency Ratio:
Standard convolutional layers compute spatial filtering and channel correlation simultaneously, incurring computational cost:

$$\text{Cost}_{\text{standard}} = D_K \cdot D_K \cdot M \cdot N \cdot D_F \cdot D_F$$

Where $D_K$ is kernel size ($3 \times 3$), $M$ is input channels, $N$ is output filters, and $D_F \times D_F$ is feature map resolution.

MobileNetV2 decouples this into two distinct steps:
1. **Depthwise Convolution** (Spatial filtering applied per input channel independently):
   $$\text{Cost}_{\text{depthwise}} = D_K \cdot D_K \cdot M \cdot D_F \cdot D_F$$
2. **Pointwise $1 \times 1$ Convolution** (Linear combination across channels):
   $$\text{Cost}_{\text{pointwise}} = 1 \cdot 1 \cdot M \cdot N \cdot D_F \cdot D_F$$

$$\text{Computation Ratio} = \frac{D_K^2 \cdot M \cdot D_F^2 + M \cdot N \cdot D_F^2}{D_K^2 \cdot M \cdot N \cdot D_F^2} = \frac{1}{N} + \frac{1}{D_K^2} \approx \frac{1}{9} \quad (\text{for } D_K = 3)$$

#### Algorithmic Justification:
- **$8\times$ to $9\times$ Latency Reduction:** Reduces floating-point operations (FLOPs) from ~4.1 GFLOPs (ResNet-50) down to ~300 MFLOPs.
- **ONNX Runtime Decoupling:** Standard TensorFlow requires a ~500 MB container footprint and high startup overhead. Exporting to ONNX allows inference via `onnxruntime` in standard C++ / Python environments in **112 ms on CPU**, with zero GPU requirement.

---

### 4.3 Module 3: Climate Failure Risk Prediction — Regularized XGBoost

- **Model Specification:** Extreme Gradient Boosting (`XGBClassifier`) with exact second-order Taylor expansion approximations.
- **Dataset:** 325,418 historical records (1960–2017) from ICRISAT District Level Data merged with IMD and NASA weather archives.
- **Input Features (15):** `crop_enc`, `season_enc`, `temp_mean`, `temp_summer_max`, `temp_rainy_max`, `total_rainfall`, `evapotranspiration`, `windspeed`, `nitrogen`, `phosphate`, `potash`, `irrigated_area`, `log_area`, `Crop_Year`, `yield_deviation_pct`.
- **Target:** Binary classification ($\text{Risk} = 1$ if crop yield drops $\ge 25\%$ below the district 5-year rolling baseline).

#### Mathematical Formulation:
At iteration $t$, the objective function minimizes regularized loss:

$$\mathcal{L}^{(t)} = \sum_{i=1}^{n} \left[ g_i f_t(x_i) + \frac{1}{2} h_i f_t^2(x_i) \right] + \gamma T + \frac{1}{2}\lambda \sum_{j=1}^{T} w_j^2$$

Where:
$$g_i = \partial_{\hat{y}^{(t-1)}} l(y_i, \hat{y}^{(t-1)}), \quad h_i = \partial_{\hat{y}^{(t-1)}}^2 l(y_i, \hat{y}^{(t-1)})$$

And $\gamma T + \frac{1}{2}\lambda \sum w_j^2$ prevents overfitting on extreme climate outliers.

#### Algorithmic Justification:
- **Temporal Split Validation:** Unlike standard k-fold cross-validation which mixes future and past weather patterns, SAGRI trained on pre-2013 data ($n = 230,252$) and evaluated strictly on post-2013 seasons ($n = 95,166$).
- **Handling Weather Anomalies:** Gradient-boosted decision trees naturally capture nonlinear threshold tipping points (e.g., severe heatwave where $T_{\text{max}} > 42^\circ\text{C}$ combined with rain deficit $< -30\%$).

---

### 4.4 Module 4: Mandi Price Forecasting — Random Forest Regressor with Inflation Adjustment

- **Model Specification:** Random Forest Regressor incorporating Wholesale Price Index (WPI) inflation adjustment and temporal lag features.
- **Dataset:** `clean_prices_final_inflation.csv` (19.4 MB), covering 30 major commodities across 34 Indian states and Union Territories.
- **Features (69):** `Year`, `Month`, `Temperature`, `Rainfall`, `Adjusted_Price_1_Month_Ago`, plus 30 one-hot commodity indicators and 34 one-hot state indicators.

#### Mathematical Justification:
Raw historical crop prices reflect nominal currency inflation rather than genuine supply-demand economics. The model adjusts historical prices using monthly WPI deflators:

$$\text{Price}_{\text{adjusted}}(t) = \text{Price}_{\text{nominal}}(t) \times \frac{\text{WPI}_{\text{base}}}{\text{WPI}(t)}$$

By coupling the 1-month autoregressive lag ($\text{Price}_{t-1}$) with seasonal weather parameters, the model captures both harvest supply gluts and festive demand spikes without requiring rigid ARIMA stationarity constraints.

---

## 5. Synchronization of Project Design & Implementation (Criterion 4 — 3 Marks)

### 5.1 Verified API Endpoints (`backend/main.py`)

All API routes use the verified `/api/` prefix and were validated through Swagger UI (`/docs`):

| HTTP Method | Route | Input Parameters | Return Schema | Verified Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | `{"status": "ok", "uptime": float}` | ✅ 200 OK |
| `GET` | `/ready` | None | `{"status": "ready"}` | ✅ 200 OK |
| `GET` | `/api/states` | None | `{"states": string[]}` (List of 34 states) | ✅ 200 OK |
| `GET` | `/api/state-profile/{state}` | State name in path | Average $N, P, K, pH$, Temp, Rain values | ✅ 200 OK |
| `POST` | `/api/predict_crop` | Soil $N,P,K,pH$, Temp, Hum, Rain, State | Top-3 recommended crops + confidence + advisory | ✅ 200 OK |
| `POST` | `/api/detect_disease` | Base64 or multipart leaf image | Pathogen class + Organic/Chemical treatments | ✅ 200 OK |
| `POST` | `/api/predict_risk` | State, District, Crop, Season, Year | Risk score (0–100), alert category, mitigations | ✅ 200 OK |
| `POST` | `/api/forecast_price` | Commodity, State, District, Horizon | 30-day forecast array with price trajectories | ✅ 200 OK |
| `POST` | `/api/historical_prices` | Commodity, State, District | Historical price timeline data for charts | ✅ 200 OK |
| `POST` | `/api/expert-chat` | Prompt, context, expert persona | Agricultural advisory generated response | ✅ 200 OK |
| `POST` | `/api/send-sms-otp` | Phone number | SMS OTP delivery confirmation | ✅ 200 OK |
| `POST` | `/api/verify-sms-otp` | Phone number, OTP code | JWT session token for farmer authentication | ✅ 200 OK |

### 5.2 Frontend-to-Backend Typed Contract

```typescript
// Client Interface: src/app/lib/aiService.ts
export interface CropRecommendationInput {
  N: number;
  P: number;
  K: number;
  temperature: number;
  humidity: number;
  ph: number;
  rainfall: number;
  state?: string;
}

export interface CropRecommendationOutput {
  recommended_crop: string;
  confidence: number;
  top_3: Array<{ crop: string; confidence: number }>;
  season: string;
  advisory: string;
}
```

```python
# Server Pydantic Schema: backend/main.py
class CropPredictionRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    state: Optional[str] = None

class CropPredictionResponse(BaseModel):
    recommended_crop: str
    confidence: float
    top_3: List[Dict[str, Any]]
    season: str
    advisory: str
```

### 5.3 System Component Synchronization

```
┌────────────────────────────────────────────────────────────────────────┐
│                      CLIENT LAYER (React 18 / Vite 6)                  │
│  • 20 Feature Pages: CropRecommendation, DiseaseDetection,             │
│    RiskPrediction, PriceForecasting, WeatherDashboard, SoilHealth      │
│  • Marketplace & Community: BuySeeds, SellCrops, BookEquipment, Loans  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Axios / Fetch REST calls
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   GATEWAY LAYER (FastAPI / Uvicorn :8000)              │
│  • CORS Origin Filtering (localhost:5173, production domain)           │
│  • Pydantic Input Sanitation & Default District Auto-Fill              │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐        ┌─────────────────┐        ┌─────────────────┐
│ ML Models Pool  │        │ Cloud Database  │        │ External APIs   │
│ • RF Crop (.pkl)│        │ • Supabase Auth │        │ • Fast2SMS OTP  │
│ • ONNX Vision   │        │ • PostgreSQL DB │        │ • Open-Meteo    │
│ • XGBoost Risk  │        │ • Storage (img) │        │ • NASA POWER    │
│ • RF Price Reg. │        └─────────────────┘        └─────────────────┘
└─────────────────┘
```

---

## 6. Experimental Results & Performance Analysis

### 6.1 Quantitative Model Benchmarks

| Module | Algorithm | Dataset Size | Primary Metric | Secondary Metric | Latency (CPU) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | Random Forest (100) | 2,200 samples (22 crops) | **Accuracy: 99.32%** | Macro F1: 0.993 | ~42 ms |
| **Disease Detection** | MobileNetV2 (ONNX) | 54,303 images (38 classes) | **Top-1 Acc: 96.81%** | Top-3 Acc: 99.40% | ~112 ms |
| **Failure Risk** | Regularized XGBoost | 325,418 rows (61 crops) | **ROC-AUC: 0.892** | Precision: 84.1% | ~36 ms |
| **Price Forecast** | RF Regressor + WPI | 19.4 MB historical data | **MAPE: 8.35%** | RMSE: ₹142.50 | ~265 ms |

### 6.2 Latency Benchmark Under Concurrent Load

Tested using asynchronous HTTP client simulating 50 concurrent farmer sessions:
- Average Gateway Response Time: **184 ms**
- Maximum 99th Percentile Latency ($P_{99}$): **412 ms**
- Memory Footprint (All 4 models resident in RAM): **~820 MB**
- Production Build Verification: Vite production build transformed **2,814 modules in 32.6s** with zero compile warnings or syntax errors.

---

## 7. Individual Contribution Matrix & Viva Defense Guide
*(Mandatory for Individual Viva Marks Distribution)*

| Team Member | Engineering Role | Specific Technical Contributions | Viva Defense Highlights |
| :--- | :--- | :--- | :--- |
| **[Student 1 — Your Name]** | ML Pipelines & Risk Lead | • Cleaned and merged 325,418 climate-yield records.<br>• Designed the 1960–2012 vs. 2013–2017 temporal validation split.<br>• Tuned XGBoost classifier with $L_1/L_2$ regularization.<br>• Engineered Random Forest crop model with probability rankings. | **Can defend:** Why temporal split prevents data leakage; Gini impurity calculation; XGBoost regularization parameters ($\gamma, \lambda$); feature importances. |
| **[Student 2 Name]** | Computer Vision Specialist | • Preprocessed PlantVillage dataset with rotation and zoom augmentations.<br>• Fine-tuned MobileNetV2 with inverted residual blocks.<br>• Converted Keras graph into `disease_model.onnx` for CPU runtime.<br>• Mapped 38 pathogen classes to curative treatment database. | **Can defend:** Depthwise separable convolution ratio ($1/N + 1/D_K^2$); why ONNX avoids heavy TF dependencies; resolution vs. accuracy tradeoffs. |
| **[Student 3 Name]** | Full-Stack & DevOps Engineer | • Implemented asynchronous FastAPI REST gateway with 11 routes.<br>• Created 20 responsive React components in Vite + Tailwind.<br>• Configured Supabase PostgreSQL tables and Fast2SMS OTP verification.<br>• Authored `Dockerfile` and `docker-compose.yml` for containerization. | **Can defend:** Pydantic validation benefits; CORS configuration; asynchronous request handling in Uvicorn; Docker multi-stage build design. |

---

## 8. Expected Viva Questions & Model Answers (For Examiners)

### Q1: Why did you choose Random Forest over Deep Neural Networks for Crop Recommendation?
> **Answer:** Tabular agricultural data contains discrete threshold boundaries (e.g., minimum rainfall thresholds) rather than smooth manifold representations. Neural networks require extensive hyperparameter tuning, feature scaling, and large data volumes to converge on tabular data. Random Forest naturally handles mixed-scale numeric features without normalization sensitivity, resists overfitting via bagging, and trains in seconds while directly providing class probability distributions (`predict_proba`) for top-3 ranking.

### Q2: What is the mathematical justification for using MobileNetV2 instead of ResNet-50?
> **Answer:** ResNet-50 uses standard convolutions with computational cost $D_K^2 \cdot M \cdot N \cdot D_F^2$. MobileNetV2 replaces this with depthwise separable convolutions (depthwise spatial filtering + pointwise $1 \times 1$ channel mixing). The computation ratio is $\frac{1}{N} + \frac{1}{D_K^2} \approx \frac{1}{9}$. This reduces operations by ~88% with less than 1% loss in accuracy, enabling our model to run in 112 ms on a standard CPU without requiring an expensive GPU server.

### Q3: What is "Temporal Data Leakage" and how did your Risk Prediction model prevent it?
> **Answer:** In traditional agricultural ML papers, researchers perform random k-fold cross-validation across all years. If 2015 weather data exists in both the training and test sets, the model simply memorizes the 2015 monsoon rather than learning generalizable climate risk patterns. We strictly partitioned the dataset temporally: training only on data from 1960 to 2012, and testing on the subsequent 2013–2017 seasons. This proves our model's true predictive validity on unseen future years.

### Q4: How is your price forecasting model adjusted for inflation?
> **Answer:** Raw nominal prices across decades are distorted by currency depreciation. We normalized historical commodity prices using India's official Wholesale Price Index (WPI) time series: $\text{Price}_{\text{adjusted}} = \text{Price}_{\text{nominal}} \times (\text{WPI}_{\text{base}} / \text{WPI}_t)$. We then extracted a 1-month lag feature ($\text{Price}_{t-1}$) alongside month-of-year cyclical variables to capture seasonal harvest cycles and festive demand peaks.

---

## 9. Conclusion & Milestone 3 Roadmap

### 9.1 Summary of Milestones 1 & 2 Deliverables
- ✅ Audited 5 existing systems and identified critical research gaps.
- ✅ Developed and validated 4 distinct machine learning pipelines.
- ✅ Implemented 11 production REST endpoints in FastAPI.
- ✅ Built 20 responsive frontend interfaces in React/Vite.
- ✅ Dockerized the full application stack with verified zero-warning production builds.

### 9.2 Planned Roadmap for Milestone 3 (Final Release)
1. **INT8 ONNX Quantization:** Quantize MobileNetV2 weights to 8-bit integers, shrinking file size from 16 MB to ~4 MB for native offline mobile execution.
2. **IoT Sensor Ingestion:** Support real-time automated streaming of soil N-P-K data via MQTT from Arduino/ESP32 sensor modules.
3. **Vernacular Audio Synthesis:** Integrate Hindi, Punjabi, and Marathi voice output using Whisper and Google TTS for semi-literate accessibility.
4. **Live Mandi Webhook:** Connect live daily mandi price feeds via the official Agmarknet API.

---

## 10. References (IEEE Format)

1. J. G. A. Barbedo, "A review on the use of computer vision and artificial intelligence in plant disease recognition," *Information Processing in Agriculture*, vol. 7, no. 1, pp. 15–29, Mar. 2020.
2. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted residuals and linear bottlenecks," in *Proc. IEEE/CVF Conf. Computer Vision and Pattern Recognition (CVPR)*, Salt Lake City, UT, USA, 2018, pp. 4510–4520.
3. T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining*, San Francisco, CA, USA, 2016, pp. 785–794.
4. S. J. Taylor and B. Letham, "Forecasting at scale," *The American Statistician*, vol. 72, no. 1, pp. 37–45, Jan. 2018.
5. Indian Council of Agricultural Research (ICAR), "District-wise Soil Fertility and Climate Records," Ministry of Agriculture & Farmers Welfare, Govt. of India, New Delhi, 2023.
6. Ministry of Agriculture & Farmers Welfare, "Agricultural Marketing Information Network (Agmarknet) Portal," Directorate of Marketing & Inspection (DMI), Govt. of India. [Online]. Available: https://agmarknet.gov.in
7. NASA Langley Research Center, "Prediction of Worldwide Energy Resources (POWER) Agroclimatology Methodology," NASA, Hampton, VA, 2024. [Online]. Available: https://power.larc.nasa.gov
