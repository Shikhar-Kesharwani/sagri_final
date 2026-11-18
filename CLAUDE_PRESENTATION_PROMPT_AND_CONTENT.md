# SAGRI — MASTER ENTERPRISE PRESENTATION: PROMPT & SLIDE CONTENT FOR CLAUDE

> **How to use this with Claude:**
> Copy and paste the **System Prompt & Design Rules** below into Claude (or Claude Artifacts / Claude Code), followed by the **Slide-by-Slide Content**. Claude will generate an identical, pixel-perfect enterprise presentation.

---

## 1. MASTER PROMPT FOR CLAUDE

```markdown
You are an elite enterprise presentation designer and frontend engineer specializing in Dark-Mode Technical & Venture Keynotes (Linear, Palantir, Vercel, Apple keynote standard).

Task: Generate a high-performance, responsive HTML/CSS presentation deck for SAGRI (Autonomous Agricultural Intelligence Platform).

CRITICAL DESIGN CONSTRAINTS:
1. STRICTLY NO EMOJIS anywhere (no 🌾, 🦠, 🧠, 🚜, 💊, etc.). Use crisp SVG geometry, monospace badges, and technical typography.
2. STRICTLY NO SPEAKER SCRIPTS or talking points on the slides. The slides must contain ONLY executive headlines, telemetry HUDs, formulas, data tables, and metrics.
3. ASPECT RATIO: 16:9 widescreen (1280px × 720px per slide, @page { size: 1280px 720px; margin: 0; }).
4. COLOR SYSTEM:
   - Base Background: Obsidian #060907 with subtle mesh radial glow and 48px grid lines
   - Card Surface: rgba(14, 22, 17, 0.85) with backdrop-filter blur(12px)
   - Accent Emerald: #10B981 / #34D399 (Vision & Core Systems)
   - Accent Amber: #F59E0B / #FBBF24 (Agronomy & Economics)
   - Accent Cyan: #06B6D4 / #38BDF8 (APMC Mandi Markets)
   - Accent Rose: #F43F5E / #FB7185 (Risk & Pathogen Alerts)
5. TYPOGRAPHY:
   - Display/Headings: 'Space Grotesk', sans-serif (700/800 weight)
   - Body/Interface: 'Plus Jakarta Sans', sans-serif (400/500/600 weight)
   - Data/Code/Telemetry: 'JetBrains Mono', monospace (500/700 weight)
6. VISUAL DENSITY:
   - High data density: real SVG curves, comparison tables, code panels, and diagnostic HUDs.
```

---

## 2. SLIDE-BY-SLIDE CONTENT & TECHNICAL DATA

---

### SLIDE 01: HERO COVER & SYSTEM TELEMETRY
- **Topbar Brand:** `SAGRI` | `AUTONOMOUS AGRICULTURAL INTELLIGENCE` | `01 / 10`
- **Kicker:** `ENTERPRISE PROJECT MASTER DECK`
- **Headline:** `The AI Operating System for 140M Indian Farmers`
- **Subtitle:** `Empowering smallholders across the end-to-end crop lifecycle: edge vision diagnostics, soil physics crop matching, predictive APMC mandi price forecasting, and climate risk radar.`
- **Tag Pills:**
  - `EDGE ONNX VISION`
  - `SOIL PHYSICS VPD`
  - `APMC PRICE ENGINE`
  - `XGBOOST RISK RADAR`
  - `WEBGL 3D DIGITAL TWIN`
- **Telemetry Strip (4 Core Metrics):**
  - **94.5%** — Vision Confidence
  - **96.0%** — Crop Precision
  - **99.87%** — Risk Model Acc
  - **<450ms** — Edge Latency
- **Right HUD Telemetry Card:**
  - Status: `LIVE CLUSTER`
  - Inference Engine: `MobileNetV2` (Float32 ONNX Runtime)
  - Training Cohort: `230,252` (Curated Records)
  - Pathogen Taxonomy: `38 Classes` (CIBRC Dosage Validated)
  - Forecast Horizon: `6 Months` (Autoregressive APMC)
  - Terminal Log:
    - `[SYSTEM_READY] FastApi ASGI on :8000 (0.0.0.0)`
    - `[ONNX_LOADED] 54,305 plant specimens weights loaded`
    - `[PHYSICS_INIT] USDA Soil Triangle + VPD compute online`

---

### SLIDE 02: THE MACRO PROBLEM LANDSCAPE
- **Topbar Brand:** `SAGRI` | `MACRO PROBLEM LANDSCAPE` | `02 / 10`
- **Kicker:** `MARKET DYNAMICS & STRUCTURAL BOTTLENECKS`
- **Headline:** `The ₹1.5 Lakh Crore Agronomic & Market Deficit`
- **Subtitle:** `Indian smallholders operate with acute information asymmetry across biological, physical, and financial dimensions.`
- **4 Problem Cards (2×2 Matrix):**
  1. **₹1.5L Cr** — *Annual Pathogen & Pest Losses* (Biological Risk)
     - Fungal, viral, and bacterial blights destroy 15–20% of national harvest annually. Without instant laboratory access, smallholders misdiagnose symptoms, resulting in toxic over-spraying or catastrophic crop failure.
     - *Benchmark:* ICAR Benchmark: 1 Extension Officer per 1,160 Farm Families.
  2. **62.4%** — *Uncalibrated Soil Sowing* (Agronomic Gap)
     - Over 60% of smallholders plant traditional monocultures without awareness of micro-soil chemistry (NPK, pH) or atmospheric Vapour Pressure Deficit (VPD), severely depressing baseline yield potential.
     - *Benchmark:* Hydraulic conductivity & sand/silt/clay physics neglected.
  3. **30–42%** — *Distress Selling at Local Mandis* (Monetization Deficit)
     - Harvest-time glut forces immediate liquidation at local APMC mandis at prices 30–42% below peak forward rates. Absence of predictive price intelligence strips farmers of all collective bargaining leverage.
     - *Benchmark:* Zero predictive visibility into 30/60/90-day wholesale arrival volume.
  4. **+73%** — *Climate Shock Frequency Since 2000* (Climate Exposure)
     - Unseasonal deluges, heatwaves, and localized drought patterns affect 4 in 10 agricultural cycles. Traditional tools lack cost-sensitive risk underwriting models capable of guiding proactive mitigation.
     - *Benchmark:* High-severity failure events systematically under-forecasted.
- **Strategic Summary Strip:**
  - *The Strategic Need:* A singular, unified digital operating system combining edge computer vision, bio-physical soil modeling, and forward-looking economic forecasting.

---

### SLIDE 03: THREE-TIER INTELLIGENCE FRAMEWORK
- **Topbar Brand:** `SAGRI` | `SYSTEMS BLUEPRINT` | `03 / 10`
- **Kicker:** `CORE ENGINEERING TOPOLOGY`
- **Headline:** `The Three-Tier Intelligence Framework`
- **Subtitle:** `Separation of concerns across edge computer vision, bio-physical agronomy, and forward market underwriting.`
- **3 Architecture Columns:**
  - **Tier 01 · Visual Diagnosis (Edge Vision Subsystem):**
    - Inference Engine: MobileNetV2 quantized Float32 running via ONNX Runtime for low-spec Android devices.
    - Taxonomy: 38 distinct crop pathogen classes across 14 commercial plant families.
    - Test-Time Augmentation: 5-pass ensemble (H-Flip, Luminance ±15%, Blur) for calibrated confidence scoring.
    - Remediation Pipeline: Direct mapping to CIBRC-approved pesticide and bio-organic dosages.
    - Tech: `ONNX RUNTIME` · `MOBILENETV2` · `CIBRC DB`
  - **Tier 02 · Agronomy Engine (Bio-Physical Soil Brain):**
    - Soil Physics Engine: Sand/Silt/Clay ternary decomposition calculating hydraulic retention.
    - VPD Calculation: Real-time atmospheric Vapour Pressure Deficit evaluating plant transpiration stress.
    - Decision Tree: Random Forest scoring 22 regional crops across 14 bio-chemical soil vectors.
    - Constraint Engine: ICAR agro-climatic boundaries and pH buffer overrides.
    - Tech: `SCIKIT-LEARN` · `USDA PHYSICS` · `ICAR RULES`
  - **Tier 03 · Macro Economics (Market & Risk Underwriting):**
    - Price Forecaster: Autoregressive APMC time-series model predicting mandi spot rates up to 6 months.
    - XGBoost Risk Radar: Calibrated classifier predicting catastrophic climate and market vulnerabilities.
    - Cohort Depth: 230,252 historical agricultural records across 28 Indian farming districts.
    - LLM Reasoning: Multilingual conversational agronomist powered by Google Gemini 1.5 Pro.
    - Tech: `XGBOOST 2.1` · `STATSMODELS` · `GEMINI PRO`
- **Bottom Flow Banner:**
  - `Client Edge: React 18 + Three.js` ⟶ `FastAPI Gateway: Python 3.13 ASGI` ⟶ `ML Pipeline: ONNX + RF + XGBoost` ⟶ `Intelligence Output: Actionable Farmer Action`

---

### SLIDE 04: EDGE-OPTIMIZED LEAF PATHOGEN INFERENCE
- **Topbar Brand:** `SAGRI` | `MODEL DEEP DIVE · VISION` | `04 / 10`
- **Kicker:** `COMPUTER VISION DIAGNOSTICS`
- **Headline:** `Edge-Optimized Leaf Pathogen Inference`
- **Subtitle:** `Quantized MobileNetV2 architecture with 5-step Test-Time Augmentation (TTA) achieving 94.5% precision.`
- **Left Scan HUD Card:**
  - Reticle Label: `SPECIMEN #88241 · SOLANUM LYCOPERSICUM` | `PATHOGEN DETECTED`
  - Primary Finding: `Tomato Early Blight`
  - Inference Confidence: `94.52%`
  - Inference Latency: `384 ms`
  - **Probability Distribution:**
    - Early Blight (*Alternaria solani*): **94.5%** [High bar]
    - Late Blight (*Phytophthora infestans*): **3.8%**
    - Septoria Leaf Spot: **1.2%**
    - Healthy Leaf Baseline: **0.5%**
  - **Pipeline Steps:** `224x224 RGB Camera Capture` ⟶ `5x TTA Stack` ⟶ `MobileNetV2 ONNX FP32` ⟶ `CIBRC Match DB`
- **Right Card: Regulatory Chemical & Organic Remediation:**
  - *Context:* Model predictions interface directly with Central Insecticides Board & Registration Committee (CIBRC) standards.
  - **Chemical Intervention:** Mancozeb 75% WP @ 2.5 g / Litre of water (Apply at 10-day intervals upon first lesion; pre-harvest interval: 7 days).
  - **Bio-Organic Alternative:** Trichoderma viride (1% WP) @ 5 g / Litre (Bio-antagonist foliar spray prevents spore germination without residue).
  - Footer Meta: `TRAINING CORPUS: 54,305 Specimens` | `TAXONOMY: 38 Leaf Classes`

---

### SLIDE 05: BIO-PHYSICAL AGRONOMY & VPD OPTIMIZATION
- **Topbar Brand:** `SAGRI` | `MODEL DEEP DIVE · AGRONOMY` | `05 / 10`
- **Kicker:** `BIO-PHYSICAL AGRONOMY INTELLIGENCE`
- **Headline:** `Soil Texture Physics & VPD Optimization`
- **Subtitle:** `Combining USDA ternary soil dynamics with atmospheric vapour pressure deficit across a 22-crop Random Forest.`
- **Left Physics & Formula Panel:**
  - **Exact VPD Formula:**
    $$VPD = e_s(T) \times \left(1 - \frac{RH}{100}\right)$$
    $$e_s(T) = 0.6108 \times \exp\left[\frac{17.27 \times T}{T + 237.3}\right]$$
  - *Physics Context:* Quantifies atmospheric moisture extraction force on foliage. Paired with hydraulic conductivity from ternary Sand/Silt/Clay fractions.
  - **14-Factor Input Matrix:**
    - Nitrogen: 90 kg/ha
    - Phosphorus: 42 kg/ha
    - Potassium: 43 kg/ha
    - Soil pH: 6.5 (Loam)
    - Temperature: 20.8 °C
    - Humidity: 82.0 %
    - Annual Rainfall: 202.9 mm
    - Calculated VPD: 0.44 kPa
    - Soil Texture: Sandy Loam
- **Right Ranked Recommendation Output:**
  - **#01: Rice (*Oryza sativa*) — 96.0% Suitability** (Optimal pH: 5.5-7.0 · High water retention · Clay fraction supported)
  - **#02: Jute (*Corchorus olitorius*) — 88.4% Suitability** (High humidity tolerance · Warm vegetative period)
  - **#03: Maize (*Zea mays*) — 78.1% Suitability** (Moderate nitrogen demand · Rapid root establishment)
  - Footer Meta: `EVALUATED CROPS: 22 Cultivars` | `ACCURACY: 96.0% Top Match`

---

### SLIDE 06: PRICE FORECASTING & XGBOOST RISK RADAR
- **Topbar Brand:** `SAGRI` | `MODEL DEEP DIVE · ECONOMICS` | `06 / 10`
- **Kicker:** `PREDICTIVE APMC & UNDERWRITING ENGINE`
- **Headline:** `Price Forecasting & XGBoost Risk Radar`
- **Subtitle:** `Overcoming severe class imbalance (8.0% → 86.7% recall) across 230,252 historical agricultural records.`
- **Left Panel: Autoregressive Mandi Price Engine:**
  - Category: `35 Mandi Crops`
  - Horizon: `6-Month APMC Spot Price Trajectory`
  - Visualization: Financial trajectory SVG curve starting at base, rising across months with projected peak badge: `₹2,450 / Qtl (+18%)`.
  - Context: Deconstructs seasonal harvest arrival compression from structural wholesale demand, giving farmers forward price negotiation signals.
- **Right Panel: XGBoost High-Sensitivity Classifier:**
  - Metric Hero: **99.87% Overall Precision** | **100% ROC-AUC**
  - **Class Imbalance Optimization Table:**
    | Configuration State | Risk Precision | True Risk Recall | Failure Sensitivity |
    |---|---|---|---|
    | Default Unweighted | 99.2% | 8.0% | Poor (Blind to Crises) |
    | **SMOTE + Cost-Tuned** | **99.87%** | **86.7%** | **Superior Protection** |
  - Context: Cost-sensitive objective penalty forces the gradient booster to prioritize rare catastrophic climate events over majority baseline conditions.
  - Footer Meta: `TRAINED CORPUS: 230,252 Records` | `ROC-AUC: 1.000`

---

### SLIDE 07: 3D SEASON STORY ENGINE
- **Topbar Brand:** `SAGRI` | `SPATIAL UX DESIGN` | `07 / 10`
- **Kicker:** `WEBGL SPATIAL STORYTELLING`
- **Headline:** `The 3D Season Story Engine`
- **Subtitle:** `Hardware-accelerated Three.js r167 viewport simulating biological crop development through scroll-driven interaction.`
- **Left Viewport Schematic:**
  - Status: `WebGL 2.0 Viewport` | `60.0 FPS LOCKED`
  - SVG Visual: Isometric perspective ground grid with depth lines and furrow nodes labeled `416 INSTANCED FURROWS`.
  - Telemetry: `DRAW CALLS: < 12` | `GPU OVERHEAD: < 4%` | `MEMORY: 32MB VRAM`
- **Right Chapter Stepper (5-Phases):**
  - **CH 01: Bare Earth & Soil Physics** — Visualizes seedbed moisture, soil texture classes, and baseline compaction metrics.
  - **CH 02: Germination & Root Genesis** — Simulates hydraulic water uptake, VPD transpiration, and subterranean root network expansion.
  - **CH 03: Vegetative Canopy & Vision Surveillance (ACTIVE)** — 416 instanced stalks sway under wind physics. Edge vision AI monitors for foliar blights.
  - **CH 04: Golden Hour Harvest Window** — Calculates optimum combine harvester scheduling based on grain moisture and rainfall forecasts.
  - **CH 05: Mandi Logistics & Liquidation** — Connects field yield directly to APMC price curves for maximum farmer monetization.

---

### SLIDE 08: THE 12-MODULE AGRICULTURAL ECOSYSTEM
- **Topbar Brand:** `SAGRI` | `PLATFORM BREADTH` | `08 / 10`
- **Kicker:** `MODULAR OPERATIONS SUITE`
- **Headline:** `The 12-Module Agricultural Ecosystem`
- **Subtitle:** `Comprehensive end-to-end operational software powering biological, marketplace, and financial workflows.`
- **4 Operational Pillars (3 Modules Each):**
  1. **Field Science (01 · Agronomy) — `STATUS: DEPLOYED`:**
     - Soil NPK Analyzer `[Lab Grade]` — Lab-grade macro/micronutrient mapping and fertilizer prescription.
     - Hyperlocal Weather `[7-Day]` — 7-day micro-forecasts with precipitation and spray windows.
     - AI Crop Calendar `[Dynamic]` — Dynamic phenological stage tracking tailored to sowing date.
  2. **Commerce & Assets (02 · Marketplace) — `STATUS: ACTIVE`:**
     - Sell Crops Engine `[Direct]` — Direct mandi connect with multi-market price arbitrage.
     - Buy Seeds & Inputs `[Certified]` — Certified supplier marketplace with verified germination ratings.
     - Rent Machinery `[GPS]` — Tractor and harvester sharing with GPS telemetry tracking.
  3. **Capital & Policy (03 · Finance) — `STATUS: INTEGRATED`:**
     - KCC Loan Connect `[Instant]` — Kisan Credit Card automated eligibility and bank underwriting.
     - Government Schemes `[200+]` — 200+ Central and State subsidy rules matching engine.
     - Decision Audit Log `[Immutable]` — Immutable chronological farm journal recording all AI advice.
  4. **Advisory & Intel (04 · Support) — `STATUS: LIVE`:**
     - Gemini AI Agronomist `[5 Lang]` — Multilingual conversational advisor across 5 Indic languages.
     - Community Exchange `[Regional]` — Regional grower network for peer-to-peer agronomic intelligence.
     - Live APMC Mandi Ticker `[500+]` — Real-time price feeds across 500+ national wholesale mandis.

---

### SLIDE 09: MODERN CLOUD & EDGE INFRASTRUCTURE
- **Topbar Brand:** `SAGRI` | `ENGINEERING INFRASTRUCTURE` | `09 / 10`
- **Kicker:** `PRODUCTION ENGINEERING SPECIFICATIONS`
- **Headline:** `Modern Cloud & Edge Infrastructure`
- **Subtitle:** `High-throughput asynchronous FastAPI backend running on Python 3.13 alongside React 18 & Three.js.`
- **Left Code Terminal (`sagri_backend_core.py` · Python 3.13):**
  ```python
  # FastAPI Asynchronous Inference Routing
  from fastapi import FastAPI, Depends
  import onnxruntime as ort
  import xgboost as xgb

  app = FastAPI(title="SAGRI ML Gateway", version="2.4.0")

  # Zero-latency in-memory model execution
  ort_session = ort.InferenceSession("models/mobilenetv2_38cls.onnx")
  risk_booster = xgb.Booster(model_file="models/risk_radar_v2.json")

  # Production Health probe: 200 OK < 2ms
  @app.get("/")
  async def root_health():
      return {"status": "online", "engine": "FastAPI"}
  ```
- **Right Stack Categories:**
  - **Client-Side Architecture:** `React 18`, `TypeScript`, `Tailwind CSS`, `Three.js r167`, `Framer Motion`, `Lucide Icons`
  - **Machine Learning Engines:** `ONNX Runtime 1.19`, `Scikit-Learn 1.5`, `XGBoost 2.1`, `Statsmodels AR`, `Google Gemini 1.5`
  - **Multi-Lingual Localization:** `Hindi`, `Punjabi`, `Telugu`, `Bengali`, `Tamil`, `Voice Web Speech API`
  - **Active Service Topology & Ports:** `:8000 ML API (FastAPI)`, `:5173 Classic UI`, `:5174 Enterprise UI`

---

### SLIDE 10: SCALING FROM VALIDATION TO 10M SMALLHOLDERS
- **Topbar Brand:** `SAGRI` | `COMMERCIAL VISION` | `10 / 10`
- **Kicker:** `STRATEGIC ROADMAP & MARKET HORIZON`
- **Headline:** `Scaling from Validation to 10 Million Smallholders`
- **Subtitle:** `Capitalizing on validated model precision to transform India's primary production and market liquidity.`
- **Left Roadmap Timeline:**
  - **Q1 2025 — 5-State Operational Pilot Launch:** Deployment across Punjab, Haryana, UP, MP, and Maharashtra targeting 50,000 active wheat and rice farmers.
  - **Q3 2025 — Sentinel-2 Multispectral Satellite Integration:** Automated 10-meter field boundary detection, NDVI biomass vigor tracking, and micro-irrigation deficit alerts.
  - **Q1 2026 — Autonomous Drone Fleet Spray API:** Telemetry links to commercial drone spraying services with variable-rate pesticide delivery calculated by SAGRI Vision.
  - **Q3 2026 — 10M Smallholders · 22 Indian Languages:** Protecting ₹500 Cr+ in annual agricultural yield value while underwriting ₹1,200 Cr in low-interest institutional KCC credit.
- **Right Metric Scorecard & Market TAM:**
  - **94.5%** — Vision Confidence
  - **96.0%** — Crop Precision
  - **99.87%** — Risk Model Acc
  - **<450ms** — Edge Latency
  - **Market TAM Strip:**
    - `$34B` — Indian Agtech TAM
    - `$12B` — Serviceable SAM
    - `10M` — Farmers Target
  - **Enterprise Mission Banner:**
    `"Every Acre Monitored. Every Harvest Protected. Every Farmer Empowered."`
    *SAGRI CORE ENTERPRISE MANDATE*
```
