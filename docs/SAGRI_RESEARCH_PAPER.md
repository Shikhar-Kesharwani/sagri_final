# SAGRI: An Agro-Climatic Constraint-Gated Multimodal Architecture for Smallholder Advisory and Mandi Gate Settlement

**Authors:** Shikhar Kesharwani, Santusht Lakhanpal, Sanchit Jain, Monu Singh  
**Institution:** Department of Computer Science and Engineering, Bennett University, Greater Noida, UP, India  
**Repository:** https://github.com/Shikhar-Kesharwani/sagri_final  

---

### Abstract
Smallholder farming in India faces three practical bottlenecks that existing digital agriculture software fails to solve together: foliar diseases spread undetected, statistical crop models recommend plants that cannot survive regional droughts, and farmers sell below market price because mandi settlement takes weeks. We built SAGRI to run the entire pipeline from diagnosis to payment in one system. Rather than letting a Random Forest model output raw statistical recommendations, our engine applies hard biological gates derived from ICAR agro-climatic boundaries. This cut invalid crop recommendations from 15.8% down to zero across our test records. For climate risk, instead of using uncalibrated probability or arbitrary fallbacks, we combined an XGBoost classifier with a five-variable physical crop-water shortfall equation. On 325,418 historical district records, this hybrid formula reached an ROC-AUC of 0.892. On the client side, the vision model runs quantized MobileNetV2 over ONNX Runtime in 112 ms on basic CPU hardware without GPU acceleration. We paired the models with an embedded payment split ledger simulating a 98% farmer / 2% market cess breakdown via UPI rails, issuing unique transaction references at the mandi gate. An embedded SQLite database with write-ahead logging guarantees local query execution under spotty 2G mobile connectivity.

---

### 1. Introduction
Over 86% of operational agricultural holdings in India measure under two hectares. Farmers working these parcels rarely interact with trained plant pathologists or agronomists. When foliar symptoms emerge, smallholders typically buy broad-spectrum agrochemicals based on recommendations from local retail pesticide dealers who lack formal diagnostic training. This habit drives unnecessary input expenditures and accelerates soil chemical degradation.

Supervised machine learning offers an inexpensive alternative, yet existing models deployed in research literature exhibit structural flaws when run on real field data:
1. **Agronomic hallucination in crop recommendation:** Classifiers trained on nutrient-climate tuples output mathematical best-fits without validating physiological limits. A standard Random Forest classifier frequently recommends paddy (*Oryza sativa*) for semi-arid regions such as western Rajasthan simply because soil NPK values match paddy requirements, ignoring the region's 350 mm rainfall ceiling and high evaporative demand.
2. **Probability manipulation in commercial apps:** Several consumer-facing agritech tools artificially rescale model confidence scores into the 90–99% bracket to reassure users. This practice removes probabilistic calibration, blinding farmers and field agents to cases where the model is genuinely uncertain.
3. **Isolation from market realities:** Diagnostic tools routinely end at classification. They do not connect to mandi pricing or payment settlement, leaving farmers vulnerable to local commission agents (*arhtiyas*) who delay payouts by 15 to 45 days.

To resolve these disconnects, we designed SAGRI (*Smart Agriculture Real-time Intelligence*):
* We place an **Agronomic Constraint Layer** directly behind the crop recommendation model. If a crop violates ICAR regional water minimums or thermal boundaries, its probability drops to zero before the ranking reaches the farmer.
* We replace heuristic risk estimates with a **Hybrid Risk Radar** that computes statistical failure odds through XGBoost ($w=0.65$) and physical shortfall through a deterministic crop-water deficit formula ($w=0.35$).
* We link price advisories directly to an **APMC settlement simulator** that calculates net payout after statutory market fees (98% farmer credit, 2% market cess) and generates immediate transaction records.
* We store farmer profiles, logs, and authentication states inside an **embedded SQLite database running Write-Ahead Logging (WAL)**, eliminating cloud latency and allowing full offline execution on basic field hardware.

---

### 2. Dataset Curation and Partitioning
| Dataset Source | Target Task | Sample Count | Evaluation Split |
| :--- | :--- | :--- | :--- |
| **PlantVillage** | Foliar Pathology | 54,305 Images | 80% Train / 20% Test |
| **ICAR Soil Survey** | Crop Recommendation | 2,200 Rows | 5-Fold Stratified CV |
| **ICRISAT + IMD + ERA5** | Failure Risk Radar | 325,418 Rows | 1966–2007 Train / 2008–2017 Test |
| **Agmarknet 25-Year** | Mandi Forecasting | 1.2M Records | Chronological 80/20 Holdout |

---

### 3. Experimental Results & Ablation Analysis

#### Model Performance Across Pipelines
| Pipeline Target | Evaluated Metric | Value |
| :--- | :--- | :--- |
| **Disease Vision (ONNX)** | Top-1 Field Accuracy | 73.4% |
| **Disease Vision (ONNX)** | Single-Core CPU Latency | 112 ms |
| **Disease Vision (ONNX)** | Model Storage Size | 16.2 MB |
| **Crop Recommendation** | 22-Crop Test Accuracy | 99.3% |
| **Risk Radar (Hybrid)** | Out-of-Time ROC-AUC | 0.892 |
| **Mandi Forecasting** | 30-Day Mean Abs. Error | 8.35% |
| **Backend API (FastAPI)** | P50 Response Time | 48 ms |
| **SQLite WAL Storage** | Write Transaction Speed | 1,840 tx/s |

#### Comparative Baseline Evaluation
| Task Domain | Model Architecture | Accuracy / AUC | CPU Latency | Storage Size |
| :--- | :--- | :--- | :--- | :--- |
| **Vision Scanner** | VGG-16 | 72.8% | 980 ms | 528 MB |
| **Vision Scanner** | ResNet-50 | 74.1% | 410 ms | 98 MB |
| **Vision Scanner** | **MobileNetV2 (Ours)** | **73.4%** | **112 ms** | **16.2 MB** |
| **Crop Recommender** | Decision Tree (CART) | 84.1% | 1 ms | 0.4 MB |
| **Crop Recommender** | Support Vector Machine | 89.2% | 14 ms | 3.8 MB |
| **Crop Recommender** | **Random Forest (Ours)** | **99.3%** | **6 ms** | **2.1 MB** |
| **Risk Estimation** | Logistic Regression | 0.712 (AUC) | 2 ms | 0.1 MB |
| **Risk Estimation** | Random Forest Regressor | 0.835 (AUC) | 12 ms | 8.4 MB |
| **Risk Estimation** | Standalone XGBoost | 0.871 (AUC) | 5 ms | 4.2 MB |
| **Risk Estimation** | **Hybrid Radar (Ours)** | **0.892 (AUC)** | **8 ms** | **4.3 MB** |

#### Systematic Architectural Ablation Study
| Pipeline Module | Ablation Variant | Empirical System Impact / Degradation |
| :--- | :--- | :--- |
| **Complete SAGRI Stack** | Default Implementation | Baseline: ROC-AUC 0.892, Price MAPE 8.35%, 0.0% Bioclimatic Violations |
| **Crop Recommendation** | w/o Agronomic Constraint Layer | 15.8% of generated recommendations violate ICAR climatic and water zone thresholds |
| **Climate Risk Radar** | w/o Physical Shortfall Engine | ROC-AUC drops from 0.892 to 0.871; failure detection under extreme droughts weakens |
| **Price Forecasting** | w/o CFPI Inflation Deflation | Forecast MAPE degrades from 8.35% to 14.2% due to unmodeled nominal currency drift |
| **Disease Diagnostics** | w/o Test-Time Augmentation | Out-of-distribution field top-1 accuracy falls from 73.4% to 71.8% under variable lighting |
| **Data Persistence** | w/o SQLite WAL Mode | Concurrency locks emerge at 15+ concurrent requests; write latency increases 2.8x |

---

### 4. Transparent Handling of Model Edge Cases
During validation, we noted an informative edge case: the PlantVillage dataset contains no diseased blueberry leaves, indexing only `Blueberry___healthy`. When presented with visibly diseased blueberry foliage, our vision model classified the leaf as healthy with a low softmax confidence score of 26.3%. 

Because SAGRI avoids artificial confidence inflation, this low score exposes the model's ambiguity rather than masking it. We are implementing an automatic rule: whenever a "healthy" classification arrives with under 45% confidence, the system flags the leaf as *"Inconclusive / Suspected Abiotic Stress"* to prevent giving false reassurance to growers.

In accordance with India's Digital Personal Data Protection (DPDP) Act 2023, farmer telemetry and transaction ledgers remain strictly within the local SQLite database, preventing privacy leakage to speculative commodity traders.
