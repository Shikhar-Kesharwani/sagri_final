# SAGRI: An Agro-Climatic Constraint-Gated Multimodal Architecture for Smallholder Advisory and Mandi Gate Settlement

**Authors:** Shikhar Kesharwani (S24CSEU0502@bennett.edu.in), Santusht Lakhanpal (S24CSEU0465@bennett.edu.in), Monu Singh  
**Institution:** Department of Computer Science and Engineering, Bennett University, Greater Noida, UP, India  
**Repository:** https://github.com/Shikhar-Kesharwani/sagri_final  

---

### Abstract
Most digital agriculture apps in India break down when taken into real fields. Foliar vision models trained on clean lab datasets choke on shaded outdoor leaves. Tabular crop models recommend water-intensive cash crops in drought-prone districts simply because soil nitrogen matches. Worst of all, advisory apps abandon the farmer right before market sale, leaving them vulnerable to delayed cash payouts from mandi middlemen. We built SAGRI to handle this whole chain on low-cost hardware without cloud dependencies. To stop nonsensical crop advice, we placed hard biological filters based on ICAR agro-climatic rules behind a Random Forest classifier; this eliminated unviable crop recommendations completely, dropping violations from 15.8% to zero. For climate failure risk, we fused XGBoost tabular predictions with a five-parameter physical crop-water deficit formula across 325,418 district-level historical records, achieving an ROC-AUC of 0.892. On mobile devices, our quantized MobileNetV2 ONNX model diagnoses 38 crop leaf classes in 112 ms on a single CPU thread, using just 16.2 MB of RAM. Finally, we wired the advisory outputs into an automated 98/2 UPI payment ledger that generates instant mandi gate transaction slips. The entire system persists state into an embedded SQLite database running write-ahead logging, maintaining sub-50 ms query speeds even over fragile rural 2G networks.

---

### 1. Introduction
India has over 146 million operational agricultural landholdings, and roughly 86% of them cover less than two hectares. Farmers working small plots rarely have access to agricultural extension officers or plant pathologists. When a crop leaf turns yellow or spots appear, a farmer's only practical option is usually to carry a leaf sample to a local agrochemical shopkeeper. The retailer, motivated by commercial margins, frequently prescribes expensive, broad-spectrum chemical fungicides or pesticides. This practice drains household savings and harms soil ecology over time.

Machine learning models could theoretically offer unbiased, near-instant guidance on a basic smartphone. Yet most models found in research literature fail badly once deployed outside lab settings:
* **Biologically blind recommendations:** Standard algorithms optimize statistical loss without knowing plant biology. Feed a trained decision tree soil measurements from an arid district in western Rajasthan, and if the nitrogen and potassium numbers look right, the algorithm will happily recommend wetland paddy (*Oryza sativa*)—ignoring the reality that the district receives barely 350 mm of rain annually and groundwater is hundreds of feet deep.
* **Artificially inflated confidence:** Several agritech apps scale up low-confidence predictions to 90%+ simply to keep users from doubting the screen. This dishonest calibration blinds farmers to genuine diagnostic uncertainty.
* **Disconnection from mandi cash flow:** Even if an advisory app identifies a healthy crop or a fair harvest price, it stops at the screen edge. In actual Agricultural Produce Market Committee (APMC) mandis, smallholders face delayed cash settlements from commission agents (*arhtiyas*) that often drag out for two to six weeks.

We built SAGRI (*Smart Agriculture Real-time Intelligence*) to tackle these disconnects systematically. First, we placed an **Agronomic Constraint Layer** directly behind the crop selection model, forcing tree outputs through ICAR bioclimatic masks so unviable crops are pruned out before ranking. Second, we created a **Hybrid Risk Radar** that pairs XGBoost empirical predictions with physical crop-water shortfall math, keeping drought estimates honest when weather deviates from past records. Third, we linked advisory prices to an **automated APMC settlement ledger** that simulates instant UPI disbursements (98% net farmer credit, 2% market fee) with downloadable UTR transaction receipts. Finally, we stored everything in a local **SQLite database configured with Write-Ahead Logging (WAL)**, allowing field agents to run queries and log records offline without paying for cloud servers or stalling on weak cellular signals.

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
