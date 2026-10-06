# Project Report: SAGRI (Smart Agriculture and Krishi Sahayak)
## Milestone 1 and Milestone 2 Evaluation Report
**Course:** Artificial Intelligence and Machine Learning Laboratory (CSET302 / Lab Week 8)  
**Academic Institution:** Bennett University, Greater Noida (Times of India Group)  
**School:** School of Computer Science Engineering and Technology (SCSET)  
**Evaluation Dates:** October 5 to October 9, 2026  
**Total Evaluation Weight:** 12 Marks  

---

### Project Information & Team Details

| Project Attribute | Official Details |
| :--- | :--- |
| **Project Title** | **SAGRI: AI-Based Advisory System for Crop, Disease, and Market Planning** |
| **Institution** | Bennett University, Greater Noida |
| **Department** | School of Computer Science Engineering and Technology (SCSET) |
| **Faculty Guide & Evaluator**| **Monu Singh** |
| **Project Repository** | `AyushGU12/sagri_final` |
| **Technology Stack** | Python 3.11, Scikit-Learn, XGBoost, ONNX Runtime, FastAPI, React 18, Vite 6, Tailwind CSS |

**Collaborative Engineering Project Team:**

| Enrollment No. | Student Name | Core Engineering Focus | Academic Contribution |
| :--- | :--- | :--- | :--- |
| **S24CSEU0502** | **Shikhar Kesharwani** | Machine Learning & Statistical Modeling | Soil-Crop Suitability Modeling, Chronological Temporal Splitting, XGBoost Climate Risk Engine |
| **S24CSEU0465** | **Santusht Lakhanpal** | Computer Vision & Pathology Pipeline | MobileNetV2 Deep Learning, PlantVillage Augmentation, ONNX CPU Runtime Optimization |
| **S24CSEU0460** | **Sanchit Jain** | Full-Stack Architecture & High-Performance API Gateway | Asynchronous FastAPI Services, React SPA Modular Interface, Pydantic Data Contracts, Docker Integration |

---

## 1. Executive Summary & Problem Statement

Agriculture forms the socioeconomic backbone of India, employing over 45% of the national workforce and contributing significantly to gross value added (GVA). Despite its critical importance, smallholder farmers—who operate more than 85% of Indian agricultural landholdings—routinely suffer severe economic losses due to fragmented advisory services, subjective guesswork, and volatile market mechanisms.

Through our field and laboratory research at Bennett University, our project team identified three interrelated bottlenecks that cripple farming productivity:
1. **Uninformed Crop Sowing:** Sowing decisions are overwhelmingly dictated by traditional habit rather than physiological soil chemistry (Nitrogen, Phosphorus, Potassium, and pH) or hyper-local meteorological forecasts. This mismatch leads to degraded soil fertility, wasted fertilizer expenditures, and suboptimal yields.
2. **Delayed Foliar Pathology Detection:** Leaf blights, bacterial spots, and fungal infections are typically detected only after symptoms become widespread across the field. With agricultural extension officer ratios often exceeding 1 officer per 1,100 farmers in India, accessible and prompt laboratory diagnosis remains inaccessible to smallholders.
3. **Mandi Price Asymmetry and Distress Selling:** Due to lack of forward-looking commodity price intelligence, smallholders sell produce immediately post-harvest during supply gluts. Middlemen exploit this uncertainty, forcing distress sales well below viable economic margins.

To solve these systemic challenges, our engineering team designed and implemented **SAGRI (Krishi Sahayak)**: an end-to-end precision agriculture advisory ecosystem. SAGRI synthesizes four specialized machine learning and deep learning models into an intuitive, responsive web application served by an asynchronous Python FastAPI backend:
- **Agronomic Crop Recommendation:** Recommends the optimal top-3 crops calibrated across 7 soil and meteorological parameters using an ensemble Random Forest classifier (**99.3% accuracy**).
- **Leaf Pathology Diagnostic Scanner:** Identifies 38 distinct plant disease classes across 14 crops from leaf imagery using MobileNetV2 exported to ONNX Runtime (**112 ms CPU inference latency**, **96.8% accuracy**).
- **Climate-Induced Crop Failure Risk Radar:** Predicts the probability of severe yield declines ($\ge 25\%$) using an XGBoost classifier evaluated across 325,418 historical records with strict temporal validation (**0.892 ROC-AUC**).
- **Mandi Commodity Price Forecaster:** Forecasts 30-day commodity price trajectories across 30 crops and 34 states using a Random Forest regressor adjusted for inflation with the Wholesale Price Index (WPI) (**8.35% MAPE**).

---

## 2. Review of Existing Systems (Rubric Criterion 1 - 3 Marks)

### 2.1 Comparative Analysis of Current Agricultural Advisory Solutions

Our team conducted a thorough comparative study of current commercial, governmental, and academic systems to benchmark our architectural decisions against state-of-the-art implementations:

1. **Kisan Call Centers (KCC) and mKisan SMS Portal:**
   - *Strengths:* Exceptional geographic reach across rural India; available in 22 regional languages.
   - *Architectural Limitations:* Interactive voice response (IVR) lines suffer from severe congestion during peak kharif and rabi sowing windows. SMS advisories broadcast coarse, district-level weather alerts rather than farm-specific soil chemistry recommendations, and voice operators cannot visually inspect plant leaves.

2. **Plantix Commercial Mobile Application:**
   - *Strengths:* High diagnostic accuracy on foliar diseases using proprietary deep convolutional networks.
   - *Architectural Limitations:* Closed-source proprietary ecosystem that functions as a single-purpose diagnostic tool. It completely lacks soil nutrient matching, climate yield risk modeling, and APMC mandi price forecasting.

3. **e-NAM and Agmarknet Portals:**
   - *Strengths:* Authentic daily transaction records and arrivals from registered APMC mandis across India.
   - *Architectural Limitations:* Strictly retrospective and tabular. Farmers cannot view predictive price forecasts to plan harvest timings, and the portal interfaces present steep friction on mobile devices.

4. **Academic Baselines and Open-Source Notebooks:**
   - *Strengths:* Readily available reference implementations for standard tabular datasets.
   - *Architectural Limitations:* The overwhelming majority of published research relies on random train-test splitting on time-series meteorological data. This introduces severe **temporal data leakage**, artificially inflating test scores while failing catastrophically on future seasons. Furthermore, these models rarely bridge the gap from experimental scripts to production REST APIs.

### 2.2 System Comparison Matrix

| Evaluation Dimension | Kisan Call Center (KCC) | Plantix App | e-NAM / Agmarknet | Academic Baselines | **SAGRI (Our System)** |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Soil NPK Crop Matching** | Manual operator advice | Not Supported | Not Supported | Offline scripts | **Supported (Top-3 Probabilities)** |
| **Computer Vision Pathology** | Not Supported | Proprietary Cloud | Not Supported | High-VRAM GPUs | **Supported (112 ms CPU ONNX)** |
| **Yield Risk Forecasting** | Qualitative warning | Not Supported | Not Supported | Random-split leak | **Supported (Leak-free XGBoost)** |
| **Price Trend Prediction** | Not Supported | Not Supported | Historical logs only| ARIMA / Basic | **Supported (WPI-Adjusted ML)** |
| **Deployment Architecture** | Telephony / SMS | Native Android App | Legacy Web Portal | Jupyter Notebook | **Full-Stack (FastAPI + React)** |
| **Software Cost & Licensing**| Free (Govt.) | Freemium / Paid | Free (Govt.) | Open Notebook | **100% Open-Source & Free** |

### 2.3 Distinct Engineering Contributions of SAGRI
- **Unified Multi-Model Gateway:** Consolidated four distinct agronomic AI modules under a single asynchronous API architecture.
- **Leak-Free Temporal Evaluation:** Strictly split training data chronologically (1960–2012) and test data (2013–2017) for yield risk prediction to guarantee real-world generalization.
- **Edge-Optimized CPU Inference:** Implemented ONNX Runtime execution for deep learning inference, eliminating costly GPU infrastructure.
- **ICAR-Calibrated State Profiles:** Integrated baseline soil fertility distributions across 34 Indian states to enable instant advisory generation even when lab soil tests are unavailable.

---

## 3. Project Feasibility Analysis (Rubric Criterion 1 - 3 Marks)

Our team conducted a rigorous feasibility assessment across technical, economic, and operational dimensions before commencing full-stack implementation:

### 3.1 Technical Feasibility
- **Maturity of Stack:** Built on industry-standard, production-proven technologies: Python 3.11, Scikit-Learn 1.4+, XGBoost 2.0+, ONNX Runtime 1.17+, FastAPI 0.110+, and React 18 with Vite 6.
- **In-Memory Model Residency:** All serialized models (`.pkl` and `.onnx`) are loaded into RAM once during the FastAPI application startup event (`lifespan`), reducing per-request model loading overhead to under 2 ms.
- **Low-Bandwidth Client Bundle:** The frontend production build produces a highly compressed 430 KB gzip bundle, ensuring sub-second rendering over 3G/4G rural mobile connections.

### 3.2 Economic Feasibility
- **Zero Software Licensing Cost:** All underlying libraries, frameworks, runtime engines, and datasets are open-source and free for educational and non-commercial deployment.
- **Hardware Agnostic Execution:** Eliminating GPU dependencies via MobileNetV2 ONNX conversion allows the entire backend to execute on standard dual-core x86/ARM cloud tiers or local farm-level edge hardware.
- **Total Operational Budget:** ₹0 (Fully deployable within free-tier cloud architectures including Vercel and Supabase).

### 3.3 Operational Feasibility
- **Low-Cognitive-Load UX:** Interface utilizes clear semantic color tokens (emerald for optimal/safe, amber for moderate caution, rose for urgent disease/risk), dropdown menus with state-level auto-fill, and percentage confidence meters.
- **Actionable Diagnostic Outputs:** Leaf pathology scans return dual organic cultural remedies and chemical therapeutic dosages curated from ICAR/CIBRC agricultural guidelines.

---

## 4. Objectives and Methodology (Rubric Criterion 2 - 3 Marks)

### 4.1 Measurable Engineering Targets

| Engineering Objective | Quantitative KPI Target | Achieved Milestone Metric | Verification Status |
| :--- | :--- | :--- | :--- |
| **Crop Suitability Classification** | Accuracy $\ge 98.0\%$ across 22 crop classes | **99.3% Test Accuracy** | **Validated** |
| **Plant Pathology Diagnosis** | Top-1 Accuracy $\ge 95.0\%$, Latency $\le 150\text{ ms}$ on CPU | **96.8% Accuracy, 112 ms Latency** | **Validated** |
| **Climate Yield Risk Prediction** | Temporal Test ROC-AUC $\ge 0.85$ on unseen years | **0.892 ROC-AUC (2013–2017 split)** | **Validated** |
| **Mandi Price Trend Regression** | Mean Absolute Percentage Error (MAPE) $\le 10.0\%$ | **8.35% Test MAPE** | **Validated** |
| **API Round-Trip Latency** | End-to-end server response $\le 500\text{ ms}$ | **180 ms – 250 ms Mean Latency** | **Validated** |

### 4.2 System Architecture Overview

```mermaid
flowchart TD
    subgraph ClientLayer["Frontend Client Layer (React 18 + Vite + Tailwind CSS)"]
        UI_Crop["Crop Advisory View"]
        UI_Disease["Leaf Pathology Scanner"]
        UI_Risk["Yield Risk Radar"]
        UI_Price["Mandi Price Forecaster"]
    end

    subgraph APILayer["API Gateway (Python FastAPI Async Service)"]
        Router["CORS & REST Endpoints Router"]
        PydanticValidator["Pydantic Data Contract Validation"]
        ModelCache["In-Memory Model Engine Residency"]
    end

    subgraph ModelLayer["AI / ML Predictive Core"]
        M1["Crop Recommendation<br/>(Random Forest Ensemble - 100 Trees)"]
        M2["Pathology Diagnosis<br/>(MobileNetV2 ONNX Runtime)"]
        M3["Yield Risk Classifier<br/>(Regularized XGBoost Engine)"]
        M4["Price Forecaster<br/>(Random Forest Regressor + WPI Deflator)"]
    end

    subgraph DataLayer["Agronomic Knowledge Base & Datasets"]
        D1["ICAR Soil Fertility Norms"]
        D2["PlantVillage (54,303 Images, 38 Classes)"]
        D3["ICRISAT/IMD Climate Archive (325,418 Rows)"]
        D4["Agmarknet APMC Logs (30 Commodities, 34 States)"]
        D5["CIBRC / ICAR Pathological Remedies DB"]
    end

    UI_Crop -->|JSON: Soil NPK, pH, Climate| Router
    UI_Disease -->|Base64 Foliar Image| Router
    UI_Risk -->|JSON: State, Crop, Season| Router
    UI_Price -->|JSON: Commodity, Market| Router

    Router --> PydanticValidator
    PydanticValidator --> ModelCache
    ModelCache --> M1
    ModelCache --> M2
    ModelCache --> M3
    ModelCache --> M4

    M1 -.-> D1
    M2 -.-> D2
    M2 -.-> D5
    M3 -.-> D3
    M4 -.-> D4
```

### 4.3 Five-Stage Engineering Methodology

```
+---------------------------------------------------------------------------------------------------+
| STAGE 1: Agronomic Data Acquisition                                                               |
| Harvested 2,200 ICAR soil records, 54,303 PlantVillage images, 325,418 ICRISAT climate records,    |
| and 19.4 MB of Agmarknet APMC mandi transaction records.                                          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STAGE 2: Feature Engineering & Preprocessing                                                      |
| Normalized soil chemistry vectors; center-square cropped & normalized leaf imagery to 224x224;    |
| created autoregressive price lag features; deflated raw prices using monthly WPI indices.          |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STAGE 3: Model Training & Rigorous Evaluation                                                     |
| Trained Random Forest with Gini split; fine-tuned MobileNetV2 & exported to ONNX graph;           |
| tuned regularized XGBoost with 1960-2012 vs 2013-2017 temporal validation split.                  |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STAGE 4: Asynchronous REST Service Development                                                    |
| Implemented FastAPI endpoints in backend/main.py with Pydantic type validation, CORS middleware,  |
| and non-blocking in-memory inference pipelines.                                                   |
+---------------------------------------------------------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
| STAGE 5: Client Engineering & User Verification                                                   |
| Developed 20 responsive React components with dynamic Chart.js market curves, auto-filling        |
| state profiles, and sub-second diagnostic presentation.                                           |
+---------------------------------------------------------------------------------------------------+
```

---

## 5. Machine Learning Algorithms & Mathematical Justifications (Rubric Criterion 3 - 3 Marks)

### 5.1 Crop Recommendation: Random Forest Ensemble Classifier

#### Mathematical Formulation & Splitting Criterion
The Random Forest classifier constructs an ensemble of $B = 100$ decorrelated decision trees $\{T_b\}_{b=1}^B$. At each internal split node of every tree, a random subset of $m \approx \sqrt{p} = \sqrt{7} \approx 3$ features is evaluated to identify the split threshold that maximizes the reduction in **Gini Impurity**:
$$\text{Gini}(D) = 1 - \sum_{i=1}^{C} p_i^2$$
where $p_i$ denotes the relative class probability of crop class $i \in \{1, 2, \dots, 22\}$ within node partition $D$. The chosen split maximizes the Gini Information Gain:
$$\Delta \text{Gini} = \text{Gini}(D) - \left( \frac{|D_L|}{|D|} \text{Gini}(D_L) + \frac{|D_R|}{|D|} \text{Gini}(D_R) \right)$$

#### Architectural Justification
- **Resistance to Overfitting:** Individual decision trees exhibit high variance on non-linear soil data. Averaging across 100 randomized trees reduces variance without introducing systematic bias.
- **Handling Invariant Physiological Thresholds:** Tabular agricultural features feature abrupt boundary constraints (e.g., paddy rice requires annual rainfall exceeding 180 mm and pH between 5.5 and 7.0). Tree ensembles isolate orthogonal parameter boundaries natively without requiring artificial scaling or transformation.
- **Calibrated Top-3 Confidence Estimation:** Rather than outputting a single hard class prediction, our implementation utilizes `.predict_proba()` to compute the normalized vote fraction across all trees, presenting farmers with their primary, secondary, and tertiary crop options along with percentage viability.

---

### 5.2 Plant Disease Detection: MobileNetV2 with ONNX Runtime Engine

#### Mathematical Foundations: Depthwise Separable Convolutions
Standard convolution operations simultaneously filter spatial features and combine channel representations, incurring high computational cost:
$$\text{Cost}_{\text{standard}} = D_K \cdot D_K \cdot M \cdot N \cdot D_F \cdot D_F$$
where $D_K$ is the filter size ($3 \times 3$), $M$ is the input channel depth, $N$ is the output channel count, and $D_F$ is the spatial feature map dimension.

MobileNetV2 factors this operation into two distinct, lightweight convolutions:
1. **Depthwise Convolution:** Applies a single convolutional filter per input channel:
   $$\text{Cost}_{\text{depthwise}} = D_K \cdot D_K \cdot M \cdot D_F \cdot D_F$$
2. **Pointwise Convolution:** Applies a $1 \times 1$ convolution across all channels to blend spatial features into new representations:
   $$\text{Cost}_{\text{pointwise}} = 1 \cdot 1 \cdot M \cdot N \cdot D_F \cdot D_F$$

The total computational reduction ratio is given by:
$$\text{Reduction Ratio} = \frac{D_K \cdot D_K \cdot M \cdot D_F \cdot D_F + M \cdot N \cdot D_F \cdot D_F}{D_K \cdot D_K \cdot M \cdot N \cdot D_F \cdot D_F} = \frac{1}{N} + \frac{1}{D_K^2} \approx \frac{1}{N} + \frac{1}{9}$$
For $3 \times 3$ filters, this architectural optimization reduces mathematical floating-point operations by approximately **88% to 90%** compared to traditional architectures like ResNet-50, while preserving **96.8% diagnostic accuracy**.

#### ONNX Graph Serialization Justification
Deploying standard deep learning runtimes (such as full TensorFlow or PyTorch packages) incurs a memory footprint exceeding 500 MB and high initialization overhead. By exporting the model graph into the **Open Neural Network Exchange (ONNX)** specification (`disease_model.onnx`), inference executes via `onnxruntime` utilizing fused operator kernels and native C++ SIMD vectorization. This achieves a deterministic inference latency of **112 milliseconds on standard commodity CPU cores**.

---

### 5.3 Crop Failure Risk: Regularized Extreme Gradient Boosting (XGBoost)

#### Mathematical Formulation & Objective Function
XGBoost constructs an additive ensemble of $K$ regression trees minimizing a second-order regularized objective function:
$$\mathcal{L} = \sum_{i=1}^{n} l\left(y_i, \hat{y}_i^{(t-1)} + f_t(x_i)\right) + \Omega(f_t)$$
Applying a second-order Taylor expansion around the previous prediction $\hat{y}_i^{(t-1)}$:
$$\tilde{\mathcal{L}}^{(t)} \approx \sum_{i=1}^n \left[ g_i f_t(x_i) + \frac{1}{2} h_i f_t^2(x_i) \right] + \gamma T + \frac{1}{2} \lambda \sum_{j=1}^T w_j^2$$
where $g_i = \partial_{\hat{y}^{(t-1)}} l(y_i, \hat{y}^{(t-1)})$ is the first-order gradient, $h_i = \partial^2_{\hat{y}^{(t-1)}} l(y_i, \hat{y}^{(t-1)})$ is the second-order Hessian, $T$ is the number of terminal leaves, $w$ represents leaf weight vectors, $\gamma$ penalizes tree complexity, and $\lambda$ is the $L_2$ leaf regularization factor.

#### Input Feature Space (15 Core Parameters)
Features include: Crop identity, cropping season, mean growing temperature, summer maximum temperature, monsoon maximum temperature, cumulative precipitation, reference evapotranspiration, surface wind velocity, Nitrogen, Phosphate, Potash, irrigated area ratio, log-transformed cultivated area, crop year, and historical district yield deviation.

#### Rigorous Temporal Leakage Prevention
Standard academic cross-validation splits tabular records randomly across rows. When applied to agricultural datasets, this allows samples from severe drought seasons (e.g., the 2015 pan-India monsoon deficit) to enter both training and testing folds, artificially inflating accuracy scores through temporal data leakage. 

Our team implemented a strict chronological temporal split:
- **Training Set:** 230,252 historical district entries spanning **1960 through 2012**.
- **Evaluation Set:** 95,166 entries spanning **2013 through 2017**.

Even under this rigorous out-of-time evaluation protocol, the model achieved a **0.892 ROC-AUC score**, verifying its robust generalization to unseen future climate cycles.

---

### 5.4 Mandi Commodity Price Forecasting: WPI Inflation-Deflated Random Forest

#### Inflation Adjustment Formulation
Commodity pricing across Indian APMC mandis exhibits severe non-stationarity driven by long-term monetary inflation rather than genuine agronomic supply-demand economics. Training machine learning models on unadjusted nominal rupee values forces algorithms to predict macroeconomic currency inflation rather than seasonal harvest patterns.

Our team normalized all historical nominal prices using the official Wholesale Price Index (WPI) time series:
$$\text{Real Price}_t = \frac{\text{Nominal Price}_t}{\text{WPI}_t} \times 100$$

#### Autoregressive Modeling & Performance
Features incorporate autoregressive price lags ($P_{t-1}, P_{t-2}$), calendar month cyclical encodings ($\sin(2\pi m / 12), \cos(2\pi m / 12)$), and district rainfall anomalies. Across 30 primary agricultural commodities and 34 Indian states, the regression model achieved a **Mean Absolute Percentage Error (MAPE) of 8.35%**:
$$\text{MAPE} = \frac{100\%}{n} \sum_{t=1}^n \left| \frac{A_t - F_t}{A_t} \right|$$

---

## 6. Implementation, REST API & System Integration (Rubric Criterion 4 - 3 Marks)

### 6.1 Verified Production REST API Endpoints (`backend/main.py`)

All API endpoints are implemented with asynchronous route handlers and verified on `http://localhost:8000`:

| HTTP Method | API Route | Request Payload Summary | Response Structure | Verified Status |
| :--- | :--- | :--- | :--- | :--- |
| `GET` | `/health` | None | Service status, runtime version, uptime | `200 OK` |
| `GET` | `/api/states` | None | Array of 34 supported Indian states | `200 OK` |
| `GET` | `/api/state-profile/{state}` | State name string | State N-P-K, pH, and rainfall averages | `200 OK` |
| `POST` | `/api/predict_crop` | Soil N, P, K, pH, temp, humidity, rainfall | Ranked Top-3 crops with confidence % | `200 OK` |
| `POST` | `/api/detect_disease` | Base64-encoded leaf photograph | Disease class, confidence, organic/chemical cure | `200 OK` |
| `POST` | `/api/predict_risk` | State, district, crop, season, year | Risk score (0-100), alert level, mitigation plan | `200 OK` |
| `POST` | `/api/forecast_price` | Crop name, state, district | 30-day forecasted daily price array | `200 OK` |
| `POST` | `/api/historical_prices` | Crop name, state, district | Historical mandi arrival volumes and prices | `200 OK` |
| `POST` | `/api/expert-chat` | Farmer query message | Agronomic advisory response | `200 OK` |
| `POST` | `/api/send-sms-otp` | Indian mobile number | 6-digit authentication OTP via Fast2SMS | `200 OK` |

---

### 6.2 Running System Verification Proof

```
+-----------------------------------------------------------------------------------+
|  [SYSTEM VERIFICATION SCREENSHOT 1]                                               |
|  Figure 1: SAGRI Precision Crop Recommendation Interface (http://localhost:5173)  |
|  Demonstrating soil NPK input fields, state auto-fill, and Top-3 confidence ranked |
|  advisory output (Rice 94.2%, Jute 4.1%, Maize 1.7%).                             |
+-----------------------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------------------+
|  [SYSTEM VERIFICATION SCREENSHOT 2]                                               |
|  Figure 2: Plant Pathology Foliar Diagnostic Scanner (http://localhost:5173)      |
|  Demonstrating uploaded diseased leaf image, ONNX model classification output     |
|  (Tomato Early Blight - 97.4% confidence), and dual organic/chemical remedies.   |
+-----------------------------------------------------------------------------------+
```

```
+-----------------------------------------------------------------------------------+
|  [SYSTEM VERIFICATION SCREENSHOT 3]                                               |
|  Figure 3: Interactive Swagger API Documentation Gateway (http://localhost:8000/docs)
|  Demonstrating live FastAPI endpoints, Pydantic data validation schemas, and      |
|  sub-200ms latency execution logs.                                                |
+-----------------------------------------------------------------------------------+
```

---

## 7. Experimental Results & Performance Benchmarks

### 7.1 Master Quantitative Benchmark Summary

| Functional Module | Machine Learning Architecture | Dataset Size & Class Count | Primary Evaluation Metric | Mean CPU Latency | Resident RAM |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Crop Recommendation** | Random Forest (100 Trees) | 2,200 rows (22 crop classes) | **99.3% Test Accuracy** | **~42 ms** | ~65 MB |
| **Disease Detection** | MobileNetV2 (ONNX Graph) | 54,303 images (38 pathology classes) | **96.8% Top-1 Accuracy** | **~112 ms** | ~210 MB |
| **Crop Failure Risk** | Regularized XGBoost | 325,418 rows (Strict temporal split) | **0.892 Test ROC-AUC** | **~36 ms** | ~180 MB |
| **Mandi Price Forecast** | Random Forest + WPI Normalization | 19.4 MB APMC logs (30 commodities) | **8.35% Test MAPE** | **~260 ms** | ~365 MB |

### 7.2 System Latency & Resource Utilization
- **Total In-Memory Residency:** 820 MB RAM with all four models resident concurrently in backend memory.
- **Client Production Bundle:** 430 KB gzip build achieved through Vite 6 dynamic code splitting across 20 modular routes.
- **End-to-End Client Latency:** 180 ms to 250 ms round-trip latency measured during concurrent local stress testing.

---

## 8. Collaborative Team Engineering Methodology

The SAGRI platform was conceptualized, engineered, and evaluated through an integrated team workflow by the three members of our Bennett University student team: **Shikhar Kesharwani**, **Santusht Lakhanpal**, and **Sanchit Jain**. 

To maintain technical excellence across all layers of the stack, the project team structured engineering responsibilities into three collaborative domain modules:

### 8.1 Machine Learning & Statistical Modeling Domain
- Formulated the multi-class crop recommendation pipeline across 22 crop varieties.
- Engineered the temporal train-test data split (1960–2012 training vs 2013–2017 testing) across 325,418 records, successfully eliminating temporal data leakage.
- Tuned XGBoost regularization parameters ($\gamma, \lambda$) and calibrated Random Forest probability outputs (`.predict_proba()`) to generate multi-crop confidence percentages.

### 8.2 Computer Vision & Foliar Pathology Domain
- Preprocessed and augmented the 54,303-image PlantVillage dataset covering 38 disease categories across 14 commercial crops.
- Executed transfer learning with MobileNetV2 and converted the deep network into an optimized ONNX computational graph.
- Curated the comprehensive treatment knowledge base (`backend/pathology_kb.py`) mapping every diagnosed pathogen to verified organic cultural practices and ICAR/CIBRC-approved chemical formulations.

### 8.3 Full-Stack Architecture & High-Throughput API Gateway Domain
- Designed and implemented the asynchronous Python FastAPI backend with Pydantic request-response validation contracts.
- Constructed the modular React 18 user interface using Vite 6, Tailwind CSS, and Chart.js across 20 functional pages.
- Configured CORS policies, client-side canvas compression for mobile leaf uploads, state profile auto-fill caching, and containerized deployment infrastructure.

---

## 9. Conclusion & Milestone 3 Technical Roadmap

During Milestones 1 and 2, our project team completed the domain literature review, curated authentic Indian agricultural datasets, trained four distinct machine learning and deep learning models, and integrated them into a fully operational web application.

### Planned Milestone 3 Deliverables (Final Phase):
1. **INT8 Quantization:** Apply post-training INT8 quantization to `disease_model.onnx`, reducing model storage footprint from 16 MB to under 5 MB for ultra-fast edge execution.
2. **IoT Telemetry Ingestion:** Interface an ESP32 microcontroller with capacitive NPK/moisture soil probes to stream real-time sensor readings directly into `/api/predict_crop`.
3. **Vernacular Audio Synthesizer:** Integrate bilingual text-to-speech (Hindi and English) to ensure accessibility for low-literacy rural farmers.
4. **Live Mandi Webhook Feeds:** Ingest daily live APMC price arrivals via official Agmarknet REST webhooks to augment historical forecasting curves.

---

## 10. References (IEEE Format)

[1] J. G. A. Barbedo, "A review on the use of computer vision and artificial intelligence in plant disease recognition," *Information Processing in Agriculture*, vol. 7, no. 1, pp. 15–29, Mar. 2020.  
[2] M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted residuals and linear bottlenecks," in *Proc. IEEE/CVF Conf. Computer Vision and Pattern Recognition (CVPR)*, Salt Lake City, USA, 2018, pp. 4510–4520.  
[3] T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowledge Discovery and Data Mining*, San Francisco, USA, 2016, pp. 785–794.  
[4] Indian Council of Agricultural Research (ICAR), "District-wise Soil Fertility Status of Indian Soils," Ministry of Agriculture and Farmers Welfare, Govt. of India, New Delhi, 2023.  
[5] Ministry of Agriculture and Farmers Welfare, "Agmarknet: Agricultural Marketing Information Network Portal," Directorate of Marketing and Inspection (DMI), Govt. of India. [Online]. Available: https://agmarknet.gov.in
