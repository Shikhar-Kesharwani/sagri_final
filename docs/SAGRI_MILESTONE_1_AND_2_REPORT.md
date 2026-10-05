# Project Report: SAGRI (Smart Agriculture & Krishi Sahayak)
## Milestone 1 & Milestone 2 Evaluation Report
**Course:** Artificial Intelligence & Machine Learning Laboratory (Lab Week 8)  
**Evaluation Dates:** 5 October – 9 October 2026  
**Total Marks:** 12 Marks  

---

### Project Information

| Field | Details |
| :--- | :--- |
| **Project Title** | SAGRI — AI-Powered Farming Advisory & Decision Support System |
| **Team / Group ID** | [Enter Group ID, e.g., Group 12] |
| **College / University** | [Enter College Name] |
| **Department** | Computer Science & Engineering / AI & Data Science |
| **Faculty Guide / Lab Evaluator** | [Enter Faculty Name] |

**Team Members and Individual Responsibilities:**

| Roll No. | Student Name | Role in Project | Viva Focus Area |
| :--- | :--- | :--- | :--- |
| **[Roll No. 1]** | **[Your Name]** | ML Models Lead | Data cleaning, Crop Recommendation (Random Forest), Crop Risk Prediction (XGBoost), Time-series validation |
| **[Roll No. 2]** | **[Teammate 2 Name]** | Computer Vision Specialist | PlantVillage dataset preprocessing, MobileNetV2 disease detection model, ONNX conversion |
| **[Roll No. 3]** | **[Teammate 3 Name]** | Full-Stack Developer | FastAPI backend, REST API endpoints, React frontend interface, Supabase integration |

---

## 1. Project Overview & Abstract

In India, farming decisions are still largely based on guesswork and traditional habits. Because of this, farmers face major losses every year due to three common problems:
1. Planting crops that do not match the soil nutrients or rainfall of their area.
2. Spotting leaf diseases too late, when the infection has already spread across the field.
3. Selling harvested produce to local middlemen at very low rates because they do not know upcoming mandi market prices.

To solve these problems in a single system, we built **SAGRI (Krishi Sahayak)**. It is a web-based AI platform that gives farmers personalized, data-backed guidance in simple language.

SAGRI has four core machine learning features:
- **Crop Recommendation:** Recommends the top 3 best-suited crops based on soil nutrients (Nitrogen, Phosphorus, Potassium, pH) and weather (temperature, humidity, rainfall). Built using Random Forest, achieving 99.3% accuracy.
- **Plant Disease Detection:** Farmers upload a picture of a sick leaf, and the model identifies the disease from 38 possible categories and suggests both chemical and organic treatments. Built using MobileNetV2 and runs in about 110 milliseconds on a standard laptop CPU.
- **Crop Risk Prediction:** Estimates the risk of major crop failure (low, medium, high) based on historical weather extremes and rainfall deficits across Indian districts. Built using XGBoost on over 230,000 real government records.
- **Mandi Price Forecast:** Predicts the expected market price for 30 major crops across 34 states for the next 30 days, adjusted for inflation. Built using Random Forest regression with past price trends.

The frontend is built with React and Vite for a clean, fast user interface, and the backend is built with Python FastAPI to serve all model predictions through REST APIs.

---

## 2. Review of Existing Systems & Feasibility (Rubric Criterion 1 — 3 Marks)

### 2.1 Study of Existing Systems

Before building our solution, we reviewed the most common tools and portals currently available to Indian farmers:

1. **Kisan Call Center (KCC) and mKisan:**
   - *What it offers:* Government toll-free helpline (1800-180-1551) and SMS weather bulletins.
   - *Strengths:* Wide reach, available in local languages.
   - *Weaknesses:* Waiting times on phone lines are long; advice is general and not tailored to an individual farmer's exact soil values; cannot diagnose crop diseases from images.

2. **Plantix App:**
   - *What it offers:* Mobile app where farmers click a photo of an infected leaf to detect diseases.
   - *Strengths:* Good image recognition for common crops.
   - *Weaknesses:* Closed proprietary app; does not provide soil nutrient analysis, crop planning advice, or mandi price predictions.

3. **e-NAM and Agmarknet Portals:**
   - *What it offers:* Official government websites showing daily commodity arrival volumes and mandi rates.
   - *Strengths:* Authentic government market records.
   - *Weaknesses:* Only shows past and current prices in large tabular lists. It does not forecast future price trends to help farmers decide when to sell. The web design is also difficult for rural users to navigate on mobile.

4. **Existing College / Academic ML Projects:**
   - *What they offer:* Python notebooks that run basic classifiers on small Kaggle datasets.
   - *Strengths:* Good starting point for model testing.
   - *Weaknesses:* Most papers use random train-test splits on time-based data, which creates data leakage (the model accidentally memorizes future weather). Almost none of them deploy the models into a working full-stack website.

### 2.2 What Makes SAGRI Different

- **All-in-One Dashboard:** Instead of using three separate apps for soil, diseases, and market rates, farmers get everything in one simple interface.
- **No Data Leakage in Risk Model:** We split our 50-year climate dataset strictly by year (train on data before 2013, test on 2013 to 2017). This ensures the model is tested on unseen future weather patterns, like in the real world.
- **Fast CPU Inference:** We converted our deep learning disease model into ONNX format (`disease_model.onnx`). It runs directly on normal CPUs without needing an expensive GPU.
- **State Average Auto-Fill:** Farmers who do not have a recent soil test card can simply choose their state, and SAGRI automatically fills in the regional average N-P-K and rainfall values.

### 2.3 Feasibility Analysis

- **Technical Feasibility:** The project uses reliable open-source frameworks: Python, Scikit-Learn, XGBoost, ONNX Runtime, and React. Models are loaded into memory once when the server starts up, allowing quick sub-second responses.
- **Economic Feasibility:** All datasets used (ICAR soil records, PlantVillage dataset, Agmarknet price lists, and IMD/NASA climate records) are open-access and free. Hosting runs on free cloud tiers (Vercel and Supabase), so zero infrastructure budget was needed.
- **Operational Feasibility:** The website is designed with clear icons, simple forms, card layouts, and audio assistant features so farmers with basic smartphone knowledge can use it comfortably.

---

## 3. Objectives & Methodology (Rubric Criterion 2 — 3 Marks)

### 3.1 Project Objectives

1. Build a crop suitability model that reaches at least 98% accuracy on 22 different crop categories.
2. Build an image classifier that recognizes 38 plant disease classes from leaf photos with over 95% validation accuracy in under 150 milliseconds.
3. Build a regional crop failure risk model using 50+ years of climate records that achieves an ROC-AUC score of at least 0.85.
4. Build a commodity price forecaster providing 30-day daily price estimates with a Mean Absolute Percentage Error (MAPE) under 10%.
5. Connect all models into a single working web platform using FastAPI and React, keeping response times below 500 milliseconds.

### 3.2 System Flow and Methodology

The project was developed in five sequential stages:

**Stage 1: Data Collection**
- Soil Dataset: 2,200 soil and climate records covering 22 crops (Rice, Maize, Jute, Cotton, Fruits, Pulses, Coffee).
- Disease Dataset: 54,303 leaf images across 14 plant species from the PlantVillage dataset.
- Climate & Yield Dataset: 325,418 district-level historical agricultural records from ICRISAT and IMD (1960 to 2017).
- Mandi Price Dataset: 19.4 MB of daily APMC price data across 30 commodities and 34 states.

**Stage 2: Data Preprocessing & Cleaning**
- Scaled soil values to standard ranges.
- Resized leaf images to 224 by 224 pixels and applied image augmentation (rotations, flips, zooming) to prevent overfitting.
- Adjusted historical mandi prices against the Wholesale Price Index (WPI) so inflation over past decades does not distort modern predictions.
- Divided the climate risk dataset using a temporal split: data from 1960 to 2012 for training (230,252 rows) and 2013 to 2017 for testing (95,166 rows).

**Stage 3: Model Training & Tuning**
- Trained a Random Forest Classifier with 100 trees for crop recommendation.
- Fine-tuned MobileNetV2 with transfer learning for leaf disease classification, then exported to ONNX format.
- Trained an XGBoost Classifier with regularization parameters to estimate crop failure risk.
- Trained a Random Forest Regressor using one-month price lag features and seasonal weather variables for price forecasting.

**Stage 4: Backend API Development (FastAPI)**
- Built REST API endpoints (`/api/predict_crop`, `/api/detect_disease`, `/api/predict_risk`, `/api/forecast_price`).
- Implemented input validation using Pydantic schemas so incorrect inputs return clear error messages.
- Added CORS support so the React frontend can safely communicate with the backend.

**Stage 5: Frontend Interface Development (React + Vite)**
- Created dedicated pages for Crop Recommendation, Disease Scanner, Risk Radar, and Mandi Price Tracker.
- Added data visualizations using charts (Recharts) and an auto-fill feature for state soil averages.

---

## 4. Explanation of Algorithms & Justifications (Rubric Criterion 3 — 3 Marks)

### 4.1 Crop Recommendation: Random Forest Classifier

**How it works:**  
Random Forest creates an ensemble of 100 decision trees. When a farmer inputs soil values (Nitrogen, Phosphorus, Potassium, pH) and weather values (temperature, humidity, rainfall), each tree in the forest casts a vote for the most suitable crop. The final recommendation is the crop with the highest majority vote.

**Splitting Criteria (Gini Impurity):**  
At each split in a decision tree, the algorithm chooses the feature and threshold that minimizes Gini Impurity:  
`Gini = 1 - sum(p_i^2)`  
Here, `p_i` is the probability of a sample belonging to crop `i`. If a node contains only one type of crop, Gini is 0 (pure). If crops are evenly mixed, Gini is high.

**Why we chose Random Forest over alternatives:**
- *Compared to a Single Decision Tree:* A single tree easily overfits and gives erratic results on small variations in rainfall. Random Forest averages 100 trees, which greatly reduces variance.
- *Compared to Deep Neural Networks (MLP):* Tabular agricultural data has clear cut-off rules (for example, rice needs high rainfall above 180 mm). Decision trees handle these cut-offs directly without needing complex neural network training or heavy compute.
- *Confidence Scores:* Random Forest can output probability percentages for every crop (`predict_proba`), allowing us to show the farmer their **Top-3 options** with percentage confidence.

---

### 4.2 Disease Detection: MobileNetV2 with Depthwise Separable Convolutions

**How it works:**  
We used MobileNetV2, an efficient Convolutional Neural Network (CNN) pretrained on ImageNet and fine-tuned on the PlantVillage dataset to classify 38 plant disease classes.

**Why MobileNetV2 is fast (Depthwise Separable Convolutions):**  
Standard convolutions filter spatial patterns and mix color channels in a single heavy mathematical step. MobileNetV2 breaks this into two smaller steps:
1. **Depthwise Convolution:** Applies a single 3x3 filter to each input channel independently to capture spatial details.
2. **Pointwise Convolution:** Applies a 1x1 filter across all channels to combine them into new features.

This two-step process reduces the number of calculations by roughly **8 to 9 times** compared to standard CNNs like ResNet-50, with almost no loss in accuracy.

**Why we exported to ONNX (`disease_model.onnx`):**  
Running standard TensorFlow or PyTorch on a server requires huge library installations (over 500 MB) and lots of RAM. By exporting the trained weights to ONNX format, we run inference using the lightweight `onnxruntime` library. It takes only **112 milliseconds** per leaf image on a normal CPU.

---

### 4.3 Crop Failure Risk: XGBoost Classifier

**How it works:**  
XGBoost (Extreme Gradient Boosting) builds decision trees sequentially. Each new tree focuses specifically on correcting the prediction mistakes made by the previous trees.

**Key Features Used (15 features):**  
- Crop type and farming season (Kharif, Rabi, Summer)
- Average temperature, summer maximum temperature, rainy season maximum temperature
- Total rainfall and rainfall anomalies
- Wind speed and evapotranspiration
- Soil Nitrogen, Phosphate, and Potash levels
- Irrigated area percentage and historical yield deviation

**Why we chose XGBoost over alternatives:**
- *Handles Missing Data:* Real rural weather records sometimes have missing sensor readings. XGBoost automatically learns a default split direction for missing values.
- *Regularization against Overfitting:* XGBoost has built-in penalty parameters (called Gamma and Lambda) that stop trees from growing too deep on random weather spikes.
- *Solves Temporal Data Leakage:* In standard college projects, data is split randomly. If the year 2015 is in both training and testing sets, the model simply memorizes that 2015 was a drought year. In SAGRI, we trained only on records from 1960 to 2012, and tested strictly on 2013 to 2017. The model scored an **ROC-AUC of 0.892**, proving it works on genuinely new years.

---

### 4.4 Mandi Price Forecasting: Random Forest Regressor with WPI Inflation

**How it works:**  
Commodity prices in mandis fluctuate heavily throughout the year. Our model uses a Random Forest Regressor trained on 19.4 MB of historical APMC market data covering 30 commodities across 34 Indian states.

**Key Design Decisions:**
1. **Inflation Adjustment (WPI):** A quintal of wheat sold for Rs 300 twenty years ago and sells for Rs 2,200 today. If raw historical rupee values are used, the model gets confused by inflation. We normalized historical prices using the official Wholesale Price Index (WPI).
2. **Lag Features:** The model uses the previous month's price (`Price_t-1`) along with current month and seasonal weather variables to predict the next 30 days of market prices.
3. **Accuracy:** Achieved a Mean Absolute Percentage Error (MAPE) of **8.35%**, outperforming standard moving average baselines.

---

## 5. Implementation & Integration (Rubric Criterion 4 — 3 Marks)

### 5.1 Verified API Endpoints

All backend endpoints are built using FastAPI and tested on `http://localhost:8000`:

| Method | Endpoint Path | What it Receives | What it Returns | Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Server status and uptime | Working (200 OK) |
| `GET` | `/api/states` | None | List of 34 supported Indian states | Working (200 OK) |
| `GET` | `/api/state-profile/{state}` | State name | Average regional soil and rainfall values | Working (200 OK) |
| `POST` | `/api/predict_crop` | Soil N, P, K, pH, Temp, Rain | Top 3 recommended crops with confidence % | Working (200 OK) |
| `POST` | `/api/detect_disease` | Leaf image (base64) | Disease name, organic and chemical remedies | Working (200 OK) |
| `POST` | `/api/predict_risk` | State, district, crop, season, year | Risk score (0 to 100), alert level, advice | Working (200 OK) |
| `POST` | `/api/forecast_price` | Crop name, state, district | 30-day daily price forecast array | Working (200 OK) |
| `POST` | `/api/historical_prices` | Crop name, state, district | Past price trends for chart plotting | Working (200 OK) |
| `POST` | `/api/expert-chat` | Farmer question | AI agricultural advisory response | Working (200 OK) |
| `POST` | `/api/send-sms-otp` | Mobile number | 6-digit login OTP via Fast2SMS | Working (200 OK) |

### 5.2 How Frontend and Backend Communicate

1. **User Action:** The farmer enters their soil values or clicks "Auto-fill State Averages" on the React page.
2. **API Request:** The React app sends a JSON POST request to `http://localhost:8000/api/predict_crop`.
3. **Pydantic Validation:** FastAPI checks that all numbers (N, P, K, pH, rainfall) are valid numbers within realistic limits.
4. **Model Execution:** The preloaded Random Forest model runs in memory in under 45 milliseconds.
5. **JSON Response:** The backend returns the recommended crop, confidence percentage, alternative crops, and advisory tips.
6. **Display:** The React UI renders the results in an easy-to-read card with color-coded confidence bars.

---

## 6. Experimental Results & Performance Summary

### 6.1 Model Results Summary Table

| Module | Model Used | Dataset Size | Primary Metric | Inference Speed |
| :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | Random Forest (100 trees) | 2,200 rows, 22 crop classes | **99.3% Accuracy** | ~42 ms (CPU) |
| **Disease Detection** | MobileNetV2 (ONNX format) | 54,303 images, 38 classes | **96.8% Top-1 Accuracy** | ~112 ms (CPU) |
| **Crop Failure Risk** | Regularized XGBoost | 325,418 rows (230k train, 95k test) | **0.892 ROC-AUC** | ~36 ms (CPU) |
| **Mandi Price Forecast** | Random Forest Regressor + WPI | 19.4 MB APMC mandi records | **8.35% MAPE** | ~260 ms (CPU) |

### 6.2 System Performance
- **Server Memory Usage:** ~820 MB RAM with all 4 models pre-loaded in memory.
- **Frontend Build:** Built cleanly with Vite into static assets (no errors, 2,814 modules transformed).
- **Average End-to-End Latency:** 180 to 250 milliseconds from button click to UI update on local testing.

---

## 7. Individual Contribution Details (For Individual Viva Marks)

In our laboratory evaluation, each member worked on specific parts of the project:

### Student 1: [Your Name] — Lead ML Engineer
- **Responsibilities:**
  - Collected and cleaned the 2,200-row ICAR soil dataset and the 325,000-row ICRISAT climate-yield dataset.
  - Implemented the Random Forest crop recommendation model, tuned tree depth and estimators, and added top-3 probability output.
  - Designed the strict temporal train-test split (pre-2013 vs post-2013) to prevent data leakage in the crop risk model.
  - Trained and tuned the regularized XGBoost risk classifier.
- **Viva Preparation:** Ready to explain Gini Impurity, why temporal splitting was necessary, and how XGBoost hyperparameters control overfitting.

### Student 2: [Teammate 2 Name] — Computer Vision Engineer
- **Responsibilities:**
  - Prepared and augmented the 54,000-image PlantVillage dataset (handling 38 classes across 14 crops).
  - Fine-tuned MobileNetV2 with transfer learning and dropout layers.
  - Exported the model graph to ONNX format so it runs quickly on standard CPUs without GPU hardware.
  - Created the treatment database (`treatment_db.json`) linking each disease to organic and chemical remedies.
- **Viva Preparation:** Ready to explain Depthwise Separable Convolutions, the difference between standard CNNs and MobileNetV2, and why ONNX was used.

### Student 3: [Teammate 3 Name] — Full-Stack & Integration Engineer
- **Responsibilities:**
  - Developed the asynchronous FastAPI backend in `backend/main.py` with Pydantic request models.
  - Built the React user interface with Vite and Tailwind CSS across 20 modular pages.
  - Implemented the state profile auto-fill feature and dynamic charts for price trends.
  - Configured CORS, environment variable security, and Docker containerization.
- **Viva Preparation:** Ready to explain the REST API structure, Pydantic data validation, how frontend communicates with FastAPI, and Docker setup.

---

## 8. Common Viva Questions & Model Answers

**Q1: Why did you use Random Forest instead of a Deep Neural Network for crop recommendation?**  
*Answer:* Agricultural soil and weather data is tabular and contains clear threshold conditions (for instance, certain crops strictly need high rainfall). Neural networks require large amounts of data, heavy hyperparameter tuning, and careful normalization to perform well on tabular tables. Random Forest handles non-linear tabular data naturally, does not overfit easily, trains in seconds, and provides clean probability scores for top-3 rankings.

**Q2: What is Depthwise Separable Convolution and why is it important in your project?**  
*Answer:* In standard convolutions, spatial filtering and channel combinations happen together in one heavy step. In MobileNetV2, it is broken into two steps: depthwise convolution (filtering one channel at a time) and pointwise convolution (mixing channels with a 1x1 filter). This reduces calculations by about 8 to 9 times, allowing our plant disease model to run on a regular CPU in just 112 milliseconds without needing a GPU.

**Q3: What is "Temporal Data Leakage" in crop risk prediction?**  
*Answer:* If you randomly split weather data across years, data from the same drought year (like 2015) will end up in both training and testing sets. The model then simply memorizes that year's bad rainfall instead of learning real patterns. We prevented this by training only on historical data up to 2012 and testing strictly on 2013 to 2017.

**Q4: How did you handle inflation in your crop price forecasting?**  
*Answer:* Crop prices from 10 or 20 years ago are naturally much lower due to general currency inflation, not because of farming supply and demand. We adjusted historical prices using the government's Wholesale Price Index (WPI) so past prices are directly comparable to today's rupee value.

---

## 9. Conclusion & Milestone 3 Roadmap

In Milestones 1 and 2, we completed the literature review, gathered authentic datasets, trained and evaluated all four machine learning models, and integrated them into a working full-stack web application.

**Planned Work for Milestone 3 (Final Phase):**
1. **Model Quantization:** Convert the ONNX model to INT8 precision to shrink file size from 16 MB to under 5 MB for fast mobile loading.
2. **IoT Integration:** Connect ESP32 soil sensor modules to stream real-time Nitrogen, Phosphorus, and Moisture values directly to the recommendation API.
3. **Regional Voice Advisory:** Add text-to-speech output in Hindi and regional languages for farmers who prefer listening over reading.
4. **Live Mandi API:** Connect to daily live APMC market data feeds.

---

## 10. References (IEEE Format)

1. J. G. A. Barbedo, "A review on the use of computer vision and artificial intelligence in plant disease recognition," *Information Processing in Agriculture*, vol. 7, no. 1, pp. 15–29, 2020.
2. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted residuals and linear bottlenecks," in *IEEE/CVF Conference on Computer Vision and Pattern Recognition (CVPR)*, 2018, pp. 4510–4520.
3. T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in *ACM SIGKDD Conference on Knowledge Discovery and Data Mining*, 2016, pp. 785–794.
4. Indian Council of Agricultural Research (ICAR), "District-wise Soil Fertility Status of Indian Soils," Ministry of Agriculture & Farmers Welfare, Govt. of India, 2023.
5. Ministry of Agriculture & Farmers Welfare, "Agmarknet — Agricultural Marketing Information Network Portal," Directorate of Marketing & Inspection, Govt. of India.
