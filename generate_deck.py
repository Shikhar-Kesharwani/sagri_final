import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_sagri_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color Palette
    C_BG_DARK = RGBColor(16, 24, 18)       # Deep earthy forest
    C_BG_LIGHT = RGBColor(248, 249, 246)   # Warm paper
    C_CARD_LIGHT = RGBColor(255, 255, 255) # Pure white
    C_CARD_DARK = RGBColor(26, 38, 29)     # Subtle card dark
    C_PRIMARY = RGBColor(28, 92, 53)       # Agro Green
    C_ACCENT_WHEAT = RGBColor(201, 148, 54)# Wheat Gold
    C_TEXT_LIGHT = RGBColor(240, 244, 241) # Light text
    C_TEXT_DARK = RGBColor(20, 30, 22)     # Charcoal forest
    C_TEXT_MUTED = RGBColor(100, 115, 105) # Muted gray-green
    C_BORDER_LIGHT = RGBColor(225, 232, 226)

    def add_bg(slide, dark=False):
        shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        shape.fill.solid()
        shape.fill.fore_color.rgb = C_BG_DARK if dark else C_BG_LIGHT
        shape.line.color.rgb = C_BG_DARK if dark else C_BG_LIGHT
        return shape

    def add_header(slide, eyebrow, title, dark=False):
        # Eyebrow tag
        tb_eye = slide.shapes.add_textbox(Inches(0.9), Inches(0.55), Inches(11.5), Inches(0.4))
        p_eye = tb_eye.text_frame.paragraphs[0]
        p_eye.text = eyebrow.upper()
        p_eye.font.size = Pt(11)
        p_eye.font.bold = True
        p_eye.font.color.rgb = C_ACCENT_WHEAT if dark else C_PRIMARY
        
        # Main Title
        tb_title = slide.shapes.add_textbox(Inches(0.9), Inches(0.85), Inches(11.5), Inches(0.8))
        p_title = tb_title.text_frame.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(26)
        p_title.font.bold = True
        p_title.font.color.rgb = C_TEXT_LIGHT if dark else C_TEXT_DARK

    def add_card(slide, left, top, width, height, title, subtitle, bullets, dark=False, highlight=False):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(left), Inches(top), Inches(width), Inches(height))
        card.fill.solid()
        card.fill.fore_color.rgb = (C_CARD_DARK if dark else (RGBColor(254, 250, 242) if highlight else C_CARD_LIGHT))
        card.line.color.rgb = (C_ACCENT_WHEAT if highlight else (RGBColor(45, 65, 50) if dark else C_BORDER_LIGHT))
        card.line.width = Pt(1.5 if highlight else 1)

        # Title
        tb = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.25), Inches(width - 0.6), Inches(0.5))
        p = tb.text_frame.paragraphs[0]
        p.text = title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = C_ACCENT_WHEAT if (dark or highlight) else C_PRIMARY

        # Subtitle
        if subtitle:
            tb_sub = slide.shapes.add_textbox(Inches(left + 0.3), Inches(top + 0.7), Inches(width - 0.6), Inches(0.4))
            p_sub = tb_sub.text_frame.paragraphs[0]
            p_sub.text = subtitle
            p_sub.font.size = Pt(12)
            p_sub.font.bold = True
            p_sub.font.color.rgb = C_TEXT_LIGHT if dark else C_TEXT_DARK

        # Bullets
        bullet_top = top + (1.15 if subtitle else 0.8)
        tb_bullets = slide.shapes.add_textbox(Inches(left + 0.3), Inches(bullet_top), Inches(width - 0.6), Inches(height - (bullet_top - top) - 0.3))
        tf = tb_bullets.text_frame
        tf.word_wrap = True
        for i, b in enumerate(bullets):
            p_b = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
            p_b.text = f"•  {b}"
            p_b.font.size = Pt(12)
            p_b.font.color.rgb = C_TEXT_LIGHT if dark else C_TEXT_MUTED
            p_b.space_after = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE (Dark Premium)
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    add_bg(s1, dark=True)

    # Brand Title
    tb1 = s1.shapes.add_textbox(Inches(1.2), Inches(2.0), Inches(10.5), Inches(3.5))
    tf1 = tb1.text_frame
    
    p0 = tf1.paragraphs[0]
    p0.text = "SAGRI · SMART AGRICULTURE INTELLIGENCE"
    p0.font.size = Pt(14)
    p0.font.bold = True
    p0.font.color.rgb = C_ACCENT_WHEAT
    p0.space_after = Pt(14)

    p1 = tf1.add_paragraph()
    p1.text = "Decide What to Sow, When to Spray, and Where to Sell."
    p1.font.size = Pt(40)
    p1.font.bold = True
    p1.font.color.rgb = C_TEXT_LIGHT
    p1.space_after = Pt(16)

    p2 = tf1.add_paragraph()
    p2.text = "A complete AI & Machine Learning operating system built for India's 140M smallholder farmers.\nUnified Computer Vision, Predictive Agro-Economics, 3D Soil Physics & Indic Natural Language."
    p2.font.size = Pt(16)
    p2.font.color.rgb = RGBColor(170, 190, 175)

    # Pill tags
    tags = ["38 Plant Diseases (ONNX)", "22-Crop ML Recommender", "6-Month Mandi Forecaster", "XGBoost Risk Radar", "5 Indic Languages"]
    for i, tag in enumerate(tags):
        tag_box = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.2 + i * 2.15), Inches(5.8), Inches(2.05), Inches(0.45))
        tag_box.fill.solid()
        tag_box.fill.fore_color.rgb = RGBColor(28, 45, 33)
        tag_box.line.color.rgb = C_ACCENT_WHEAT
        tag_box.line.width = Pt(1)
        p = tag_box.text_frame.paragraphs[0]
        p.alignment = PP_ALIGN.CENTER
        p.text = tag
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = C_TEXT_LIGHT

    # -------------------------------------------------------------
    # SLIDE 2: THE PROBLEM & AGRICULTURAL CRISIS
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_bg(s2)
    add_header(s2, "Ground Reality & Industry Challenges", "The Four Vulnerabilities Threatening Indian Smallholders")

    add_card(s2, 0.9, 1.8, 2.7, 5.0, "₹1.5 Lakh Cr Loss", "Misdiagnosed Crop Disease", [
        "Farmers rely on agrochemical retailers with conflicting sales incentives.",
        "Overuse of broad-spectrum fungicides destroys soil microbiomes.",
        "Crucial 48-hour diagnostic window missed before spore outbreak.",
        "Lack of CIBRC dosage guidelines leads to pesticide resistance."
    ])

    add_card(s2, 3.8, 1.8, 2.7, 5.0, "Sub-Optimal Sowing", "Static Regional Tradition", [
        "Farmers sow crops based on tradition, not soil stoichiometry or VPD.",
        "Nutrient lockout occurs due to unmonitored soil pH shifts.",
        "Zero adaptation to shifting monsoon onset and groundwater depletion.",
        "Over-application of Urea causes severe osmotic shock & fertilizer burn."
    ])

    add_card(s2, 6.7, 1.8, 2.7, 5.0, "Distress Selling", "Information Asymmetry in Mandis", [
        "Middlemen exploit farmers who lack forward price trajectory insights.",
        "Peak harvest glut forces sale at 30-40% below MSP.",
        "No transparency in APMC market arrivals or regional yard spreads.",
        "Unpredictable post-harvest transportation and storage costs."
    ])

    add_card(s2, 9.6, 1.8, 2.7, 5.0, "Climate Volatility", "Compound Heat & Drought Risk", [
        "Single extreme heat event or 10-day dry spell triggers 80%+ yield loss.",
        "No dynamic, hyper-local risk assessment model before sowing.",
        "Lack of integrated credit (KCC) and crop insurance (PMFBY) adoption.",
        "Language and digital literacy barriers to central government schemes."
    ], highlight=True)

    # -------------------------------------------------------------
    # SLIDE 3: THE SAGRI SOLUTION ARCHITECTURE
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_bg(s3)
    add_header(s3, "Product Architecture & Innovation", "SAGRI: Integrated End-to-End Agronomic Intelligence")

    add_card(s3, 0.9, 1.8, 3.6, 5.0, "1. Edge Diagnostic Vision", "Instant Leaf Pathology (<450ms)", [
        "ONNX MobileNetV2 runtime with Test-Time Augmentation (TTA).",
        "Diagnoses 38 fungal, bacterial, viral and nutrient deficiency classes.",
        "Calibrated confidence scoring prevents false negatives on clear leaves.",
        "Generates dual CIBRC chemical dosage & organic bio-control protocols."
    ])

    add_card(s3, 4.8, 1.8, 3.6, 5.0, "2. Soil & Microclimate AI", "22 Crops & Stress Detection", [
        "Random Forest multi-variable mapping (N-P-K, pH, VPD, Soil texture).",
        "ICAR regional hard exclusions block unviable crops (e.g., coconut in Punjab).",
        "XGBoost Risk Radar trained on 230,252 historical agricultural records.",
        "Quantifies dynamic yield shortfalls from thermal, rainfall & pH anomalies."
    ], highlight=True)

    add_card(s3, 8.7, 1.8, 3.6, 5.0, "3. Fair Markets & Community", "MSP+ Commerce & Conversational AI", [
        "Autoregressive 6-month APMC price projection with seasonal dips.",
        "Direct farmer-to-miller produce marketplace eliminating middlemen.",
        "Subsidized seed store & tractor/drone machinery bookings.",
        "Krishi Sahayak conversational expert in 5 Indic languages."
    ])

    # -------------------------------------------------------------
    # SLIDE 4: DEEP DIVE — PLANT DISEASE VISION (ONNX)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_bg(s4)
    add_header(s4, "AI Model Deep Dive · Computer Vision", "38-Class Leaf Disease Pathology with CIBRC Clinical Remedies")

    add_card(s4, 0.9, 1.8, 5.6, 5.0, "Model Architecture & Pipeline", "MobileNetV2 + Test-Time Augmentation (TTA)", [
        "Trained on 54,305 curated PlantVillage agricultural specimens.",
        "Exported to ONNX runtime for ultra-low latency (<450ms inference).",
        "Test-Time Augmentation (TTA) with 4-way rot/flip spatial voting.",
        "Confidence calibration: Scaled margin dominance over 38-class softmax.",
        "Rigorous non-leaf & noise guardrails prevent hallucinated diagnoses.",
        "Zero reliance on cloud GPU instances — runs cost-effectively on CPU."
    ])

    add_card(s4, 6.8, 1.8, 5.6, 5.0, "Clinical Agronomic Output", "Pathology Knowledge Base Integration", [
        "Specimen Diagnosis: Identifies pathogen species (e.g. Xanthomonas, Alternaria).",
        "Severity Classification: Low, Moderate, High, or Critical threat tier.",
        "Immediate Action: Cultural practices (defoliation, ditch sanitization).",
        "Chemical Treatment: CIBRC-approved fungicides/bactericides with exact dilution (e.g. Copper Oxychloride 50% WP @ 2.5g/L).",
        "Organic Protocol: Trichoderma viride, Pseudomonas fluorescens, Neem oil.",
        "Differential Diagnosis: Top-3 candidate probabilities with confidence tags."
    ], highlight=True)

    # -------------------------------------------------------------
    # SLIDE 5: DEEP DIVE — CROP RECOMMENDATION & SOIL PHYSICS
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_bg(s5)
    add_header(s5, "AI Model Deep Dive · Soil & Microclimate", "22-Crop Random Forest Engine with Soil Physics & VPD Mapping")

    add_card(s5, 0.9, 1.8, 5.6, 5.0, "Agronomic Feature Engineering", "Beyond Standard NPK Lookups", [
        "Soil Physical Fractions: Maps 7 textures (Sandy, Silt, Black, Clay, Laterite, Red) into Sand%, Silt%, Clay% tri-axial matrix.",
        "Vapor Pressure Deficit (VPD): Calculates atmospheric transpirational pull:",
        "    SVP = 0.61078 * exp((17.27 * T) / (T + 237.3))",
        "    VPD = SVP * (1 - (Humidity / 100))",
        "Stoichiometry: Computes N:P and N:K nutrient balance ratios.",
        "Irrigation Simulation: Simulates yield uplift under flood or drip delivery."
    ])

    add_card(s5, 6.8, 1.8, 5.6, 5.0, "ICAR Regional Zoning & Guardrails", "Preventing Agronomic Disasters", [
        "Hard State Exclusions: Enforces ICAR agro-climatic boundaries (e.g. Coconut/Coffee excluded from Punjab; Apple excluded from Kerala).",
        "Lethal Biological Thresholds: Rejects toxic inputs (Temp >45°C or <5°C; pH <4.0 or >9.0; Nutrients >300 kg/ha).",
        "Calibrated Suitability: Top recommendation achieves 92.5% - 97.8% score.",
        "Actionable Prescription: Compares farm soil against crop-specific ideal NPK and outputs exact kg/ha deficit top-up."
    ], highlight=True)

    # -------------------------------------------------------------
    # SLIDE 6: DEEP DIVE — PRICE FORECASTING & RISK RADAR
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_bg(s6)
    add_header(s6, "AI Model Deep Dive · Predictive Agro-Economics", "Mandi Price Forecaster & XGBoost Crop Failure Radar")

    add_card(s6, 0.9, 1.8, 5.6, 5.0, "Mandi Price Forecasting Model", "Autoregressive Time-Series Regression", [
        "Trained on multi-year APMC wholesale transaction logs across 20 Indian states.",
        "Incorporates historical lag prices, monthly seasonality & harvest arrival cycles.",
        "Outputs 6-month projected price trajectory with min/max confidence bounds.",
        "Connects to MSP benchmark database to advise farmers: 'Hold' vs 'Sell Now'.",
        "Instant APMC Payout Calculator: Deducts mandi cess, handling & transport to compute net bank realization."
    ])

    add_card(s6, 6.8, 1.8, 5.6, 5.0, "Crop Failure Risk Radar", "XGBoost on 230,252 Production Records", [
        "Trained on Ministry of Agriculture dataset (99.87% accuracy, 100% ROC-AUC).",
        "Continuous Multi-Stress Synthesis: Calculates real-time yield shortfalls:",
        "    • Water Deficit: Crop requirement vs actual rainfall",
        "    • Thermal Exposure: Optimal vegetative range vs extreme temperature",
        "    • Soil Reaction: Deviation from ideal pH window",
        "Blended Risk Score: Dynamic sensitivity (Low 8.0% -> Critical 86.7%).",
        "Prescribes specific mitigation strategies (mulching, protective irrigation)."
    ], highlight=True)

    # -------------------------------------------------------------
    # SLIDE 7: INTERACTIVE 3D SEASON STORY & UI INNOVATION
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_bg(s7)
    add_header(s7, "User Experience & Engagement", "The 3D Season Story: Visualizing the Living Agricultural Cycle")

    add_card(s7, 0.9, 1.8, 3.6, 5.0, "Chapter 1 & 2: Sowing & Rain", "Soil Physics & Monsoon Onset", [
        "Interactive 3D Three.js rendering of subsoil, furrow, roots, and topsoil.",
        "Before Sowing: Real-time NPK radar charts and Soil Health Card entry.",
        "Monsoon Chapter: Dynamic rainfall particle physics and crop matching.",
        "Smooth scroll camera animation tracking soil to sky transition."
    ])

    add_card(s7, 4.8, 1.8, 3.6, 5.0, "Chapter 3: Canopy Growth", "Foliar Inspection & Diagnosis", [
        "Sprouting vegetation transforms from green shoots to mature canopy.",
        "Laser pathology scanning animation highlights localized leaf infection.",
        "Seamless CTA directing farmers to Plant Disease Vision.",
        "Open-Meteo live telemetry feeds real-time sun position & sky gradient."
    ], highlight=True)

    add_card(s7, 8.7, 1.8, 3.6, 5.0, "Chapter 4 & 5: Harvest & Market", "Ripe Heads & Fair Settlement", [
        "Golden wheat/paddy heads mature under warm autumn sunlight.",
        "Live APMC mandi board comparing modal rates across nearby yards.",
        "Direct Sell Crops marketplace listing harvest at MSP+ rates.",
        "One-click booking for harvesters, tractors, and spraying drones."
    ])

    # -------------------------------------------------------------
    # SLIDE 8: THE COMPLETE PLATFORM ECOSYSTEM
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_bg(s8)
    add_header(s8, "Ecosystem & Daily Farm Operations", "12 Specialized Agronomic Tools in One Unified Portal")

    add_card(s8, 0.9, 1.8, 2.7, 5.0, "Soil & Weather", "Scientific Field Ops", [
        "Soil Health Assessment: NPK radar & per-acre fertilizer plan.",
        "Hyperlocal Weather: 7-day outlook & 24h temp/rain curves.",
        "Spray Window Advisory: Safe spraying intervals to prevent runoff.",
        "AI Crop Calendar: Stage-by-stage sowing to harvest milestones."
    ])

    add_card(s8, 3.8, 1.8, 2.7, 5.0, "Financial Aid & Credit", "Government Linkage", [
        "Govt Schemes: PM-KISAN, PMFBY, Soil Card, e-NAM portal checks.",
        "Eligibility Checker: 4-point questionnaire with official links.",
        "KCC Loan Calculator: 4% subvented credit limit up to ₹3,00,000.",
        "Scale of Finance: District-specific cultivation & post-harvest breakdown."
    ])

    add_card(s8, 6.7, 1.8, 2.7, 5.0, "Fair Marketplace", "Zero-Commission Commerce", [
        "Sell Crops: Direct miller & exporter connection with grade premiums.",
        "Buy Certified Seeds: NSC/ICAR verified varieties with cart checkout.",
        "Rent Machinery: Nearby tractors, rotavators, spray drones & operators.",
        "APMC Yard Tracker: Real-time price spreads and distance sorting."
    ])

    add_card(s8, 9.6, 1.8, 2.7, 5.0, "Social & Advisory", "Indic Accessibility", [
        "Krishi Sahayak: 24/7 AI agronomist persona chat in 5 Indic languages.",
        "Voice Assistant: Speech-to-text queries for low-literacy farmers.",
        "Farmer Community: Peer-to-peer Q&A, harvest photos & agronomic advice.",
        "Audit History: Persistent log of every disease scan and forecast."
    ], highlight=True)

    # -------------------------------------------------------------
    # SLIDE 9: TECHNICAL STACK & ARCHITECTURE
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_bg(s9)
    add_header(s9, "Engineering & Performance", "High-Throughput, Resilient Full-Stack Architecture")

    add_card(s9, 0.9, 1.8, 3.6, 5.0, "FastAPI High-Performance Core", "Python 3.13 Asynchronous Backend", [
        "Sub-50ms endpoint latencies via asynchronous ASGI routing.",
        "Dual-schema fallback: Supports multipart files and base64 payloads.",
        "Automated biological input guardrails reject toxic extremes.",
        "Embedded multi-persona prompt orchestration for agronomic chat.",
        "Stateless ONNX runtime and cached Scikit-Learn/XGBoost models."
    ])

    add_card(s9, 4.8, 1.8, 3.6, 5.0, "Modern Frontend Stack", "React 18 · TypeScript · Vite", [
        "100% strict TypeScript typing with zero runtime errors.",
        "Three.js & React Three Fiber for 60fps 3D canvas rendering.",
        "Recharts responsive vector visualization for NPK & Mandi curves.",
        "Framer Motion smooth scroll-driven and spring physics transitions.",
        "Tailwind CSS custom design system with warm paper & forest palettes."
    ], highlight=True)

    add_card(s9, 8.7, 1.8, 3.6, 5.0, "Resilience & Fallback Engineering", "Zero Dead-End Screens", [
        "Dual-layer diagnostic failover: Primary multipart -> Secondary base64 -> Pathology KB backup.",
        "Open-Meteo live weather with district agro-climatic fallback.",
        "Offline SMS/Email OTP authentication flows.",
        "Local browser storage persistence for offline field continuity.",
        "Fully responsive mobile-first UI tested across rural smartphones."
    ])

    # -------------------------------------------------------------
    # SLIDE 10: TRACTION, ROADMAP & FUTURE VISION (Dark Finale)
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_bg(s10, dark=True)
    add_header(s10, "Impact & The Future of Indian Agriculture", "Scaling SAGRI to 10 Million Farming Families", dark=True)

    add_card(s10, 0.9, 1.8, 3.6, 5.0, "Verified Pilot Metrics", "Benchmark Results", [
        "94.5% precision on leaf pathology with exact CIBRC dosages.",
        "96.0% top-1 suitability on crop recommendation with zero unviable crops.",
        "99.87% accuracy on historical yield failure risk classification.",
        "<450ms end-to-end diagnostic latency over rural 4G connections.",
        "Zero broker commissions saved on direct produce sales."
    ], dark=True)

    add_card(s10, 4.8, 1.8, 3.6, 5.0, "Phase 2 Roadmap (Q3-Q4)", "Deep-Tech Enhancements", [
        "Satellite Remote Sensing: Sentinel-2 NDVI vegetative health tracking.",
        "Drone Fleets: Automated precision spraying dispatch across panchayats.",
        "Soil Spectroscopy: Smartphone camera soil fertility estimation.",
        "Vernacular Voice First: End-to-end Punjabi, Hindi & Marathi voice agents.",
        "FPO / Cooperative Bulk Aggregation Portal for volume grain sales."
    ], dark=True, highlight=True)

    add_card(s10, 8.7, 1.8, 3.6, 5.0, "Our Long-Term Vision", "Sovereign Agro-Intelligence", [
        "Every smallholder empowered with PhD-level agronomist expertise.",
        "Elimination of distress selling through algorithmic price intelligence.",
        "Resilient, climate-adaptive farming with sustainable water & nutrient use.",
        "Empowering India's agricultural backbone with accessible AI innovation."
    ], dark=True)

    out_path = r"c:\Users\HP\Sagriaibest\SAGRI_Master_Presentation.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully to: {out_path}")
    return out_path

if __name__ == "__main__":
    create_sagri_deck()
