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

### 2. Experimental Results & Ablation Analysis

#### Model Performance Across Pipelines
| Pipeline | Primary Metric | Observed Value |
| :--- | :--- | :--- |
| **Disease Vision (ONNX)** | Top-1 Field Accuracy | 73.4% |
| **Disease Vision (ONNX)** | CPU Inference Latency | 112 ms |
| **Disease Vision (ONNX)** | Model Storage Size | 16.2 MB |
| **Crop Recommendation** | 22-Crop Test Accuracy | 99.3% |
| **Risk Radar (Hybrid)** | Out-of-Time ROC-AUC | 0.892 |
| **Mandi Forecasting** | 30-Day Mean Abs. Pct. Error | 8.35% |
| **Backend API (FastAPI)** | P50 Response Time | 48 ms |
| **SQLite WAL** | Write Transaction Speed | 1,840 tx/s |

#### Systematic Ablation Study
| Configuration | Observed Result |
| :--- | :--- |
| **Full SAGRI Engine** | ROC-AUC 0.892, MAPE 8.35%, 0% invalid crops |
| **w/o Constraint Layer** | 15.8% of recommendations violate ICAR limits |
| **w/o Physical Shortfall** | Risk ROC-AUC drops from 0.892 to 0.871 |
| **w/o CFPI Price Deflation** | Price forecast MAPE rises from 8.35% to 14.2% |
| **w/o Test-Time Augmentation** | Foliar field accuracy falls from 73.4% to 71.8% |
| **w/o SQLite WAL Mode** | Concurrency locks emerge at 15+ parallel writes |

---

### 3. Transparent Handling of Model Edge Cases
During validation, we noted an informative edge case: the PlantVillage dataset contains no diseased blueberry leaves, indexing only `Blueberry___healthy`. When presented with visibly diseased blueberry foliage, our vision model classified the leaf as healthy with a low softmax confidence score of 26.3%. 

Because SAGRI avoids artificial confidence inflation, this low score exposes the model's ambiguity rather than masking it. We are implementing an automatic rule: whenever a "healthy" classification arrives with under 45% confidence, the system flags the leaf as *"Inconclusive / Suspected Abiotic Stress"* to prevent giving false reassurance to growers.
