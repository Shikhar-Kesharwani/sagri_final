# SAGRI: An Agro-Climatic Constraint-Gated Multimodal Architecture for Smallholder Advisory and Mandi Gate Settlement

**Authors:** Shikhar Kesharwani (S24CSEU0502@bennett.edu.in), Santusht Lakhanpal (S24CSEU0465@bennett.edu.in), Monu Singh  
**Institution:** Department of Computer Science and Engineering, Bennett University, Greater Noida, UP, India  
**Repository:** https://github.com/Shikhar-Kesharwani/sagri_final  

---

### Abstract
Most digital agriculture tools built for Indian farmers fail when deployed in actual fields. Foliar disease models trained on laboratory images struggle with outdoor shadows and background soil. Crop recommendation models suggest water-thirsty crops in arid regions because they look only at soil nutrients. Meanwhile, market advisory tools stop at price predictions; growers often wait weeks for cash payouts at local mandis. We built SAGRI to address these issues together on low-cost hardware. To stop unrealistic crop advice, we placed ICAR agro-climatic rules as hard filters behind a Random Forest classifier. This step cut invalid crop suggestions from 15.8% down to zero across test records. To estimate crop failure risk under drought, we joined XGBoost tree predictions with a five-variable physical crop-water deficit equation over 325,418 district records (1966–2017). This hybrid formula reached an ROC-AUC of 0.892. On the client side, our quantized MobileNetV2 ONNX model classifies 38 foliar disease states in 112 ms on a single CPU thread and takes 16.2 MB of storage. We also built an automated APMC settlement simulator that divides sale revenue into a 98% farmer credit and a 2% mandi cess. The system generates instant UPI transaction slips. All records persist locally in an embedded SQLite database running write-ahead logging. Queries execute in under 50 ms without relying on cloud infrastructure or steady mobile internet.

---

### 1. Introduction
India has roughly 146 million operational farm holdings, and 86% of them measure under two hectares. Smallholders on these plots rarely receive visits from trained agronomists. When crops develop leaf spots or fungal blight, farmers usually take a sample to a local agrochemical retailer. These shopkeepers often recommend expensive, broad-spectrum chemical sprays to maximize retail margins. The result is unnecessary debt for the farmer and long-term chemical damage to the soil.

Machine learning models could theoretically offer low-cost advice on basic Android phones. In practice, models from research papers often make dangerous mistakes in the field. First, standard crop recommendation classifiers optimize purely mathematical loss functions. If a Random Forest model sees high soil potassium and nitrogen from a district in western Rajasthan, it frequently recommends wetland paddy (*Oryza sativa*). The model does not know that the district receives only 350 mm of annual rainfall and that local groundwater is already depleted. Second, many commercial agritech apps artificially push low model confidence scores into the 90% to 99% range. This artificial inflation reassures the user, but it hides genuine diagnostic uncertainty. Third, advisory tools rarely connect to market cash flows. Growers often wait two to six weeks before receiving cash from commission agents (*arhtiyas*) at Agricultural Produce Market Committee (APMC) mandis.

We designed SAGRI (*Smart Agriculture Real-time Intelligence*) to solve these problems in an integrated platform. We placed an ICAR-based biological constraint layer behind our crop recommendation model. The layer prunes out crops that cannot survive local thermal and rainfall conditions before any ranking is shown to the user. For climate failure risk, we built a hybrid radar that combines statistical predictions from XGBoost with a deterministic crop-water deficit formula. To assist with mandi transactions, we added an APMC settlement simulator that calculates statutory market fees (98% farmer credit and 2% mandi cess) and creates immediate UPI transaction slips. Finally, we stored all data in a local SQLite database running write-ahead logging (WAL). Field agents can query logs and record predictions offline on inexpensive laptops without paying for cloud servers or waiting for intermittent cellular connections.

---

### 2. Dataset Curation and Partitioning
| Dataset Source | Target Task | Sample Count | Evaluation Split |
| :--- | :--- | :--- | :--- |
| **PlantVillage** | Foliar Pathology | 54,305 Images | 80% Train / 20% Test |
| **ICAR Soil Survey** | Crop Recommendation | 2,200 Rows | 5-Fold Stratified CV |
| **ICRISAT + IMD + ERA5** | Failure Risk Radar | 325,418 Rows | 1966–2007 Train / 2008–2017 Test |
| **Agmarknet 25-Year** | Mandi Forecasting | 1.2M Records | Chronological 80/20 Holdout |

Preparing real-world data required substantial preprocessing. For the 54,305 PlantVillage leaf images, we removed corrupted files and out-of-focus samples, then cropped foliage into standard 224$\times$224 boxes. For the 2,200 crop recommendation records, we inspected distributions and clamped extreme soil pH values that exceeded three standard deviations.

Constructing the climate failure radar required extensive data engineering. We merged 52 years (1966–2017) of ICRISAT district yield data with daily rainfall grids from the India Meteorological Department (IMD), ERA5 surface wind speeds, and solar radiation records from NASA POWER. Because dozens of Indian districts split or shifted administrative borders during those five decades, we mapped historical boundaries onto Census 2011 district identifiers to keep spatial comparisons consistent. We defined a crop failure ($Y=1$) as any season where yield dropped more than 20% below the district's rolling 10-year mean. For mandi price forecasting, we collected 25 years of daily modal price records across 30 crops from Agmarknet. We matched each record to monthly national food inflation tables.

---

### 3. Experimental Results & Ablation Analysis

#### Model Performance Across Pipelines
We benchmarked the complete software stack on an unaccelerated quad-core Intel Core i5-1135G7 CPU at 2.40 GHz with 8 GB of RAM. This setup reflects budget laptops used by rural extension workers and primary agricultural societies. The quantized MobileNetV2 ONNX model averaged 112 ms per image on a single CPU thread and consumed 16.2 MB of RAM. Two-pass horizontal flip TTA improved field diagnostic accuracy by 1.6% without GPU requirements. SQLite with WAL mode sustained 1,840 write operations per second. This setup prevented database stalls during busy morning mandi weigh-in hours.

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
To see where lighter models succeed and where heavier architectures waste compute resources, we benchmarked candidate models across identical data splits:

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

In foliar diagnostics, ResNet-50 achieved 74.1% field accuracy. That is only 0.7 percentage points higher than our quantized MobileNetV2 (73.4%). However, ResNet-50 required 410 ms per image and 98 MB of storage. On entry-level Android smartphones (such as MediaTek Helio G25 or Snapdragon 439 devices) used by field staff, this delay freezes the camera viewfinder. VGG-16 performed much worse: it used 528 MB of memory and took nearly a full second (980 ms) per scan. Quantized MobileNetV2 ran in 112 ms with a 16.2 MB footprint. This speed gave field personnel immediate diagnostic feedback.

In crop selection, simple CART decision trees (84.1%) and SVMs (89.2%) struggled with non-linear relationships between soil NPK chemistry and rainfall. They trailed our Random Forest model (99.3%) by more than ten percentage points.

For climate risk, logistic regression performed poorly with an ROC-AUC of 0.712. Standalone XGBoost achieved 0.871 AUC, but it missed yield crashes caused by sudden localized heatwaves. Fusing XGBoost with our physical crop-water shortfall formula raised ROC-AUC to 0.892 (+0.021 gain). The physical formula caught drought stress patterns that tree splits missed.

#### Systematic Architectural Ablation Study
We removed components one at a time to examine whether each part provides measurable value:

| Pipeline Component | Ablation Variant | Observed Impact / Failure Mode |
| :--- | :--- | :--- |
| **Full Architecture** | Default SAGRI Stack | 0.892 AUC, 8.35% MAPE, 0% violations |
| **Crop Engine** | w/o ICAR Constraint Mask | 15.8% unviable crops advised in arid zones |
| **Climate Risk** | w/o Crop-Water Shortfall | ROC-AUC drops from 0.892 to 0.871 in heatwaves |
| **Mandi Pricing** | w/o CFPI Inflation Deflation | 30-day forecast error jumps to 14.2% MAPE |
| **Leaf Vision** | w/o Two-Pass Augmentation | Field top-1 accuracy falls from 73.4% to 71.8% |
| **Local Storage** | w/o SQLite WAL Mode | Concurrency lockups appear at $\ge$15 sessions |

Removing the ICAR biological constraint mask led to immediate agronomic errors. The unconstrained Random Forest advised water-intensive crops such as paddy and sugarcane in arid western Rajasthan districts in approximately 16 out of every 100 test queries. In a real farming scenario, farmers following these unconstrained predictions would deplete borewells and suffer severe financial losses. Removing the physical crop-water shortfall formula caused risk ROC-AUC to drop from 0.892 to 0.871. This confirms that tree models struggle when temperatures exceed historical records. Without CFPI price deflation, forecast error jumped from 8.35% to 14.2% MAPE. The model confused general currency inflation with real commodity price shifts. Finally, SQLite without WAL mode caused database lockups once concurrent API requests reached 15 sessions.

---

### 4. Known Limitations and Field Edge Cases
Stress testing uncovered an important limitation tied to the PlantVillage dataset: the dataset has no diseased blueberry leaves. It contains only the class `Blueberry___healthy`. When we tested our ONNX model on field images of nutrient-starved and sunburned blueberry leaves from local nurseries, the model had no matching disease category. It classified the leaves as `Blueberry___healthy`, but with a low softmax confidence score of 26.3%.

Commercial agriculture tools often mask low confidence by artificially scaling scores up to 90%. In contrast, our platform presents raw probabilities directly. This transparency makes the model's uncertainty visible to the user. To prevent misleading negative results, we added a rule: whenever the model predicts a healthy leaf with under 45% confidence, the system flags the result as "Inconclusive / Suspected Abiotic Stress". This alert encourages farmers to request a manual check from a Krishi Vigyan Kendra (KVK) officer rather than assuming the plant is unharmed.

In accordance with India's Digital Personal Data Protection (DPDP) Act 2023, farmer telemetry and transaction ledgers remain strictly within the local SQLite database, preventing privacy leakage to speculative commodity traders.

---

### 5. Conclusion and Future Scope
Machine learning models often make impractical recommendations in agriculture when they operate without physical domain constraints. They may suggest water-hungry crops in arid zones, hide diagnostic uncertainty behind inflated confidence scores, or mistake general inflation for market price trends. In this paper, we presented SAGRI, an architecture that grounds agricultural algorithms in physical constraints and market systems. We placed ICAR biological rules behind crop recommendation trees, paired tree predictions with physical crop-water deficit math, deflated historical mandi prices against 25 years of food inflation, and simulated automated UPI payments. The resulting platform gives smallholders practical, calibrated advice. Our local SQLite database eliminates cloud dependencies and keeps farmer data on-premise under DPDP regulations. In future work, we plan to expand the biological constraint tables across all 128 Indian agro-ecological zones and evaluate portable micro-spectrometers for direct soil nutrient measurement.
