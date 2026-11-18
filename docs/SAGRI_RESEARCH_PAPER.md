# SAGRI: An Agro-Climatic Constraint-Gated Multimodal Architecture for Smallholder Advisory and Mandi Gate Settlement

**Authors:** Shikhar Kesharwani (S24CSEU0502@bennett.edu.in), Santusht Lakhanpal (S24CSEU0465@bennett.edu.in), Monu Singh  
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
We benchmarked the entire software stack on an unaccelerated quad-core Intel Core i5-1135G7 CPU at 2.40 GHz with 8 GB RAM. This hardware profile mirrors budget laptop terminals operated by rural extension agents and primary agricultural credit societies. The quantized MobileNetV2 ONNX session averaged 112 ms per image on a single CPU thread, keeping memory consumption down to 16.2 MB. Two-pass horizontal flip TTA bumped field diagnostic accuracy by 1.6% without adding GPU dependencies. SQLite configured with WAL mode sustained 1,840 write transactions per second, preventing database lock contention during heavy morning mandi weigh-in periods.

| Pipeline Component | Evaluation Metric | Observed Value |
| :--- | :--- | :--- |
| **Foliar Scanner (ONNX)** | Top-1 Field Accuracy | 73.4% |
| **Foliar Scanner (ONNX)** | Single-Thread CPU Latency | 112 ms |
| **Foliar Scanner (ONNX)** | Model File Size | 16.2 MB |
| **Crop Recommender** | 22-Crop Test Accuracy | 99.3% |
| **Risk Radar (Hybrid)** | Out-of-Time ROC-AUC | 0.892 |
| **Mandi Price Forecaster** | 30-Day Mean Abs. Pct. Error | 8.35% |
| **Backend Service (FastAPI)** | Median (P50) API Response | 48 ms |
| **Storage Engine (SQLite WAL)** | Write Throughput | 1,840 tx/s |

#### Comparative Baseline Evaluation
To understand where lighter models succeed and where heavier architectures waste resources, we evaluated candidate algorithms on the exact same train-test splits:

| Task | Architecture | Acc. / AUC | CPU Latency | RAM |
| :--- | :--- | :--- | :--- | :--- |
| **Leaf Diagnostics** | VGG-16 | 72.8% | 980 ms | 528 MB |
| **Leaf Diagnostics** | ResNet-50 | 74.1% | 410 ms | 98 MB |
| **Leaf Diagnostics** | **MobileNetV2 (Ours)** | **73.4%** | **112 ms** | **16.2 MB** |
| **Crop Choice** | Decision Tree (CART) | 84.1% | 1 ms | 0.4 MB |
| **Crop Choice** | Support Vector Machine | 89.2% | 14 ms | 3.8 MB |
| **Crop Choice** | **Random Forest (Ours)** | **99.3%** | **6 ms** | **2.1 MB** |
| **Yield Failure Risk** | Logistic Regression | 0.712 | 2 ms | 0.1 MB |
| **Yield Failure Risk** | Random Forest Regressor | 0.835 | 12 ms | 8.4 MB |
| **Yield Failure Risk** | Standalone XGBoost | 0.871 | 5 ms | 4.2 MB |
| **Yield Failure Risk** | **Hybrid Radar (Ours)** | **0.892** | **8 ms** | **4.3 MB** |

For leaf diagnostics, ResNet-50 recorded 74.1% field accuracy, edging out our quantized MobileNetV2 (73.4%) by only 0.7 percentage points. But that marginal gain required 410 ms of processing time and 98 MB of weights. On inexpensive Android smartphones (e.g., MediaTek Helio G25 or Snapdragon 439) commonly carried by rural field workers, that delay produces noticeable camera stutter. VGG-16 performed far worse, demanding 528 MB of memory and taking nearly a full second (980 ms) per photo. Quantized MobileNetV2 evaluated in 112 ms at 16.2 MB, giving field personnel instantaneous diagnostic feedback.

In crop selection, standard CART decision trees (84.1%) and SVMs (89.2%) struggled to map non-linear boundaries between soil NPK chemistry and seasonal precipitation, falling over ten percentage points behind our Random Forest model (99.3%).

For climate risk, logistic regression collapsed to an uninformative 0.712 ROC-AUC. Standalone XGBoost performed strongly at 0.871 AUC, but missed crop failures caused by localized heat spikes. Fusing XGBoost with our physical crop-water shortfall equation lifted ROC-AUC to 0.892 (+0.021 gain), catching drought stress patterns that pure statistical tree splits overlooked.

#### Systematic Architectural Ablation Study
We stripped individual components out of the running platform to check whether each actually pulls its weight:

| Pipeline Component | Ablation Variant | Observed Impact / Failure Mode |
| :--- | :--- | :--- |
| **Full Architecture** | Default SAGRI Stack | 0.892 AUC, 8.35% MAPE, 0% violations |
| **Crop Engine** | w/o ICAR Constraint Mask | 15.8% unviable crops advised in arid zones |
| **Climate Risk** | w/o Crop-Water Shortfall | ROC-AUC drops from 0.892 to 0.871 in heatwaves |
| **Mandi Pricing** | w/o CFPI Inflation Deflation | 30-day forecast error jumps to 14.2% MAPE |
| **Leaf Vision** | w/o Two-Pass Augmentation | Field top-1 accuracy falls from 73.4% to 71.8% |
| **Local Storage** | w/o SQLite WAL Mode | Concurrency lockups appear at $\ge$15 sessions |

Disabling the ICAR bioclimatic constraint mask caused immediate agronomic failures: the raw Random Forest advised water-intensive crops like paddy and sugarcane in arid western Rajasthan districts in roughly 16 out of every 100 test queries. In practical farming, following those unconstrained ML outputs would deplete borewells and bankrupt smallholders. Dropping the physical crop-water shortfall score caused risk ROC-AUC to fall from 0.892 down to 0.871, demonstrating that tabular tree models fail to generalize when temperatures breach historical norms. In the mandi module, skipping CFPI deflation doubled forecast error from 8.35% to 14.2% MAPE, because the model mistook nominal currency depreciation over 25 years for real market price movements. Finally, running SQLite without WAL mode sparked transaction busy locks once concurrent API requests exceeded 15 sessions.

---

### 4. Known Limitations and Field Edge Cases
Stress-testing the vision pipeline uncovered a concrete failure mode linked to the PlantVillage distribution: the dataset contains no diseased blueberry leaves, indexing only `Blueberry___healthy`. When we fed our ONNX model field photos of nutrient-starved and scorched blueberry foliage collected from regional nurseries, the network had no matching disease class. It defaulted to `Blueberry___healthy`, but with an unusually low softmax score of 26.3%.

Unlike commercial agriculture apps that artificially boost confidence scores to 90% to hide uncertainty, our raw probability pipeline exposed this doubt directly. To protect farmers from misleading negative diagnoses, we added a hard boundary: whenever the model predicts a healthy condition with confidence below 45%, the platform intercepts the output and labels the leaf as "Inconclusive / Suspected Abiotic Stress". This triggers a warning recommending physical inspection by a Krishi Vigyan Kendra (KVK) officer instead of offering false reassurance.

In accordance with India's Digital Personal Data Protection (DPDP) Act 2023, farmer telemetry and transaction ledgers remain strictly within the local SQLite database, preventing privacy leakage to speculative commodity traders.

---

### 5. Conclusion and Future Scope
Purely statistical machine learning easily goes astray in agriculture when unmoored from physical reality—recommending flood crops in deserts, hiding diagnostic doubt behind inflated confidence, or confusing inflation for genuine mandi profits. In SAGRI, we showed that grounding predictive algorithms in agronomic physics, biological constraints, and real market rails turns brittle models into reliable field tools. By filtering crop trees through ICAR biological masks, pairing XGBoost with physical crop-water deficit math, deflating price history against food inflation, and automating UPI 98/2 mandi payouts, the platform provides smallholders with honest, calibrated assistance. Operating entirely off a local SQLite WAL engine eliminates cloud overhead and keeps farmer data strictly on-premise under DPDP guidelines. Moving forward, we are expanding the ICAR biological constraint matrices to encompass all 128 agro-ecological sub-zones in India and testing on-device micro-spectrometers for real-time soil nitrogen sensing.
