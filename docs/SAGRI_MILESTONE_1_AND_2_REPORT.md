# Project Report: SAGRI (Smart Agriculture and Krishi Sahayak)
## Milestone 1 and Milestone 2 Evaluation Report
Course: Artificial Intelligence and Machine Learning Laboratory (Lab Week 8)  
Evaluation Dates: October 5 to October 9, 2026  
Total Evaluation Weight: 12 Marks  

---

### Project Information

| Field | Details |
| :--- | :--- |
| **Project Name** | SAGRI: AI-Based Advisory System for Crop, Disease, and Market Planning |
| **Institution** | Bennett University, Greater Noida |
| **School / Department** | School of Computer Science Engineering and Technology (SCSET) |
| **Faculty Guide / Evaluator** | Monu Singh |

**Student Team Details and Responsibilities:**

| Enrollment No. | Student Name | Project Role | Primary Viva Focus Area |
| :--- | :--- | :--- | :--- |
| **S24CSEU0502** | **Shikhar Kesharwani** | Team Lead & ML Engineer | Crop Recommendation (Random Forest), Crop Risk Classifier (XGBoost), Data Cleaning, Temporal Train-Test Split |
| **S24CSEU0465** | **Santusht Lakhanpal** | Computer Vision Engineer | Plant Pathology Diagnosis (MobileNetV2), PlantVillage Preprocessing, ONNX CPU Model Export |
| **S24CSEU0460** | **Sanchit Jain** | Full-Stack & Integration Engineer | Asynchronous FastAPI Backend, React Web UI, Supabase Integration, Docker Configuration |

---

## 1. Project Overview & Problem Statement

During our initial laboratory discussions at Bennett University, our team set out to tackle a genuine, persistent issue in Indian agriculture: smallholder farming decisions are still largely based on ancestral habits, subjective assumptions, and local middlemen. With climate shifts, erratic rainfall patterns, and sudden market price crashes, traditional guesswork often causes disastrous financial losses.

In our problem analysis, we identified three core bottlenecks:
1. **Uninformed Crop Sowing:** Farmers often plant crops that do not suit their soil chemistry (Nitrogen, Phosphorus, Potassium, and pH) or local weather, leading to poor yield and wasted fertilizer expenditure.
2. **Late Diagnosis of Crop Diseases:** When leaf infections break out, farmers usually notice them only after patches of the field turn yellow or rot. Agricultural extension officers cannot visit every remote farm immediately, so crops are frequently lost to preventable diseases.
3. **Mandi Market Price Opacity:** Farmers sell their produce right after harvest without knowing whether market prices will rise or drop over the next four weeks. Middlemen exploit this uncertainty, forcing farmers into distress sales at low prices.

To solve all three issues within a unified software platform, our team (Shikhar, Santusht, and Sanchit) built SAGRI (Krishi Sahayak). We designed SAGRI as a responsive web platform powered by an asynchronous Python FastAPI backend that serves four specialized machine learning and deep learning models:
- **Crop Recommendation:** Suggests the top-3 best crops for a farmer's plot based on 7 soil and weather factors using a Random Forest classifier (99.3% accuracy).
- **Leaf Disease Scanner:** Detects 38 plant disease classes from leaf photos using MobileNetV2 exported to ONNX format, returning diagnosis and remedies in 112 milliseconds on an ordinary laptop CPU.
- **Crop Failure Risk Radar:** Predicts the likelihood of severe yield drops (25% or worse) using an XGBoost classifier trained on 230,252 historical district records.
- **Mandi Price Forecast:** Predicts 30-day commodity price trends for 30 major crops across 34 states using a Random Forest regressor adjusted for inflation with the Wholesale Price Index (WPI).

---

## 2. Review of Existing Systems (Rubric Criterion 1 - 3 Marks)

### 2.1 Study of Current Tools and Market Solutions

To ensure our work addressed real gaps rather than duplicating existing tools, we analyzed four current systems:

1. **Kisan Call Center (KCC) and mKisan SMS Service:**
   - *Overview:* Government-run toll-free telephone advisory (1800-180-1551) and bulk SMS weather notifications.
   - *Strengths:* Wide reach across rural India with vernacular language support.
   - *Limitations:* Phone lines often suffer from long wait times during peak sowing and harvesting seasons. The SMS bulletins give generalized district alerts rather than farm-specific soil recommendations, and telephone operators cannot diagnose plant diseases from photos.

2. **Plantix Mobile Application:**
   - *Overview:* Commercial mobile app that uses computer vision to detect plant diseases from leaf photographs.
   - *Strengths:* High accuracy on common vegetable and fruit diseases.
   - *Limitations:* Closed-source proprietary system. It only focuses on leaf scanning. It does not provide soil nutrient suitability advice, mandi market price predictions, or regional climate risk forecasting.

3. **e-NAM and Agmarknet Portals:**
   - *Overview:* Official Ministry of Agriculture websites tracking daily commodity prices and arrival volumes across Indian APMC mandis.
   - *Strengths:* Official, authentic government transaction database.
   - *Limitations:* These portals only display historical and current tabular listings. They offer no forward-looking time-series forecasts to help farmers plan harvest sales, and their interface is difficult to navigate on mobile browsers.

4. **Published Academic / Kaggle Notebooks:**
   - *Overview:* Open-source Python notebooks applying machine learning algorithms to standard agricultural datasets.
   - *Strengths:* Clear starting benchmarks for initial model exploration.
   - *Limitations:* Nearly every online notebook uses a random train-test split on temporal weather data. This causes severe data leakage because weather data from the same year ends up in both training and test sets. Moreover, these notebooks almost never deploy their models into a working full-stack web application.

### 2.2 Key Improvements Built Into SAGRI

- **Unified Multi-Service Portal:** Farmers do not need three separate applications. Soil advisory, leaf disease diagnosis, climate risk, and market trends are accessible under one clean dashboard.
- **Realistic Chronological Validation:** In our risk prediction module, we strictly trained on records up to 2012 and evaluated on 2013 to 2017 data. This verified that our model works on genuinely unseen future seasons.
- **Lightweight CPU Deployment:** Converting our deep learning model into ONNX format allowed us to run inferences in 112 milliseconds without requiring GPU servers.
- **State Soil Average Auto-Fill:** For farmers who have not had their soil tested in a lab, selecting their state automatically populates typical regional averages for Nitrogen, Phosphorus, Potassium, pH, and rainfall from our ICAR-backed database.

---

## 3. Project Feasibility Analysis (Rubric Criterion 1 - 3 Marks)

We verified three dimensions of feasibility before implementing the system:

1. **Technical Feasibility:**
   - The project uses mature open-source tools: Python 3.11, Scikit-Learn, XGBoost, ONNX Runtime, FastAPI, React 18, and Vite 6.
   - By preloading model weights into memory during backend startup, each inference request is processed in under 50 milliseconds.
   - The React frontend compiles down to a lightweight 430 KB gzip bundle, ensuring smooth performance on low-cost Android smartphones and 3G/4G connections.

2. **Economic Feasibility:**
   - Datasets used (ICAR soil surveys, PlantVillage imagery, Agmarknet trade logs, and ICRISAT climate archives) are publicly available at zero cost.
   - All runtime tools, libraries, and frameworks are open-source.
   - The deployment runs within free-tier cloud resources (Vercel for frontend hosting, Supabase for authentication and database storage).
   - Total software budget required: zero rupees.

3. **Operational Feasibility:**
   - The user interface uses intuitive color badges (green for safe, red for high risk), simple dropdowns, and card layouts.
   - Farmers do not need technical knowledge of machine learning to receive actionable guidance.

---

## 4. Objectives and Methodology (Rubric Criterion 2 - 3 Marks)

### 4.1 Measurable Engineering Targets

1. **Crop Suitability:** Recommend the top 3 suitable crops with at least 98% accuracy across 22 crop classes.
2. **Disease Diagnosis:** Classify 38 leaf disease categories across 14 crops with over 95% validation accuracy in under 150 milliseconds on CPU.
3. **Yield Risk Assessment:** Predict high-risk yield losses (25% or worse) with an ROC-AUC score of at least 0.85 on unseen future years.
4. **Price Trend Prediction:** Forecast 30-day commodity price trends with a Mean Absolute Percentage Error (MAPE) below 10%.
5. **System Response Time:** Maintain end-to-end API response latency under 500 milliseconds for all routes.

### 4.2 System Workflow and Engineering Stages

Our project was built across five practical stages:

- **Stage 1: Dataset Acquisition and Curation**
  We collected 2,200 soil nutrient rows from ICAR records, 54,303 leaf images from the PlantVillage dataset, 325,418 district weather-yield entries from ICRISAT/IMD, and 19.4 MB of historical mandi price records.

- **Stage 2: Data Preprocessing and Feature Engineering**
  We normalized numerical soil features, resized leaf images to 224 by 224 pixels with rotation and flip augmentations, adjusted mandi prices for inflation using monthly WPI deflators, and divided climate records using a strict pre-2013 training and post-2013 testing split.

- **Stage 3: Model Training and Validation**
  We trained a 100-tree Random Forest classifier for crop recommendations, fine-tuned MobileNetV2 with transfer learning and converted it to ONNX, tuned an XGBoost classifier for climate risk, and trained a Random Forest regressor with one-month lag prices for mandi price trends.

- **Stage 4: Asynchronous REST API Development**
  We wrote REST endpoints in `backend/main.py` using FastAPI. We defined Pydantic validation models to verify data ranges before executing model inference.

- **Stage 5: Frontend Interface and Integration**
  We developed React pages with responsive cards, integrated interactive charts for mandi price trends, and connected all forms to our FastAPI backend routes.

---

## 5. Algorithms Used and Technical Justifications (Rubric Criterion 3 - 3 Marks)

### 5.1 Crop Recommendation: Random Forest Classifier

**How the Algorithm Works:**  
Random Forest creates an ensemble of 100 decision trees. When a farmer enters 7 inputs (Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Soil pH, and Rainfall), every tree evaluates the conditions and votes for a crop. The final recommendation is decided by majority voting.

**Node Splitting via Gini Impurity:**  
Decision trees determine splits by picking the feature and threshold that minimizes Gini Impurity:  
`Gini = 1 - sum(p_i * p_i)`  
Here, `p_i` represents the proportion of samples belonging to crop `i` at that node. When a node contains only one crop type, Gini is 0 (pure). When crops are evenly mixed, Gini is high. The algorithm chooses splits that maximize purity.

**Why Shikhar Chose Random Forest:**
- A single Decision Tree overfits easily; a minor rainfall change can alter the prediction completely. Averaging 100 trees eliminates this variance.
- Tabular agricultural data contains clear, sharp boundaries (for example, rice strictly requires annual rainfall above 180 mm). Tree ensembles handle threshold conditions natively without needing feature scaling.
- Random Forest provides probability scores through `.predict_proba()`, allowing our interface to show the farmer their **Top-3 recommended crops** with clear percentage confidence.
- *Debugging Note:* When unpickling the model on Python 3.13, Scikit-Learn issued a minor version notification (model trained on v1.4.2 vs runtime v1.9.0), but validation confirmed predictions remained 100% stable and correct.

---

### 5.2 Plant Disease Detection: MobileNetV2 with ONNX Runtime

**How the Algorithm Works:**  
Santusht implemented MobileNetV2, an efficient Convolutional Neural Network pretrained on ImageNet and fine-tuned on 54,303 leaf photos from the PlantVillage dataset across 38 classes (covering healthy leaves and bacterial, fungal, and viral infections across 14 crops).

**Why MobileNetV2 is Fast (Depthwise Separable Convolutions):**  
Standard convolutions perform spatial filtering and channel mixing in one heavy calculation. MobileNetV2 splits this into two steps:
1. **Depthwise Convolution:** A single 3x3 filter is applied to each channel independently to capture spatial details.
2. **Pointwise Convolution:** A 1x1 filter is applied across all channels to blend them into new feature representations.

This two-step approach reduces mathematical operations by roughly **8 to 9 times** compared to standard networks like ResNet-50, while retaining high diagnostic accuracy (96.8%).

**Why We Converted to ONNX (`disease_model.onnx`):**  
Running standard TensorFlow on a web server requires heavy packages (over 500 MB) and high memory overhead. By saving the trained model as an ONNX graph, we run inference via the lightweight `onnxruntime` package in just **112 milliseconds on an ordinary laptop CPU**, requiring no dedicated GPU hardware.

---

### 5.3 Crop Failure Risk: Regularized XGBoost Classifier

**How the Algorithm Works:**  
XGBoost (Extreme Gradient Boosting) constructs decision trees sequentially. Instead of training trees independently, each new tree is fitted specifically to correct the residual errors of the previous trees using second-order gradients.

**Features Used (15 inputs):**  
Crop type, season, mean temperature, summer maximum temperature, rainy season maximum temperature, total rainfall, evapotranspiration, wind speed, Nitrogen, Phosphate, Potash, irrigated area ratio, log of plot area, crop year, and historical yield deviation.

**Why Shikhar Chose XGBoost:**
- Historical agricultural records often have missing weather readings due to rural sensor downtime. XGBoost automatically learns a default branch direction for missing values during training.
- XGBoost incorporates regularization parameters (Gamma and Lambda) that penalize deep, complex trees, preventing the model from memorizing rare weather outliers.
- **Preventing Temporal Data Leakage:** In standard academic projects, random cross-validation allows data from a drought year (like 2015) into both train and test sets, causing the model to simply memorize that year's bad monsoon. We strictly trained on 230,252 records from 1960 to 2012, and tested on 95,166 records from 2013 to 2017. Our model achieved an **ROC-AUC of 0.892**, proving it generalizes to future seasons.

---

### 5.4 Mandi Price Forecasting: Random Forest Regressor with WPI Inflation

**How the Algorithm Works:**  
Commodity prices fluctuate based on harvest cycles, festival demand, and monetary inflation. Our model is trained on 19.4 MB of historical APMC market records across 30 commodities and 34 states.

**Key Technical Decisions:**
1. **Inflation Adjustment via WPI:** A quintal of wheat sold for Rs 300 twenty years ago and sells for over Rs 2,200 today. Feeding raw historical rupee numbers into an ML model causes it to learn currency inflation rather than farming economics. We normalized all past prices using the Wholesale Price Index (WPI).
2. **Lag Features:** The model uses the previous month's price (`Price_t-1`), current month cyclical variables, and local rainfall to forecast the next 30 days of market prices.
3. **Accuracy:** Achieved a Mean Absolute Percentage Error (MAPE) of **8.35%**, outperforming standard moving averages.

---

## 6. Implementation and System Integration (Rubric Criterion 4 - 3 Marks)

### 6.1 Verified API Endpoints (`backend/main.py`)

Sanchit developed the backend using FastAPI. All routes were tested on `http://localhost:8000` and confirmed working:

| Method | Endpoint Route | Parameters Received | Data Returned | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Server status and uptime | 200 OK |
| `GET` | `/api/states` | None | List of 34 supported Indian states | 200 OK |
| `GET` | `/api/state-profile/{state}` | State name | Average regional soil and rainfall values | 200 OK |
| `POST` | `/api/predict_crop` | Soil N, P, K, pH, Temp, Rain | Top 3 recommended crops with confidence % | 200 OK |
| `POST` | `/api/detect_disease` | Base64 leaf image | Disease name, organic and chemical remedies | 200 OK |
| `POST` | `/api/predict_risk` | State, district, crop, season, year | Risk score (0 to 100), alert level, advice | 200 OK |
| `POST` | `/api/forecast_price` | Crop name, state, district | 30-day daily price forecast array | 200 OK |
| `POST` | `/api/historical_prices` | Crop name, state, district | Past price trends for chart plotting | 200 OK |
| `POST` | `/api/expert-chat` | Farmer question text | AI agricultural advisory reply | 200 OK |
| `POST` | `/api/send-sms-otp` | Mobile number | 6-digit login OTP via Fast2SMS | 200 OK |

---

### 6.2 System Screenshots (Running Application Proof)

*Note: The following placeholder frames indicate where system verification screenshots are positioned in this report:*

```
+-----------------------------------------------------------------------------------+
|  [PASTE SCREENSHOT 1 HERE]                                                        |
|  Figure 1: SAGRI Crop Recommendation interface running on http://localhost:5173   |
|  Showing soil N-P-K inputs, state auto-fill, and predicted top-3 crop confidences |
+-----------------------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------------------+
|  [PASTE SCREENSHOT 2 HERE]                                                        |
|  Figure 2: Plant Pathology Leaf Scanner running on http://localhost:5173          |
|  Showing uploaded leaf image, diagnosed disease, and curative remedies            |
+-----------------------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------------------+
|  [PASTE SCREENSHOT 3 HERE]                                                        |
|  Figure 3: Interactive Swagger API Documentation on http://localhost:8000/docs    |
|  Showing verified live REST endpoints served by Python FastAPI backend            |
+-----------------------------------------------------------------------------------+
```

---

## 7. Experimental Results and Observations

### 7.1 Quantitative Benchmark Summary

| Module | Model Family | Dataset Size | Primary Metric | CPU Latency |
| :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | Random Forest (100 trees) | 2,200 rows (22 crops) | **99.3% Accuracy** | ~42 ms |
| **Disease Detection** | MobileNetV2 (ONNX format) | 54,303 images (38 classes) | **96.8% Top-1 Accuracy** | ~112 ms |
| **Crop Failure Risk** | Regularized XGBoost | 325,418 rows (230k train, 95k test) | **0.892 ROC-AUC** | ~36 ms |
| **Mandi Price Forecast** | Random Forest Regressor + WPI | 19.4 MB APMC price records | **8.35% MAPE** | ~260 ms |

### 7.2 System Performance Observations
- **Memory Footprint:** Approximately 820 MB RAM with all four models resident in memory.
- **Frontend Build:** Built cleanly with Vite: 2,814 modules transformed in 32.6 seconds with zero compile warnings or syntax errors.
- **End-to-End Latency:** Average round-trip latency measured between 180 and 250 milliseconds during local testing.

---

## 8. Division of Work and Team Contributions (For Viva Grading)

### Student 1: Shikhar Kesharwani (S24CSEU0502) - Lead Machine Learning Engineer
- Cleaned and organized the 2,200-row ICAR soil dataset and the 325,000-row ICRISAT climate-yield dataset.
- Built the Random Forest crop recommendation model, tuned tree depth, and configured top-3 probability outputs.
- Designed the chronological train-test split (pre-2013 vs post-2013) to prevent temporal data leakage.
- Trained and evaluated the regularized XGBoost crop risk classifier.
- *Viva defense focus:* Can explain Gini Impurity, why temporal splitting was needed, and how XGBoost avoids overfitting.

### Student 2: Santusht Lakhanpal (S24CSEU0465) - Computer Vision Engineer
- Downloaded and augmented the 54,000-image PlantVillage dataset for 38 disease categories across 14 crops.
- Fine-tuned MobileNetV2 using transfer learning.
- Exported the model to ONNX format so it runs quickly on standard CPUs without GPU dependencies.
- Created the treatment database (`treatment_db.json`) linking each disease to organic and chemical remedies.
- *Viva defense focus:* Can explain Depthwise Separable Convolutions, why MobileNetV2 is fast, and how ONNX runtime works.

### Student 3: Sanchit Jain (S24CSEU0460) - Full-Stack Developer
- Wrote the asynchronous FastAPI backend in `backend/main.py` with Pydantic request models.
- Built the React user interface using Vite and Tailwind CSS across 20 modular pages.
- Added state profile auto-fill features and dynamic charts for price trends.
- Configured CORS, environment variable security, and Docker containerization.
- *Viva defense focus:* Can explain REST API routing, Pydantic validation, how React talks to FastAPI, and Docker setup.

---

## 9. Conclusion and Milestone 3 Roadmap

In Milestones 1 and 2, our team completed the literature review, curated authentic Indian agricultural datasets, trained four machine learning models, and integrated them into a functional full-stack web application.

**Planned Work for Milestone 3 (Final Phase):**
- **Model Quantization:** Quantize the ONNX disease detection model to INT8 precision to reduce its file size from 16 MB to under 5 MB for fast edge execution.
- **IoT Sensor Streaming:** Connect ESP32 soil sensor hardware modules to stream real-time Nitrogen, Phosphorus, Potassium, and moisture readings directly to the recommendation API.
- **Vernacular Audio Advisory:** Integrate Hindi and regional language voice output using text-to-speech for farmers who prefer listening over reading.
- **Live Mandi Webhook:** Connect live daily mandi price feeds via the official Agmarknet API to complement historical forecasting.

---

## 10. References (IEEE Format)

[1] J. G. A. Barbedo, "A review on the use of computer vision and artificial intelligence in plant disease recognition," *Information Processing in Agriculture*, vol. 7, no. 1, pp. 15-29, Mar. 2020.  
[2] M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted residuals and linear bottlenecks," in *Proc. IEEE/CVF Conf. Computer Vision and Pattern Recognition (CVPR)*, Salt Lake City, USA, 2018, pp. 4510-4520.  
[3] T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining*, San Francisco, USA, 2016, pp. 785-794.  
[4] Indian Council of Agricultural Research (ICAR), "District-wise Soil Fertility Status of Indian Soils," Ministry of Agriculture and Farmers Welfare, Govt. of India, New Delhi, 2023.  
[5] Ministry of Agriculture and Farmers Welfare, "Agmarknet: Agricultural Marketing Information Network Portal," Directorate of Marketing and Inspection (DMI), Govt. of India. [Online]. Available: https://agmarknet.gov.in
