# Project Report: SAGRI (Smart Agriculture and Krishi Sahayak)
## Milestone 1 and Milestone 2 Evaluation Report
Course: Artificial Intelligence and Machine Learning Laboratory (Lab Week 8)  
Evaluation Period: October 5 to October 9, 2026  
Total Evaluation Weight: 12 Marks  

---

### Project Information

| Field | Details |
| :--- | :--- |
| **Project Name** | SAGRI: AI-Based Advisory System for Crop, Disease, and Market Planning |
| **Institution** | Bennett University, Greater Noida |
| **School / Department** | School of Computer Science Engineering and Technology (SCSET) |
| **Faculty Guide / Evaluator** | Monu Singh |

**Student Team Members and Individual Project Roles:**

| Enrollment No. | Student Name | Assigned Project Area | Viva Defense Topic |
| :--- | :--- | :--- | :--- |
| **S24CSEU0502** | **Shikhar Kesharwani** | ML Model Development (Lead) | Crop Recommendation (Random Forest), Crop Failure Risk (XGBoost), Data Cleaning, Time-Series Train-Test Split |
| **S24CSEU0465** | **Santusht Lakhanpal** | Computer Vision and Deep Learning | MobileNetV2 Disease Detection, PlantVillage Preprocessing, ONNX CPU Model Export |
| **S24CSEU0460** | **Sanchit Jain** | Full-Stack and API Integration | FastAPI REST Backend, React Web UI, Supabase Database, Docker Setup |

---

## 1. Project Summary and Problem Statement

When we looked at how most small farmers in India plan their crops, we noticed that they still rely on traditional rules of thumb. Unfortunately, with erratic monsoon seasons, changing weather patterns, and fluctuating mandi prices, traditional guesswork often leads to severe crop or financial loss.

Farmers typically struggle with three major problems:
1. They pick crops without checking if their soil chemistry (Nitrogen, Phosphorus, Potassium, and pH) or local rainfall actually suit that crop.
2. When leaf diseases strike, they often notice only after the infection has spread. Agricultural officers cannot visit every remote farm quickly.
3. When selling their produce, farmers have no easy way of knowing future mandi prices, so they end up selling early to local middlemen at unfavorable rates.

To address these three problems together, our team built SAGRI (Krishi Sahayak). We designed it as a single full-stack web application with four machine learning models running behind a Python FastAPI server.

Our four modules are:
- **Crop Recommendation:** Suggests the best crops for a farmer's plot based on 7 soil and climate inputs. Runs on a Random Forest classifier that achieved 99.3% accuracy across 22 crops.
- **Leaf Disease Detection:** Farmers can snap or upload a photo of a sick plant leaf. The model identifies the disease from 38 possible categories and suggests immediate treatment steps. We used MobileNetV2 and converted it to ONNX format so it runs on a standard CPU in 112 milliseconds.
- **Crop Failure Risk Estimation:** Warns farmers about the chance of a major yield drop (25% or worse) due to weather extremes. We trained an XGBoost model on over 230,000 historical district weather-crop records from 1960 to 2017.
- **Mandi Price Forecast:** Predicts 30-day market prices for 30 major commodities across 34 states. We adjusted historical price data against the Wholesale Price Index (WPI) so past inflation does not distort our forecasts.

The frontend is built with React and Vite. It is fast, clean, and works well on mobile screens.

---

## 2. Review of Existing Systems (Criterion 1 - 3 Marks)

### 2.1 What Existing Tools Offer and Where They Fall Short

During our literature review, we analyzed several government portals, mobile apps, and academic works:

1. **Kisan Call Center (Toll-Free 1800-180-1551) and mKisan SMS:**
   - *How it works:* Farmers call a toll-free number to speak with agricultural experts or receive general SMS broadcasts.
   - *Benefits:* Wide outreach across India and support for regional languages.
   - *Our critique:* Getting through on phone lines often takes a long time during peak season. The advice is general rather than personalized to a farmer's exact soil values. It cannot diagnose plant diseases from leaf photos.

2. **Plantix Mobile App:**
   - *How it works:* A smartphone app where users upload a leaf photo to diagnose plant diseases.
   - *Benefits:* Accurate visual disease recognition for popular crops.
   - *Our critique:* It is a closed, proprietary application. It only handles disease pictures. It does not provide soil nutrient advisory, crop planning, or market price forecasting.

3. **Agmarknet and e-NAM Portals:**
   - *How it works:* Government websites that list daily arrivals and mandi prices across agricultural markets in India.
   - *Benefits:* Trustworthy official trade records.
   - *Our critique:* The portals only display past and present tables. They do not predict where prices are heading in the coming month. Also, the interface is cumbersome to use on mobile devices for rural farmers.

4. **Academic Kaggle Notebooks:**
   - *How it works:* Python scripts published online demonstrating basic classifiers on small agricultural datasets.
   - *Benefits:* Good reference points for algorithm benchmarking.
   - *Our critique:* Nearly all published notebooks use random train-test splits on time-series climate data. This causes data leakage because future weather gets mixed into the training set. Furthermore, almost none of these projects are integrated into a working website with a backend API.

### 2.2 What Makes Our SAGRI Implementation Different

- **Unified Solution:** Farmers do not need three separate applications. Soil advice, disease scanning, climate risk, and market prices are all accessible in one place.
- **Zero Temporal Data Leakage:** In our risk prediction module, we strictly trained on records up to the year 2012, and tested on data from 2013 to 2017. This proves that our model works on genuinely unseen future agricultural seasons.
- **Fast CPU Performance:** By converting our deep learning model into ONNX format, we eliminated heavy TensorFlow dependencies on our server. Our model evaluates leaf images in about 110 milliseconds on normal CPU hardware.
- **State Soil Averages Auto-Fill:** If a farmer does not have a recent soil testing card, they simply pick their state, and SAGRI automatically populates the average soil N-P-K and rainfall values for that region.

---

## 3. Project Feasibility Analysis (Criterion 1 - 3 Marks)

Before writing any code, our team evaluated whether this project could be built and operated reliably:

1. **Technical Feasibility:**
   - We used Python 3.11 for model training and API serving.
   - FastAPI loads all four trained model files into server memory once during startup. Because the models stay in memory, each user request is answered in under 300 milliseconds.
   - For the frontend, Vite and React produce a compact bundle (about 430 KB compressed) that loads quickly even on slower 3G or 4G mobile connections.

2. **Economic Feasibility:**
   - All datasets we used are open and free: ICAR soil data, PlantVillage images, Agmarknet mandi archives, and ICRISAT/IMD climate records.
   - Software tools are completely open-source (Python, Scikit-Learn, XGBoost, ONNX Runtime, React).
   - Our staging deployment runs on free cloud services (Vercel for frontend hosting, Supabase for auth and database).
   - Total software and infrastructure cost incurred: zero rupees.

3. **Operational Feasibility:**
   - The user interface is designed with clear visual cards, color indicators (green for low risk, red for high risk), and simple dropdown menus.
   - Farmers do not need to understand machine learning algorithms to benefit from the advice.

---

## 4. Project Objectives and Work Methodology (Criterion 2 - 3 Marks)

### 4.1 Measurable Project Targets

1. **Crop Suitability:** Recommend top-3 compatible crops with at least 98% accuracy across 22 crop varieties.
2. **Plant Pathology:** Detect 38 disease categories from leaf photos with over 95% validation accuracy in under 150 milliseconds.
3. **Failure Risk Prediction:** Forecast high-risk yield losses (25% or worse) with an ROC-AUC score of at least 0.85 using historical climate records.
4. **Mandi Price Forecast:** Provide 30-day commodity price trends with a Mean Absolute Percentage Error (MAPE) below 10%.
5. **System Response Time:** Maintain end-to-end response time under 500 milliseconds across all API routes.

### 4.2 Step-by-Step Development Process

Our work was structured in five distinct steps:

- **Step 1: Dataset Collection and Verification**
  We collected 2,200 rows of soil nutrient records from ICAR publications, 54,303 leaf images from the PlantVillage project, 325,418 district weather-yield entries from ICRISAT/IMD, and 19.4 MB of historical mandi price records.

- **Step 2: Data Cleaning and Feature Engineering**
  We normalized numeric soil readings, applied rotations and flips to leaf images to prevent overfitting, adjusted mandi prices for inflation using monthly WPI figures, and split climate data chronologically (pre-2013 for training, post-2013 for testing).

- **Step 3: Model Training and Evaluation**
  We trained a Random Forest model for crop suggestions, fine-tuned MobileNetV2 and converted it to ONNX, tuned an XGBoost classifier for crop risk, and trained a Random Forest regressor with one-month lag features for price predictions.

- **Step 4: Backend API Development**
  We wrote REST endpoints in `backend/main.py` using FastAPI. We created Pydantic schemas to validate user inputs so invalid numbers or missing fields return clear error messages.

- **Step 5: Frontend Design and Testing**
  We developed React pages with responsive cards, integrated interactive charts for mandi price trends, and connected all forms to our FastAPI backend.

---

## 5. Algorithms Used and Justifications (Criterion 3 - 3 Marks)

### 5.1 Crop Recommendation: Random Forest Classifier

**How it operates:**  
Random Forest builds an ensemble of 100 decision trees. Each tree evaluates the farmer's 7 input values: Nitrogen, Phosphorus, Potassium, Temperature, Humidity, Soil pH, and Rainfall. Each tree votes for a crop, and the crop with the most votes is chosen.

**Node Splitting with Gini Impurity:**  
Decision trees split data by choosing the feature and threshold that minimizes Gini Impurity:  
`Gini = 1 - sum(p_i * p_i)`  
Here, `p_i` is the fraction of samples in that node belonging to crop `i`. If all samples belong to one crop, Gini is 0 (completely pure). If crops are mixed evenly, Gini is high. The algorithm chooses splits that reduce this impurity the fastest.

**Why we chose Random Forest:**
- A single Decision Tree has high variance and changes its answer drastically if rainfall changes slightly. By averaging 100 trees, Random Forest is stable and avoids overfitting.
- Agricultural data has sharp cut-off boundaries (for example, rice strictly requires annual rainfall above 180 mm). Decision trees handle these thresholds naturally.
- Random Forest provides probability scores through `.predict_proba()`, which lets our system show the farmer their top 3 recommended crops with percentage confidence.

---

### 5.2 Plant Disease Detection: MobileNetV2 with ONNX Runtime

**How it operates:**  
We used MobileNetV2, an efficient Convolutional Neural Network pretrained on ImageNet and fine-tuned on 54,303 leaf photos from the PlantVillage dataset across 38 classes (covering healthy leaves and infected leaves for 14 plant species).

**Why MobileNetV2 is fast (Depthwise Separable Convolutions):**  
Standard convolutions filter spatial patterns and mix color channels in a single heavy step. MobileNetV2 divides this into two simpler steps:
1. **Depthwise Convolution:** Applies a single 3x3 filter to each channel separately to capture spatial edges.
2. **Pointwise Convolution:** Applies a 1x1 filter across all channels to combine them into new features.

This two-step process cuts the total mathematical operations by roughly 8 to 9 times compared to standard networks like ResNet-50, with less than 1% difference in classification accuracy.

**Why we converted to ONNX:**  
Running TensorFlow or PyTorch directly on a web server consumes large amounts of RAM and requires huge Python libraries. By saving the trained model as `disease_model.onnx`, we run it using the lightweight `onnxruntime` package. It runs in 112 milliseconds on an ordinary laptop CPU.

---

### 5.3 Crop Failure Risk: XGBoost Classifier

**How it operates:**  
XGBoost (Extreme Gradient Boosting) builds decision trees sequentially. Instead of training trees independently like Random Forest, each new tree specifically corrects the residual errors of the previous trees.

**Inputs Used (15 features):**  
Crop type, season, mean temperature, summer maximum temperature, rainy season maximum temperature, total rainfall, evapotranspiration, wind speed, Nitrogen, Phosphate, Potash, irrigated area ratio, log of plot area, crop year, and historical yield deviation.

**Why we chose XGBoost:**
- Real-world government weather records sometimes have missing sensor readings. XGBoost automatically handles missing values by learning the best default branch during training.
- XGBoost includes regularization terms (Gamma and Lambda) that penalize overly complex trees, preventing the model from memorizing rare weather spikes.
- We used a strict temporal split: 230,252 records from 1960 to 2012 for training, and 95,166 records from 2013 to 2017 for testing. The model achieved an ROC-AUC of 0.892, proving it generalizes well to future weather.

---

### 5.4 Mandi Price Forecasting: Random Forest Regressor with Inflation Adjustment

**How it operates:**  
Mandi prices change due to seasons, festival demand, and inflation. Our model is trained on 19.4 MB of historical APMC market data covering 30 commodities across 34 states.

**Key Technical Decisions:**
1. **Inflation Adjustment via WPI:** A quintal of wheat cost Rs 300 twenty years ago and costs over Rs 2,200 today. If you train a model directly on old rupee figures, it learns currency inflation rather than farming economics. We normalized all historical prices using India's official Wholesale Price Index (WPI).
2. **Lag Features:** We gave the model the previous month's price (`Price_t-1`), current month, and weather variables to predict the next 30 days of prices.
3. **Accuracy:** Achieved a Mean Absolute Percentage Error (MAPE) of 8.35%, which is noticeably better than standard moving averages.

---

## 6. Implementation and System Integration (Criterion 4 - 3 Marks)

### 6.1 Verified API Endpoints (`backend/main.py`)

All endpoints were tested on `http://localhost:8000` and confirmed working:

| Method | Endpoint Route | What the Backend Receives | What the Backend Returns | Live Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Server status and uptime | 200 OK |
| `GET` | `/api/states` | None | List of 34 supported Indian states | 200 OK |
| `GET` | `/api/state-profile/{state}` | State name | Average regional soil and rainfall values | 200 OK |
| `POST` | `/api/predict_crop` | Soil N, P, K, pH, Temp, Rain | Top 3 recommended crops with confidence % | 200 OK |
| `POST` | `/api/detect_disease` | Base64 leaf image | Disease name, organic and chemical remedies | 200 OK |
| `POST` | `/api/predict_risk` | State, district, crop, season, year | Risk score (0 to 100), alert level, advice | 200 OK |
| `POST` | `/api/forecast_price` | Crop name, state, district | 30-day daily price forecast array | 200 OK |
| `POST` | `/api/historical_prices` | Crop name, state, district | Historical prices for trend charting | 200 OK |
| `POST` | `/api/expert-chat` | Farmer question text | AI agricultural advisory reply | 200 OK |
| `POST` | `/api/send-sms-otp` | Phone number | 6-digit login OTP via Fast2SMS | 200 OK |

### 6.2 Data Flow Between Frontend and Backend

1. **User Input:** The farmer selects their state and inputs their soil values on the web page (or clicks auto-fill).
2. **HTTP Request:** The React application sends a JSON POST request to `/api/predict_crop`.
3. **Input Validation:** FastAPI checks that all values are valid numbers within realistic agricultural ranges.
4. **Model Execution:** The preloaded Random Forest model runs in memory in about 42 milliseconds.
5. **Response:** FastAPI sends back a JSON response with the top recommended crop, confidence percentage, alternative crops, and farming tips.
6. **Interface Update:** The React page updates instantly, showing the recommendation with clear visual badges.

---

## 7. Experimental Results and Observations

### 7.1 Quantitative Model Benchmarks

| Module | Model Family | Dataset Size | Primary Score | CPU Inference Time |
| :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | Random Forest (100 trees) | 2,200 rows (22 crops) | **99.3% Accuracy** | ~42 ms |
| **Disease Detection** | MobileNetV2 (ONNX format) | 54,303 images (38 classes) | **96.8% Top-1 Accuracy** | ~112 ms |
| **Crop Failure Risk** | Regularized XGBoost | 325,418 rows (61 crops) | **0.892 ROC-AUC** | ~36 ms |
| **Mandi Price Forecast** | Random Forest Regressor + WPI | 19.4 MB APMC price records | **8.35% MAPE** | ~260 ms |

### 7.2 System Performance Observations
- **Memory Footprint:** About 820 MB RAM with all four models resident in memory.
- **Frontend Build:** Tested with Vite production build: 2,814 modules transformed in 32.6 seconds with zero compile errors.
- **End-to-End Latency:** Average round-trip time of 180 to 250 milliseconds during local testing.

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

In Milestones 1 and 2, we completed the review of existing systems, gathered authentic Indian agricultural datasets, trained four distinct machine learning models, and integrated them into a functional full-stack web application.

**Next Steps for Milestone 3 (Final Release):**
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
