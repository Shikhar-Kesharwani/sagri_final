# SAGRI: An Agro-Climatic Constraint-Gated Multimodal Architecture for Smallholder Advisory and Mandi Gate Settlement

**Authors:** Shikhar Kesharwani (S24CSEU0502@bennett.edu.in), Santusht Lakhanpal (S24CSEU0465@bennett.edu.in), Monu Singh  
**Institution:** Department of Computer Science and Engineering, Bennett University, Greater Noida, UP, India  
**Repository:** https://github.com/Shikhar-Kesharwani/sagri_final  

---

### Abstract
Existing digital agriculture tools deployed in Indian fields suffer three recurring failures: vision classifiers cannot handle outdoor lighting, crop recommenders ignore district-level water budgets, and market advisors leave farmers waiting weeks for mandi cash payouts. SAGRI addresses all three on low-cost, offline-capable hardware. An ICAR agro-climatic constraint layer placed behind a Random Forest classifier cut invalid crop advice from 15.8% to zero in test records. A hybrid risk model that fuses XGBoost predictions with a physical crop-water deficit equation achieved ROC-AUC 0.892 across 325,418 district-year records. A quantized MobileNetV2 ONNX model classifies 38 foliar disease states in 112 ms on a single CPU thread using 16.2 MB of storage. An automated APMC settlement module computes statutory 98/2 splits and generates instant UPI transaction slips. All records persist in an embedded SQLite database with write-ahead logging; queries complete in under 50 ms with no cloud dependency.

---

### 1. Introduction
India counts roughly 146 million operational farm holdings, 86% of them smaller than two hectares. Trained agronomists rarely visit these plots. When a crop shows leaf spots or fungal blight, the farmer typically takes a sample to a local agrochemical shop, where the retailer recommends broad-spectrum chemical sprays to protect retail margins. The outcome is unnecessary debt and long-term soil degradation.

Machine learning models could lower advisory costs on basic Android hardware. In practice, models transferred from research settings make dangerous mistakes in Indian fields. Standard crop recommendation classifiers optimize only for statistical loss. A Random Forest trained on ICAR district soil records may recommend wetland paddy (*Oryza sativa*) in western Rajasthan because potassium and nitrogen values match historical paddy samples, without any knowledge that the district receives 350 mm of rainfall annually and that groundwater is already overdrafted. Many commercial agritech apps address low-confidence predictions by artificially pushing softmax scores into the 90–99% range, hiding genuine uncertainty from the farmer. Payment remains a separate problem: farmers handing produce to commission agents (*arhtiyas*) at Agricultural Produce Market Committee (APMC) mandis routinely wait two to six weeks for cash settlement while paperwork circulates between traders and clerks, forcing growers into high-interest debt cycles.

We designed SAGRI (*Smart Agriculture Real-time Intelligence*) as an integrated platform that addresses each of these gaps. An ICAR-based biological constraint layer prunes crop candidates that cannot survive local thermal and rainfall conditions before any ranking is returned. A hybrid climate risk engine pairs statistical gradient-boosted predictions with a deterministic crop-water deficit formula to catch drought stress that tree models miss when weather conditions exceed historical training ranges. An APMC settlement module calculates statutory 98% farmer credit and 2% mandi cess and generates immediate UPI transaction slips. All data persist in a local SQLite database running write-ahead logging (WAL), so field agents can record and query predictions on inexpensive laptops without cloud access or stable cellular connectivity.

---

### 2. Related Work

#### 2.1 Mobile Plant Pathology on Budget Hardware
Deep learning became the standard approach to plant pathology after Mohanty et al. reported high diagnostic accuracy on the PlantVillage dataset. Field deployment proved harder than laboratory results suggested. Ferentinos tested architectures including VGG-16 and GoogLeNet and confirmed that large convolutional filters detect foliar symptoms accurately but consume over 500 MB of device memory. ResNet-50 improved gradient flow through residual shortcuts yet still occupies 98 MB, causing thermal throttling on low-end Android devices. Sandler et al. introduced MobileNetV2 with inverted residual bottlenecks specifically to reduce parameter counts on mobile hardware. We quantize this architecture to 8-bit integers and deploy it via ONNX Runtime, achieving a 16.2 MB footprint with 112 ms single-thread CPU inference.

#### 2.2 Agronomic Constraints in Crop Selection
Tabular crop recommendation has relied primarily on tree ensembles and support vector machines. Medar et al. showed Random Forest outperforms decision trees and SVMs when predicting suitability from soil nutrient records. Standard classifiers treat climate features as unconstrained numerical inputs, so they can predict paddy in arid zones whenever nutrient chemistry happens to match paddy-growing districts. Constraint satisfaction methods have a long history in operations research, but agricultural ML systems rarely enforce biological survival boundaries over statistical outputs. SAGRI applies such boundaries directly through ICAR regional exclusion rules.

#### 2.3 Climate Risk and Mandi Price Modeling
Crop yield vulnerability under weather extremes has received substantial research attention. Lobell et al. documented consistent cereal yield losses from temperature spikes across multiple growing seasons. Challinor et al. showed that physical evapotranspiration shortfall calculations capture crop failure dynamics more reliably than raw temperature averages. XGBoost handles tabular climate data well but can underestimate risk during unusual droughts with no historical precedent in training data. Combining tree predictions with a physics-based deficit formula addresses this gap. On commodity pricing, Kumar et al. applied ARIMA to Agmarknet wholesale records; Jha and Sinha noted that raw price models conflate monetary inflation with genuine commodity price movement. We build on their finding by deflating 25 years of Agmarknet data with official Consumer Food Price Index (CFPI) values and incorporating live weather anomalies from Open-Meteo.

---

### 3. System Architecture
SAGRI incorporates a dual-client interface layer connecting to a unified local backend:

1. **SAGRI Classic (Port 5173):** Designed for field extension workers and farmers with limited device experience. Built with React 18, high-contrast visual cues, spoken audio prompts, and lightweight WebGL soil profile graphics. Voice guidance minimizes navigation errors on small smartphone screens outdoors.
2. **SAGRI Modern (Port 5174):** Workstation interface tailored for agronomists, researchers, and APMC market secretaries analyzing multi-district records. Built with Radix UI, keyboard accelerators (`Ctrl+K` command palette), and comprehensive analytical visualization widgets.
3. **Unified Backend Core (Port 8000):** FastAPI microservice serving real-time model inference for foliar pathology, constraint-gated crop recommendation, hybrid risk assessment, and price forecasting.
4. **Embedded ACID Persistence Layer:** Embedded SQLite database (`sagri.db`) configured with `PRAGMA journal_mode = WAL`. Concurrent multi-process reads and writes execute without lock contention, eliminating cloud hosting expenses and rural connection dependency.

---

### 4. Data Curation and Preprocessing
The platform is trained and evaluated across four distinct agricultural repositories:

| Dataset Source | Target Task | Sample Count | Evaluation Split |
| :--- | :--- | :--- | :--- |
| **PlantVillage** | Foliar Pathology | 54,305 Images | 80% Train / 20% Test |
| **ICAR Soil Survey** | Crop Recommendation | 2,200 Rows | 5-Fold Stratified CV |
| **ICRISAT + IMD + ERA5** | Failure Risk Radar | 325,418 Rows | 1966–2007 Train / 2008–2017 Test |
| **Agmarknet 25-Year** | Mandi Forecasting | 1.2M Records | Chronological 80/20 Holdout |

For the 54,305 PlantVillage leaf images, we removed corrupted files and out-of-focus samples, then cropped all foliage to standard 224x224 bounding boxes. Random stratified train/test split (80/20) preserves class ratios across the 38 disease categories. For the 2,200 crop recommendation records, we inspected feature distributions and clamped soil pH values that exceeded three standard deviations from the mean. We used 5-fold stratified cross-validation rather than a single holdout to get stable accuracy estimates across the small dataset's 22 crop classes.

Constructing the climate failure dataset required multi-source alignment. We merged 52 years (1966–2017) of ICRISAT district yield data with daily rainfall grids from the India Meteorological Department (IMD), ERA5 surface wind speeds, and solar radiation records from NASA POWER. Indian district boundaries shifted due to administrative reorganization over five decades, so we mapped historical boundaries to Census 2011 district identifiers to maintain spatial consistency. We defined crop failure ($Y=1$) as any growing season where yield fell more than 20% below the district's rolling 10-year average. For the climate risk model, we held out the final decade (2008–2017) as a strict out-of-time test set, since chronological splits better reflect real forecasting conditions than random partitions. For mandi price forecasting, we collected 25 years of daily modal prices across 30 crops from Agmarknet and matched each record to monthly national food inflation figures. Chronological holdout was chosen here as well because price models must be validated on future data, not randomly shuffled records.

---

### 5. Methodology and Model Design

#### 5.1 Pipeline 1: MobileNetV2 Foliar Pathology Scanner
Trained on 38 crop-disease classes across 14 host species using inverted residual bottlenecks. Center cropping and ImageNet normalization are applied:
$$\mathbf{I}_{\text{norm}} = \frac{\text{Resize}(\text{CenterCrop}(\mathbf{I}, \min(H, W)), 224, 224) - \boldsymbol{\mu}}{\boldsymbol{\sigma}}$$
To mitigate field lighting variance and angle artifacts, two-pass Test-Time Augmentation (TTA) computes the mean probability vector:
$$\mathbf{z} = \frac{\text{softmax}(f_\theta(\mathbf{I}_{\text{norm}})) + \text{softmax}(f_\theta(\text{Flip}_H(\mathbf{I}_{\text{norm}})))}{2}$$
Raw probabilities are presented without artificial score inflation. Inconclusive scans trigger differential recommendations, approved CIBRC agrochemical interventions, and certified organic alternatives.

#### 5.2 Pipeline 2: Agronomic Constraint-Gated Crop Recommender
A 100-tree Random Forest classifies suitability across 22 crops from 7 agro-chemical dimensions:
$$\mathbf{x} = [N, P, K, \text{pH}, T_{\text{mean}}, H_{\text{rel}}, R_{\text{ann}}]$$
To prevent statistical anomalies from violating agricultural reality, candidate probabilities pass through two successive gates:
1. **Regional Incompatibility Filter:** For agro-climatic zone $r$, if crop $c \in \mathcal{E}(r)$, then $p'_c = 0$.
2. **Physiological Threshold Gate:** If seasonal rainfall $R < W_{\min}(c)$ or temperature $T \notin [T_{\min}(c), T_{\max}(c)]$, then $p''_c = 0$.
Surviving probabilities are renormalized:
$$\mathbf{p}^* = \frac{\mathbf{p}''}{\sum_k p''_k}$$

#### 5.3 Pipeline 3: Hybrid Climate Risk Radar
Statistical failure risk is predicted by XGBoost ($P_{\text{XGB}} \in [0, 1]$) over 15 tabular features. In parallel, a deterministic physics engine evaluates environmental stress shortfall ($S \in [0, 100]$):
- Heat Stress: $S_{\text{heat}} = \max\left(0, \frac{T_{\max} - T_{\text{crit}}(c)}{10}\right) \times 20$
- Moisture Deficit: $S_{\text{rain}} = \max\left(0, \frac{W_{\text{req}}(c) - R_{\text{obs}}}{W_{\text{req}}(c)}\right) \times 25$
- Evapotranspiration Deficit: $S_{\text{et}} = \max\left(0, \frac{E_T - R_{\text{obs}}}{E_T}\right) \times 20$
- Nutrient Stress: $S_{\text{npk}} = \max\left(0, \frac{\|\mathbf{N}_{\text{req}} - \mathbf{N}_{\text{obs}}\|_1}{\|\mathbf{N}_{\text{req}}\|_1}\right) \times 20$
- Wind Shear: $S_{\text{wind}} = \max\left(0, v_{\text{wind}} - 8.0\right) \times 15$
$$S_{\text{total}} = \min(100, S_{\text{heat}} + S_{\text{rain}} + S_{\text{et}} + S_{\text{npk}} + S_{\text{wind}})$$
Composite risk fuses empirical learning with physical bounds:
$$\text{Risk} = \left(0.65 \times P_{\text{XGB}} + 0.35 \times \frac{S_{\text{total}}}{100}\right) \times 100\%$$

#### 5.4 Pipeline 4: Inflation-Adjusted Mandi Price Forecaster
Historical modal commodity prices are deflated using Consumer Food Price Index (CFPI) benchmarks:
$$P_{\text{real}, t} = P_{\text{nominal}, t} \times \left(\frac{\text{CFPI}_{\text{base}}}{\text{CFPI}_t}\right)$$
An autoregressive model of order $p$ is fit with dynamic weather anomalies $\mathbf{W}_t$ from Open-Meteo:
$$P_{\text{real}, t} = \phi_0 + \sum_{i=1}^p \phi_i P_{\text{real}, t-i} + \boldsymbol{\theta}^T \mathbf{W}_t + \epsilon_t$$

#### 5.5 Pipeline 5: Multi-Persona Conversational Advisory
Four agronomic agent personas are implemented via Google Gemini 1.5 Flash: General Extension Advisor, Soil Chemistry Specialist, Mandi Market Analyst, and IPM Pathologist. Each persona is loaded with localized district context and user query parameters. Automatic Unicode script analysis enables instant native-language dialogue in Hindi, Punjabi, or English without manual configuration.

---

### 6. APMC Mandi Settlement & Data Ethics
To address the traditional multi-week liquidity delay imposed on smallholders by commission intermediaries, SAGRI calculates statutory APMC deductions instantly upon harvest valuation ($P \times Q$):
$$\text{Farmer Net} = 0.98 \times \text{Gross}, \quad \text{Mandi Cess} = 0.02 \times \text{Gross}$$
The 98% principal simulates instant credit to the farmer's Virtual Payment Address (VPA) via UPI rails, while the 2% statutory cess routes to the market committee ledger. Each payout logs a 12-digit Unique Transaction Reference (UTR).

In accordance with India's Digital Personal Data Protection (DPDP) Act 2023, farmer telemetry, photographic evidence, and financial ledger items reside strictly within local SQLite storage, guaranteeing zero data leakage to commercial marketing networks or commodity speculation desks.

---

### 7. Experimental Results & Benchmark Evaluation

#### System Performance Metrics
Evaluated on an unaccelerated quad-core Intel Core i5-1135G7 CPU @ 2.40 GHz with 8 GB RAM:

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

#### Comparative Baseline Benchmarking
Candidate architectures evaluated across identical splits:

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

ResNet-50 achieved 74.1% field accuracy (+0.7% over MobileNetV2) but required 410 ms latency and 98 MB memory, causing severe frame drops on entry-level Android devices. VGG-16 incurred 528 MB overhead and 980 ms latency. Quantized MobileNetV2 achieved 112 ms execution and 16.2 MB RAM usage, delivering real-time field feedback. Random Forest outperformed CART and SVM by over 10 percentage points. Hybrid Risk Radar outperformed standalone XGBoost (+0.021 AUC) by correctly flagging extreme drought events outside historical records.

#### Architectural Ablation Results

| Component Removed | Variant | Measured Impact |
| :--- | :--- | :--- |
| **None (Full System)** | Default SAGRI Stack | 0.892 AUC, 8.35% MAPE, 0% violations |
| **ICAR Constraint Mask** | Crop Engine | 15.8% unviable crops in arid zones |
| **Crop-Water Shortfall** | Climate Risk | AUC drops 0.892 $\to$ 0.871 during heatwaves |
| **CFPI Inflation Deflation** | Mandi Pricing | Forecast error jumps to 14.2% MAPE |
| **Two-Pass Augmentation** | Leaf Vision | Top-1 field accuracy falls 73.4% $\to$ 71.8% |
| **SQLite WAL Mode** | Local Storage | Lockups at $\ge$15 concurrent API sessions |

---

### 8. Known Limitations & Field Edge Cases
Stress testing revealed an inherent dataset artifact: PlantVillage contains only healthy blueberry foliage (`Blueberry___healthy`) with zero diseased leaves. When evaluating nutrient-deficient or sunburned blueberry leaves collected from nurseries in Greater Noida, the model assigned `Blueberry___healthy` with 26.3% softmax confidence. 

Rather than artificially inflating low scores, SAGRI retains transparent confidence reporting. Any healthy classification below 45% confidence is flagged as "Inconclusive / Suspected Abiotic Stress," alerting the farmer to schedule an in-person assessment with their local Krishi Vigyan Kendra (KVK) officer. Future work will expand our foliar database using open Indian field datasets to eliminate such blind spots.

---

### 9. Conclusion
Agricultural machine learning models cause real harm when they operate without physical domain constraints. Unconstrained crop recommenders suggest water-hungry varieties in arid zones, inflated confidence scores hide genuine diagnostic uncertainty, and raw price forecasts track currency devaluation rather than commodity market shifts. SAGRI addresses each failure through explicit domain engineering: ICAR biological rules gate tree classifier outputs, a physics-based crop-water deficit score supplements XGBoost predictions during extreme weather, 25 years of Agmarknet prices are deflated against CFPI before model fitting, and a statutory APMC UPI settlement module removes the cash-delay bottleneck that forces farmers into short-term debt. Local SQLite persistence with WAL mode eliminates cloud dependencies and keeps farmer records on-device in compliance with India's DPDP Act. Future work will expand ICAR constraint tables to cover all 128 Indian agro-ecological zones, incorporate additional plant disease datasets to close gaps like the blueberry edge case, and pilot the system with field extension workers across two districts in Uttar Pradesh to measure advisory uptake and practical error rates.

---

### 10. References
1. National Sample Survey Office, "Situation Assessment of Agricultural Households in India," Ministry of Statistics and Programme Implementation, New Delhi, Tech. Rep. 587, 2019.
2. S. P. Mohanty, D. P. Hughes, and M. Salathé, "Using deep learning for image-based plant disease detection," *Frontiers in Plant Science*, vol. 7, p. 1419, Sep. 2016.
3. K. P. Ferentinos, "Deep learning models for plant disease detection and diagnosis," *Computers and Electronics in Agriculture*, vol. 145, pp. 311–318, Feb. 2018.
4. K. Simonyan and A. Zisserman, "Very deep convolutional networks for large-scale image recognition," in *Proc. Int. Conf. Learn. Represent. (ICLR)*, 2015.
5. K. He, X. Zhang, S. Ren, and J. Sun, "Deep residual learning for image recognition," in *Proc. IEEE Conf. Comput. Vis. Pattern Recognit. (CVPR)*, 2016, pp. 770–778.
6. M. Sandler, A. Howard, M. Zhu, A. Zhmoginov, and L.-C. Chen, "MobileNetV2: Inverted residuals and linear bottlenecks," in *Proc. IEEE/CVF Conf. Comput. Vis. Pattern Recognit. (CVPR)*, 2018, pp. 4510–4520.
7. L. Breiman, "Random forests," *Machine Learning*, vol. 45, no. 1, pp. 5–32, 2001.
8. C. Cortes and V. Vapnik, "Support-vector networks," *Machine Learning*, vol. 20, no. 3, pp. 273–297, 1995.
9. R. J. Medar, V. S. Rajpurohit, and S. Shweta, "Crop yield prediction using machine learning techniques," in *Proc. IEEE Int. Conf. Comput. Commun. (ICCMC)*, 2019, pp. 906–910.
10. E. Tsang, *Foundations of Constraint Satisfaction*. London, UK: Academic Press, 1993.
11. D. B. Lobell, W. Schlenker, and J. Costa-Roberts, "Climate trends and global crop production since 1980," *Science*, vol. 333, no. 6042, pp. 616–620, Jul. 2011.
12. A. J. Challinor, T. R. Wheeler, C. Garforth, P. Craufurd, and A. Kassam, "Assessing the vulnerability of food crop systems in Africa to climate change," *Climatic Change*, vol. 83, no. 3, pp. 381–399, Nov. 2007.
13. T. Chen and C. Guestrin, "XGBoost: A scalable tree boosting system," in *Proc. 22nd ACM SIGKDD Int. Conf. Knowl. Discov. Data Min.*, 2016, pp. 785–794.
14. S. Kumar, P. Sharma, and A. Patel, "Price forecasting of commodities using machine learning techniques," *Int. J. Comput. Appl.*, vol. 183, no. 15, pp. 35–40, 2021.
15. G. R. Jha and S. Sinha, "Agricultural price forecasting using neural network model: An innovative information delivery system," *Agric. Econ. Res. Rev.*, vol. 26, no. 2, pp. 229–239, 2013.
16. P. Zippenfenig, "Open-Meteo: Free weather API for open-source research," 2023. [Online]. Available: https://open-meteo.com/
17. National Bank for Agriculture and Rural Development, "Kisan Credit Card Scheme Guidelines," NABARD, Mumbai, Cir. 12/2023, 2023.
18. Ministry of Law and Justice, "The Digital Personal Data Protection Act, 2023," *The Gazette of India*, Act No. 22 of 2023, Aug. 2023.
