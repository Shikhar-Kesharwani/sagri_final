# SAGRI Complete Frontend Plan (Preserving Current Home & Editorial Style)

## 1. Goal & Scope
Complete and connect all 18 screens specified in `SAGRI_ALL_PAGES_FIGMA_CONTENT_PROMPT.md` on top of the current version without deleting or modifying `FarmerDashboard.tsx` (the 3D Season Story home page) or the existing editorial design system.

Currently, `src/main.tsx` mounts `<FarmerDashboard />` directly without the router, so clicking links on the home page (`/soil-health`, `/crop-recommendation`, `/weather`, `/disease-detection`, `/risk-prediction`, `/price-forecasting`, `/market-price`, `/schemes`, `/profile`, `/history`, `/expert-connect`) reloads the home page instead of opening the inner screens. In addition, several screens in `src/pages/` start in an empty/unpopulated state or differ slightly from the exact content in the uploaded specification.

## 2. Non-Negotiable Constraints
- **Do not modify or delete `FarmerDashboard.tsx`**, its 3D scene (`SeasonStory`), `ToolsSection`, `TodaySection`, `components/ui/primitives.tsx`, or `tailwind.config.ts`.
- **Preserve the current calm editorial visual style** (serif display headings, warm dark & paper sections, hairline dividers, outline pill actions, scroll-reveal motion, and no emojis in UI).
- **Keep `/` rendering `FarmerDashboard` eagerly** (synchronously imported, with zero loading flash) while routing all tool and inner URLs through `createBrowserRouter`.

## 3. Architecture & Routing Changes
1. **Unified Root Router (`src/main.tsx`, `src/app/routes.tsx`, `vite.config.ts`)**
   - Update `src/main.tsx` to render `<App />` (`<RouterProvider router={router} />`).
   - In `src/app/routes.tsx`, switch from `createHashRouter` to `createBrowserRouter`:
     - `/` renders `FarmerDashboard` directly via static import (`Component: FarmerDashboard`), so the home screen loads immediately and identically to how it loads now.
     - `/landing` renders the public landing page (`src/pages/Landing.tsx`).
     - `AppShell` wraps all 17 application screens plus `/profile` and `*` (`NotFound`):
       - `/dashboard` (`CommandCentre`)
       - `/disease-detection` (`DiseaseDetection`)
       - `/crop-recommendation` (`CropRecommendation`)
       - `/price-forecasting` (`PriceForecasting`)
       - `/risk-prediction` (`RiskRadar`)
       - `/soil-health` (`SoilHealth`)
       - `/weather` (`Weather`)
       - `/market-price` (`MarketRates`)
       - `/crop-calendar` (`CropCalendar`)
       - `/history` (`History`)
       - `/sell` (`SellProduce`)
       - `/buy-seeds` (`BuySeeds`)
       - `/rent-machinery` (`RentMachinery`)
       - `/expert-connect` (`ExpertConnect`)
       - `/community` (`Community`)
       - `/schemes` (`Schemes`)
       - `/loans` (`Loans`)
       - `/profile` (`Profile`)
   - Clean up the temporary `/app/index.html` multi-page entry in `vite.config.ts` and `src/app/AppShell.tsx` so all navigation links use standard router paths (`/dashboard`, `/market-price`, `/schemes`, `/weather`, etc.).

2. **Global Header & Navigation (`src/app/AppShell.tsx`, `src/app/CommandPalette.tsx`)**
   - Keep the editorial top bar matching `FarmerDashboard.tsx`:
     - Brand title `Sagri` (links back to `/`)
     - Top navigation links (`Dashboard`, `Market prices`, `Schemes`, and `All tools` full-screen numbered index covering all 17 screens)
     - Search trigger (`Search 42 crops, leaf diseases, mandi rates, govt schemes...` with `⌘K` shortcut)
     - Location & weather pill (`Bhopal, Madhya Pradesh · 28°C Partly Cloudy`)
     - Farmer profile pill (`Rajesh Kumar · 5.2 Acres (Kharif Active)` linking to `/profile`)

## 4. Screen-by-Screen Content & Behavior Alignment
Update the data modules (`src/data/*.ts`, `src/lib/*.ts`) and page components (`src/pages/*.tsx`) where needed so every screen is pre-populated and matches `SAGRI_ALL_PAGES_FIGMA_CONTENT_PROMPT.md`:

1. **Screen 1 — Farmer Command Centre (`src/pages/CommandCentre.tsx`, `/dashboard`)**
   - Welcome heading for Rajesh (without emoji), subtitle `"Central Narmada Valley Agro-Climatic Zone · Soil Moisture: Optimal (64%)"`, and primary CTAs `[Scan Leaf Disease]` and `[Get Crop Recommendations]`.
   - Weather widget showing `28.4°C · Humidity 62% · Rain Chance 15% · Wind 14 km/h`, pesticide spray advisory (`"Safe to spray pesticide today (No rainfall expected for 48 hours)"`), and 5-day mini forecast (`Mon 28°C | Tue 29°C | Wed 31°C | Thu 27°C Rain (60%) | Fri 28°C`).
   - 6 Core Feature Cards with exact spec subtitles: Plant Disease Vision, Crop Recommendation, Mandi Price Forecaster, Crop Risk Radar, Soil Health & NPK, and Government Schemes.
   - Live Mandi Commodity Rates Table with all 5 spec rows: Sharbati Wheat (Bhopal Mandi, ₹2,176/qtl, +3.4%), Basmati Paddy (Karnal Mandi, ₹3,450/qtl, +1.2%), Desi Chana (Indore Mandi, ₹5,850/qtl, -0.8%), Hybrid Tomato (Azadpur Mandi, ₹1,850/qtl, -4.8%), and Medium Cotton (Rajkot Mandi, ₹6,183/qtl, +2.1%).
   - Farm Alerts (`"Urgent: High humidity expected Thursday — monitor pulses for aphid pests"`) and Profile Completion (`"75% Complete (Missing: Soil Health Card N-P-K numbers)"`).

2. **Screen 2 — Plant Disease Detection (`src/pages/DiseaseDetection.tsx`, `/disease-detection`)**
   - Status tag `"Deep Learning Neural Diagnostic · Accuracy: 98.4%"`, drag-and-drop area (`"Supports JPG, PNG, WEBP up to 10MB"`), `[Open Camera]`, `[Upload from Gallery]`, and quick test sample chips `[Tomato Blight]`, `[Potato Scab]`, `[Apple Rust]`, `[Corn Spot]`.
   - Pre-populate the diagnosis card on initial load with **Tomato — Early Blight** (`Alternaria solani (Fungal Pathogen)`, `95.7% Confidence (High Precision)`, `Moderate Foliar Spread (Stage 2)`, `Solanaceae`, immediate field action, and diseased leaf preview).
   - 3 Treatment Tabs with exact remedies:
     - Chemical (CIBRC Approved): `Azoxystrobin 23% SC` (1.0 ml/L, 200 ml/acre, every 10–14 days) and `Mancozeb 75% WP` (2.0 g/L, 400 g/acre).
     - Organic Alternatives: `Neem Seed Kernel Extract (NSKE 5%)` (50 ml/L) and `Trichoderma viride` soil application.
     - Cultural & Prevention: 2-season non-solanaceous rotation and clean straw mulching.
   - `[Download Prescription PDF]` and `[Ask Krishi Sahayak AI About This Disease]` actions.

3. **Screen 3 — Smart Crop Recommendation (`src/pages/CropRecommendation.tsx`, `/crop-recommendation`)**
   - `[Auto-fill from Regional Benchmark (Bhopal, MP)]` button, State dropdown (`Madhya Pradesh`), Season (`Kharif`, `Rabi`, `Zaid`), Soil Type (`Alluvial`, `Black`, `Red`, `Laterite`, `Clayey`, `Sandy loam`), Irrigation (`Yes`/`No`), Greenhouse toggle, NPK & pH sliders/inputs (`N: 118`, `P: 46`, `K: 20`, `pH: 7.2`), `[Auto-detect Current Weather]`, and weather inputs (`32.0°C`, `65.0%`, `80.0 mm`).
   - Pre-populate results on initial load with the 3 ranked matches:
     - `#1 Best Match · 95.8% Suitability`: Cotton (Kharif Cash Crop), agronomic reason, expected yield `18–22 Quintals / Acre`, market rate `₹6,183 / Quintal (Rajkot Mandi)`, projected revenue `₹1,11,290 / Acre`, and potash fertilizer advice.
     - `#2 Strong Alternative · 89.8% Suitability`: Maize (Hybrid Corn), `28–32 Q/Acre`, revenue `₹68,400 / Acre`.
     - `#3 Viable Crop · 82.8% Suitability`: Blackgram (Urad Pulse), nitrogen-fixing legume note.

4. **Screen 4 — Mandi Price Forecaster (`src/pages/PriceForecasting.tsx`, `/price-forecasting`)**
   - Filters for Commodity (`Sharbati Wheat`), State (`Madhya Pradesh`), Mandi (`Bhopal Mandi`), Period (`1 Month | 3 Months | 6 Months`), and `[Generate Forecast]`.
   - 4 metric cards: Today's Modal Price (`₹2,176 / quintal`, `+₹24 today`), 6-Month Projected Peak (`₹2,295 / quintal`, `Expected in Month 5`), Government MSP Benchmark (`₹2,125 / quintal`, `+₹51 above MSP`), and Strategic Action (`HOLD CROP — Prices expected to peak in 60 days`).
   - 6-month trajectory chart (`Oct 2026` – `Mar 2027`) with `Dec 2026: Forecast ₹2,210 / qtl (Range: ₹2,175 - ₹2,245)` and the 4-row Nearby Mandi Arbitrage table (Bhopal, Sehore, Hoshangabad, Vidisha with exact distances, prices, net rates, and bag volumes).

5. **Screen 5 — Crop Failure Risk Radar (`src/pages/RiskRadar.tsx`, `/risk-prediction`)**
   - Quality pill `"XGBoost Machine Learning Model · Accuracy: 99.87%"`, inputs for `Rice (Paddy)`, `Kharif`, `100 mm`, `28°C`, `6.5 pH`, and `[Run Risk Analysis]`.
   - Central risk gauge (`10.4% Crop Failure Probability`, `LOW RISK — Crop conditions are stable and safe`), 4-factor breakdown (`8%`, `12%`, `14%`, `7%`), and PMFBY Crop Insurance card (`2% for Kharif Paddy (₹1,240 for 5 Acres)`, Sum Insured `₹62,000 per Acre`, deadline `July 31, 2026`, `[Link Land Records & Enroll in PMFBY]`).

6. **Screens 6–18 (`SoilHealth`, `Weather`, `MarketRates`, `CropCalendar`, `History`, `SellProduce`, `BuySeeds`, `RentMachinery`, `ExpertConnect`, `Community`, `Schemes`, `Loans`, `Landing`)**
   - Align exact labels, statuses, and default records with the specification:
     - `SoilHealth`: `72 / 100` ("Good Condition"), Nitrogen `75%` (Low), Phosphorus `65%` (Moderate), Potassium `80%` (Optimal), Organic Carbon `55%` (Low), pH `85%` (Optimal), and the 3 priority action items (`20 kg Urea`, `15 kg DAP`, `compost/FYM`).
     - `CropCalendar`: Wheat (`Upcoming`, `Pending`, `Pending`, `Pending`) and Rice (`Completed`, `Completed`, `Active`, `Upcoming`) default stage statuses.
     - `History`: Summary stats (`Total Predictions: 24`, `This Month: 8`, `Success Rate: 100%`) and the Oct 2026 diagnostic records with `[View Diagnostic Report]`.
     - `BuySeeds` & `RentMachinery`: Exact product/equipment specs, prices, ratings, review counts (`HD-3086` 55–60 q/acre, 245 reviews; `Tractor 50 HP` ₹500/hr or ₹3,500/day, 156 rentals; `John Deere Combine Harvester` ₹1,200/hr or ₹8,500/day; `Spraying Drone` ₹450/acre).
     - `Community`: Ramesh Yadav's mustard aphid post (with 12 replies count) and Vikram Joshi's zero-tillage wheat post.
     - `Loans`: KCC overview (`Up to ₹3 Lakhs`, `4% per annum`, `Up to 5 years`), pre-populated result (`Eligible KCC Limit: ₹3,20,000 at 4% annual interest`), and required documents checklist.
     - `Landing`: Spec headline (`"Empowering Indian Farmers with Artificial Intelligence"`), subheading, `[Explore Live Platform]` and `[Watch Video Demo]` CTAs, 4 feature cards, and the 4 platform impact stats (`54,000+`, `38`, `3,200+`, `99.8%`).

## 5. Verification Strategy
- Verify via `git diff` that `FarmerDashboard.tsx`, `components/ui/primitives.tsx`, and `tailwind.config.ts` have zero modifications.
- Run `npm run build` (`tsc -b && vite build`) to verify there are no TypeScript or bundling errors.
- Verify that `/` serves `FarmerDashboard` and that inner routes (`/dashboard`, `/disease-detection`, `/crop-recommendation`, `/price-forecasting`, `/risk-prediction`, `/soil-health`, `/weather`, `/market-price`, `/crop-calendar`, `/history`, `/sell`, `/buy-seeds`, `/rent-machinery`, `/expert-connect`, `/community`, `/schemes`, `/loans`, `/profile`, `/landing`) resolve cleanly.
