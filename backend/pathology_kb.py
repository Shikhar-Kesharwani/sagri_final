"""
SAGRI Krishi Plant Pathology Knowledge Base & Metadata
Provides ICAR/CIBRC compliant agricultural disease diagnostic profiles,
curated display names, scientific nomenclature, actionable recommendations,
approved chemical treatments, organic biocontrols, and preventative agronomic practices
for all 38 PlantVillage crop pathology classes.
"""

from typing import Dict, Any, List

PATHOLOGY_MASTER_DATABASE: Dict[str, Dict[str, Any]] = {
    "Apple___Apple_scab": {
        "crop": "Apple",
        "disease_name": "Apple Scab",
        "scientific_name": "Venturia inaequalis",
        "display_name": "Apple — Apple Scab (Venturia inaequalis)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Foliar scab lesions detected. Collect and destroy fallen infected leaves, prune dense canopy to accelerate leaf drying, and apply protective fungicide.",
        "immediate_action": "Prune water sprouts and thin inner canopy to maximize sunlight penetration. Rake and dispose of infected leaves.",
        "chemical_treatment": [
            "Captan 50% WP @ 2.0g per litre of water during wet spring spells",
            "Difenoconazole 25% EC @ 0.5ml per litre of water at petal fall stage",
            "Mancozeb 75% WP @ 2.5g per litre of water as protective preventative cover"
        ],
        "organic_treatment": [
            "Neem seed kernel extract (NSKE 5%) foliar spray every 7–10 days",
            "Copper oxychloride 50% WP (0.3%) dormant wash before bud break",
            "Sulfur 80% WP @ 2g per litre of water during early vegetative flush"
        ],
        "prevention": [
            "Rake and shred or compost fallen leaves thoroughly in autumn to eliminate overwintering pseudothecia",
            "Prune inner branches during dormancy to improve air circulation and sunlight penetration",
            "Apply 5% urea spray to orchard floor after harvest to accelerate leaf decomposition",
            "Plant scab-resistant apple cultivars such as Liberty, Prima, or Enterprise"
        ],
        "recheck_days": 10
    },
    "Apple___Black_rot": {
        "crop": "Apple",
        "disease_name": "Black Rot",
        "scientific_name": "Botryosphaeria obtusa",
        "display_name": "Apple — Black Rot (Botryosphaeria obtusa)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Black rot / frogeye leaf spot detected. Cut out diseased cankers 15cm below margin and remove all shriveled mummified fruit from the tree.",
        "immediate_action": "Prune dead or cankered wood immediately. Collect and burn mummified fruit hanging on tree or on orchard floor.",
        "chemical_treatment": [
            "Thiophanate-methyl 70% WP @ 1.5g per litre of water",
            "Captan 50% WP @ 2.5g per litre of water from pink bud through petal fall",
            "Pyraclostrobin 20% WG @ 1.0g per litre of water"
        ],
        "organic_treatment": [
            "Bordeaux mixture (1%) post-pruning protective wash",
            "Liquid copper soap fungicide spray from silver tip to tight cluster stage"
        ],
        "prevention": [
            "Promptly remove dead wood, fire blight strikes, and mummified fruit before spring budbreak",
            "Disinfect pruning shears between cuts using 70% isopropyl alcohol",
            "Avoid mechanical bark injury during mowing and equipment operation"
        ],
        "recheck_days": 12
    },
    "Apple___Cedar_apple_rust": {
        "crop": "Apple",
        "disease_name": "Cedar Apple Rust",
        "scientific_name": "Gymnosporangium juniperi-virginianae",
        "display_name": "Apple — Cedar Apple Rust (Gymnosporangium juniperi-virginianae)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Cedar apple rust spots observed. Inspect orchard perimeter for alternate host juniper / red cedar galls within 500m.",
        "immediate_action": "Eradicate or prune rust galls from nearby red cedar and juniper trees within the orchard vicinity.",
        "chemical_treatment": [
            "Myclobutanil 10% WP @ 0.5g per litre of water from pink bud through 3rd cover",
            "Mancozeb 75% WP @ 2.0g per litre of water at 7-10 day intervals during wet spring"
        ],
        "organic_treatment": [
            "Wettable sulfur @ 3g per litre of water applied prior to predicted rain events",
            "Copper soap fungicide applied at tight cluster stage"
        ],
        "prevention": [
            "Remove alternate host red cedar / juniper trees within a 1–2 km buffer zone",
            "Plant resistant apple cultivars such as Freedom, Liberty, or Pristine",
            "Monitor spring rain temperatures; rust spores germinate between 10°C–24°C"
        ],
        "recheck_days": 10
    },
    "Apple___healthy": {
        "crop": "Apple",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Malus domestica",
        "display_name": "Apple — Healthy Leaf (No Pathogen Detected)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Apple foliage displays normal chlorophyll density, leaf cuticle integrity, and healthy cell structure.",
        "immediate_action": "Maintain routine orchard fertigation and standard canopy management.",
        "chemical_treatment": [
            "No chemical fungicide or pesticide required"
        ],
        "organic_treatment": [
            "Prophylactic foliar spray of Jeevamrutham or Panchagavya (3%) to enhance phyllosphere immunity"
        ],
        "prevention": [
            "Maintain standard balanced N-P-K fertigation and annual soil test monitoring",
            "Ensure under-canopy micro-sprinklers or drip irrigation to avoid unnecessary leaf wetness",
            "Conduct routine weekly scouting during blossom and fruit set stages"
        ],
        "recheck_days": 30
    },
    "Blueberry___healthy": {
        "crop": "Blueberry",
        "disease_name": "Healthy Bush",
        "scientific_name": "Vaccinium corymbosum",
        "display_name": "Blueberry — Healthy Bush (Optimal Growth)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Blueberry leaf displays prime vigor and normal pigmentation with zero visible symptoms of pathogen stress.",
        "immediate_action": "Maintain acidic soil conditions (pH 4.5–5.2) and adequate organic mulching.",
        "chemical_treatment": [
            "No chemical intervention required"
        ],
        "organic_treatment": [
            "Pine needle or aged pine bark mulch (5–8cm depth) to support root mycorrhizae"
        ],
        "prevention": [
            "Maintain soil pH strictly between 4.5 and 5.2 using elemental sulfur as needed",
            "Ensure well-drained sandy-loam soil bed to prevent Phytophthora root rot",
            "Prune out canes older than 6 years to promote vigorous new fruiting wood"
        ],
        "recheck_days": 30
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "crop": "Cherry",
        "disease_name": "Powdery Mildew",
        "scientific_name": "Podosphaera clandestina",
        "display_name": "Cherry — Powdery Mildew (Podosphaera clandestina)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "White powdery fungal mycelium detected on cherry foliage. Prune crowded terminal shoots and apply systemic fungicide.",
        "immediate_action": "Remove heavily mildewed shoot tips. Halt late-season high nitrogen applications that produce soft susceptible flushes.",
        "chemical_treatment": [
            "Tebuconazole 25.9% EC @ 1ml per litre of water",
            "Azoxystrobin 23% SC @ 1ml per litre of water alternating with DMI fungicides",
            "Myclobutanil 10% WP @ 0.5g per litre of water"
        ],
        "organic_treatment": [
            "Potassium bicarbonate (3g/L) + horticultural oil (5ml/L) foliar spray",
            "Sulfur 80% WDG @ 2.5g per litre of water prior to fruit coloration",
            "Dilute milk spray (1:9 with water) in bright sunlight"
        ],
        "prevention": [
            "Prune open canopy architecture to maximize wind flow through the interior crown",
            "Irrigate via micro-sprinklers directed at ground level; never wet cherry foliage",
            "Scout underside of youngest leaves at 7-day intervals post-petal fall"
        ],
        "recheck_days": 7
    },
    "Cherry_(including_sour)___healthy": {
        "crop": "Cherry",
        "disease_name": "Healthy Canopy",
        "scientific_name": "Prunus cerasus",
        "display_name": "Cherry — Healthy Canopy (No Disease Detected)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Cherry leaves show excellent chloroplast density with no fungal or bacterial spotting.",
        "immediate_action": "Continue regular orchard schedule and post-harvest sanitation.",
        "chemical_treatment": [
            "No synthetic fungicides needed"
        ],
        "organic_treatment": [
            "Compost tea or seaweed foliar extract spray for balanced micronutrients"
        ],
        "prevention": [
            "Keep orchard floor weed-free within drip line to minimize humidity microclimates",
            "Apply dormant copper wash in late autumn after leaf fall to prevent bacterial canker"
        ],
        "recheck_days": 30
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "crop": "Corn (Maize)",
        "disease_name": "Cercospora & Gray Leaf Spot",
        "scientific_name": "Cercospora zeae-maydis",
        "display_name": "Corn (Maize) — Cercospora Leaf Spot & Gray Leaf Spot",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Rectangular gray leaf spot lesions identified on corn leaf. Spray fungicide if lesions threaten ear leaf prior to dough stage.",
        "immediate_action": "Assess disease progression relative to silking stage; spray if lesions reach third leaf below tassel.",
        "chemical_treatment": [
            "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml per litre of water",
            "Pyraclostrobin @ 1ml per litre of water at VT (tasseling) stage",
            "Propiconazole 25% EC @ 1ml per litre of water"
        ],
        "organic_treatment": [
            "Trichoderma harzianum soil and foliar bio-application",
            "Pseudomonas fluorescens (10g/L) bio-agent foliar spray"
        ],
        "prevention": [
            "Rotate fields out of corn for at least 1–2 years using soybean or pulses",
            "Chop or till corn stubble to speed microbial decomposition of pathogen stroma",
            "Select corn hybrids with high GLS disease rating scores (ratings >= 7)"
        ],
        "recheck_days": 10
    },
    "Corn_(maize)___Common_rust_": {
        "crop": "Corn (Maize)",
        "disease_name": "Common Rust",
        "scientific_name": "Puccinia sorghi",
        "display_name": "Corn (Maize) — Common Rust (Puccinia sorghi)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Reddish-brown rust pustules observed on corn leaf. Monitor disease spread during cool, humid weather conditions.",
        "immediate_action": "Scout upper canopy; intervention is justified if pustules appear prior to tasseling during cool, damp weather.",
        "chemical_treatment": [
            "Mancozeb 75% WP @ 2.5g per litre of water at first sign of pustules",
            "Tebuconazole 25.9% EC @ 1ml per litre of water",
            "Azoxystrobin 23% SC @ 1ml per litre of water"
        ],
        "organic_treatment": [
            "Foliar spray of 10% cow urine + fermented buttermilk (Chhachh)",
            "Neem oil 1500 ppm @ 3ml per litre of water"
        ],
        "prevention": [
            "Plant genetically rust-resistant hybrids featuring Rp single-gene resistance",
            "Early planting to ensure crop passes vulnerable grain-filling stages before rust spore flights",
            "Avoid excess nitrogen fertilization which promotes lush, susceptible leaf tissue"
        ],
        "recheck_days": 7
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "crop": "Corn (Maize)",
        "disease_name": "Northern Leaf Blight",
        "scientific_name": "Exserohilum turcicum",
        "display_name": "Corn (Maize) — Northern Leaf Blight (Exserohilum turcicum)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Long, elliptical cigar-shaped lesions detected on maize foliage. Apply systemic fungicide before silking to safeguard grain fill.",
        "immediate_action": "Apply targeted fungicide immediately if lesions exceed 2-3 spots per leaf below ear leaf before tassel emergence.",
        "chemical_treatment": [
            "Pyraclostrobin 133 g/L + Epoxiconazole 50 g/L SE @ 1.5ml per litre of water",
            "Azoxystrobin 11% + Tebuconazole 18.3% SC @ 1.5ml per litre of water",
            "Mancozeb 75% WP @ 2g per litre of water"
        ],
        "organic_treatment": [
            "Trichoderma viride @ 5g per litre of water foliar spray",
            "Bacillus subtilis bio-fungicide @ 2g per litre of water"
        ],
        "prevention": [
            "2-year crop rotation with non-host legumes or cotton to break mycelial cycle",
            "Bury surface crop residues with conservation tillage to accelerate decay",
            "Select hybrids with Ht gene resistance specific to local Exserohilum races"
        ],
        "recheck_days": 10
    },
    "Corn_(maize)___healthy": {
        "crop": "Corn (Maize)",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Zea mays",
        "display_name": "Corn (Maize) — Healthy Foliage (Vigorous Crop)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Corn crop displays strong photosynthetic capacity and dark green foliage with no rust or blight lesions.",
        "immediate_action": "Maintain optimal irrigation and scheduled split nitrogen top-dressing.",
        "chemical_treatment": [
            "No chemical treatment needed"
        ],
        "organic_treatment": [
            "Foliar application of fermented Jeevamrutham at 30 and 45 days after sowing"
        ],
        "prevention": [
            "Maintain timely irrigation during critical knee-high and tasseling stages",
            "Apply balanced N:P:K (120:60:40 kg/ha) with split urea applications",
            "Regular scouting for fall armyworm and stalk borer egg masses"
        ],
        "recheck_days": 30
    },
    "Grape___Black_rot": {
        "crop": "Grape",
        "disease_name": "Black Rot",
        "scientific_name": "Guignardia bidwellii",
        "display_name": "Grape — Black Rot (Guignardia bidwellii)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Grape black rot detected. Remove infected mummies and brown leaf spots immediately. Apply protectant fungicide before rainfall.",
        "immediate_action": "Hand-remove and burn mummified grape clusters and brown-spotted foliage immediately.",
        "chemical_treatment": [
            "Mancozeb 75% WP @ 2.5g per litre of water starting at 10-15cm shoot growth",
            "Myclobutanil 10% WP @ 0.5g per litre of water or Kresoxim-methyl 44.3% SC @ 0.7ml/L",
            "Difenoconazole 25% EC @ 0.5ml per litre of water"
        ],
        "organic_treatment": [
            "Bordeaux mixture (1% 4:4:50) applied before predicted rain periods",
            "Copper oxychloride 50% WP @ 3g per litre of water",
            "Neem extract foliar drench"
        ],
        "prevention": [
            "Remove all shriveled black mummies from vines and trellis ground during winter pruning",
            "Shoot position and canopy thin to allow air and morning sun to rapidly dry grape clusters",
            "Maintain a clean weed-free strip under the trellis wire"
        ],
        "recheck_days": 7
    },
    "Grape___Esca_(Black_Measles)": {
        "crop": "Grape",
        "disease_name": "Esca / Black Measles",
        "scientific_name": "Phaeomoniella chlamydospora",
        "display_name": "Grape — Esca / Black Measles (Phaeomoniella chlamydospora)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Tiger-stripe foliar necrosis indicates Esca / Black Measles complex. Protect pruning wounds and mark affected vines for selective dormant surgery.",
        "immediate_action": "Flag diseased vines. Paint all pruning cuts immediately with wound sealant to block fungal penetration.",
        "chemical_treatment": [
            "Thiophanate-methyl wound paste on pruning cuts within 24 hours of cutting",
            "Fosetyl-Al @ 2g per litre of water as systemic trunk support"
        ],
        "organic_treatment": [
            "Trichoderma atroviride pruning wound paste sealant",
            "Pythium oligandrum biological root/trunk drench"
        ],
        "prevention": [
            "Delay pruning until late winter when vine sap pressure helps flush cut surfaces",
            "Disinfect pruning shears between vines with 70% ethanol or quaternary ammonium",
            "Renew trunk by training a basal sucker if infection has not descended into rootstock"
        ],
        "recheck_days": 14
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "crop": "Grape",
        "disease_name": "Leaf Blight / Isariopsis Leaf Spot",
        "scientific_name": "Pseudocercospora cladosporioides",
        "display_name": "Grape — Leaf Blight (Pseudocercospora cladosporioides)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Irregular necrotic leaf spots observed. Prune lower canopy foliage to enhance airflow and spray protectant copper fungicide.",
        "immediate_action": "Prune lower yellowing leaves near grape clusters to eliminate humidity pockets.",
        "chemical_treatment": [
            "Hexaconazole 5% EC @ 1ml per litre of water",
            "Carbendazim 50% WP @ 1g per litre of water",
            "Azoxystrobin 23% SC @ 1ml per litre of water"
        ],
        "organic_treatment": [
            "Bordeaux mixture (0.5%–1.0%) post-harvest protective spray",
            "Cow dung-urine filtrate spray (5%)",
            "Neem oil 3000 ppm @ 3ml per litre of water"
        ],
        "prevention": [
            "Ensure trellis canopy does not touch the soil surface",
            "Apply balanced potassium and calcium to thicken leaf epidermal cell walls",
            "Collect and burn post-pruning cane clippings and fallen foliage"
        ],
        "recheck_days": 10
    },
    "Grape___healthy": {
        "crop": "Grape",
        "disease_name": "Healthy Vine",
        "scientific_name": "Vitis vinifera",
        "display_name": "Grape — Healthy Vine (Optimal Foliage)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Grape foliage is vigorous, fully turgid, and completely free of fungal spots or downy mildew.",
        "immediate_action": "Maintain canopy management, shoot positioning, and disciplined drip irrigation.",
        "chemical_treatment": [
            "No chemical fungicides required"
        ],
        "organic_treatment": [
            "Foliar application of seaweed extract (Ascophyllum nodosum) at 2ml/L for abiotic stress resilience"
        ],
        "prevention": [
            "Maintain disciplined drip fertigation schedule based on petiole nutrient analysis",
            "Ensure leaf removal around clusters during pea-size berry stage for airflow",
            "Conduct weekly scouting for thrips and powdery mildew during active vegetative growth"
        ],
        "recheck_days": 30
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "crop": "Citrus / Orange",
        "disease_name": "Citrus Greening / Huanglongbing",
        "scientific_name": "Candidatus Liberibacter asiaticus",
        "display_name": "Citrus / Orange — Citrus Greening (Huanglongbing)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Asymmetrical leaf mottling / yellow shoot symptoms detected. Rogue severely symptomatic trees and control the Asian citrus psyllid vector immediately.",
        "immediate_action": "Rogue and burn heavily infected trees showing severe zinc-deficiency-like blotchy mottle to protect surrounding grove.",
        "chemical_treatment": [
            "Imidacloprid 17.8% SL @ 0.5ml per litre of water as soil drench to knock down psyllid vectors",
            "Thiamethoxam 25% WG @ 0.3g per litre of water foliar spray during flushing stage",
            "Dimethoate 30% EC @ 1.5ml per litre of water"
        ],
        "organic_treatment": [
            "Release beneficial parasitoid Tamarixia radiata wasps",
            "Kaolin clay foliar barrier spray (30g/L) to deter citrus psyllid landing and feeding",
            "Neem oil 10000 ppm @ 2ml per litre of water"
        ],
        "prevention": [
            "Plant ONLY certified disease-free nursery stock from vector-proof screenhouses",
            "Establish windbreaks (Casuarina / Sesbania) around orchard boundary to reduce psyllid ingress",
            "Coordinate area-wide vector management with neighboring citrus growers"
        ],
        "recheck_days": 30
    },
    "Peach___Bacterial_spot": {
        "crop": "Peach",
        "disease_name": "Bacterial Spot",
        "scientific_name": "Xanthomonas arboricola pv. pruni",
        "display_name": "Peach — Bacterial Spot (Xanthomonas arboricola)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Angular shot-hole lesions detected on peach foliage. Cease overhead irrigation and apply protective copper bactericide.",
        "immediate_action": "Avoid overhead watering. Prune dead twigs during dormant season to remove overwintering bacterial cankers.",
        "chemical_treatment": [
            "Copper hydroxide 53.8% DF @ 1.5g per litre of water at bud swell and shuck split",
            "Oxytetracycline agricultural grade @ 1.0g per litre of water during warm humid bloom",
            "Mancozeb + Copper tank mix during early cover stages"
        ],
        "organic_treatment": [
            "Fixed copper bactericide dormant spray before bud swell",
            "Bacillus subtilis bio-bactericide foliar spray @ 2g per litre of water"
        ],
        "prevention": [
            "Select bacterial spot resistant peach varieties (e.g. Clayton, Candor, Biscoe, Redhaven)",
            "Erect tree windbreaks along prevailing wind corridors to prevent sand-blast leaf injury",
            "Maintain balanced soil fertility with moderate nitrogen and adequate potassium"
        ],
        "recheck_days": 10
    },
    "Peach___healthy": {
        "crop": "Peach",
        "disease_name": "Healthy Orchard Leaf",
        "scientific_name": "Prunus persica",
        "display_name": "Peach — Healthy Orchard Leaf (Optimal Growth)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Peach foliage is vibrant, fully developed, and completely free of bacterial pitting or leaf curl.",
        "immediate_action": "Maintain normal stone fruit orchard management and balanced nutrition.",
        "chemical_treatment": [
            "No chemical sprays required"
        ],
        "organic_treatment": [
            "Microbial foliar bio-stimulants and compost tea"
        ],
        "prevention": [
            "Annual winter dormant copper spray for peach leaf curl and bacterial canker prevention",
            "Regular soil testing and calcium supplementation"
        ],
        "recheck_days": 30
    },
    "Pepper,_bell___Bacterial_spot": {
        "crop": "Bell Pepper (Capsicum)",
        "disease_name": "Bacterial Spot",
        "scientific_name": "Xanthomonas campestris pv. vesicatoria",
        "display_name": "Bell Pepper — Bacterial Spot (Xanthomonas campestris)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Water-soaked necrotic spots identified on pepper leaf. Disinfect stakes, avoid working while foliage is wet, and spray bactericide.",
        "immediate_action": "Remove infected plants in early localized clusters; refrain from handling pepper foliage while wet with dew.",
        "chemical_treatment": [
            "Copper oxychloride 50% WP @ 2.5g/L + Streptocycline (1g per 10L water)",
            "Kasugamycin 3% SL @ 1.5ml per litre of water",
            "Copper hydroxide @ 2g per litre of water"
        ],
        "organic_treatment": [
            "Pseudomonas fluorescens (10g/L) seedling root dip and foliar spray",
            "Garlic + chili botanical extract spray",
            "Trichoderma viride soil application"
        ],
        "prevention": [
            "Hot-water treat non-certified seeds at 50°C for 25 minutes prior to nursery sowing",
            "Implement strict 2-3 year crop rotation away from peppers, tomatoes, and brinjals",
            "Utilize drip irrigation exclusively; overhead sprinkler irrigation violently spreads Xanthomonas bacteria"
        ],
        "recheck_days": 7
    },
    "Pepper,_bell___healthy": {
        "crop": "Bell Pepper (Capsicum)",
        "disease_name": "Healthy Plant",
        "scientific_name": "Capsicum annuum",
        "display_name": "Bell Pepper — Healthy Plant (No Infection)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Pepper plant displays healthy deep green foliage with uniform development and strong flower retention.",
        "immediate_action": "Maintain regular drip fertigation and balanced potassium supply.",
        "chemical_treatment": [
            "No agrochemicals required"
        ],
        "organic_treatment": [
            "Foliar spray of Vermiwash (5%) + Panchagavya (3%) at 15-day intervals"
        ],
        "prevention": [
            "Mulch planting beds with silver-black reflective polyethylene to repel aphids and thrips",
            "Maintain uniform soil moisture to avoid blossom end rot and calcium deficiency"
        ],
        "recheck_days": 30
    },
    "Potato___Early_blight": {
        "crop": "Potato",
        "disease_name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "display_name": "Potato — Early Blight (Alternaria solani)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Concentric target-board spots observed on potato leaf. Strip lower necrotic foliage and apply protective fungicide.",
        "immediate_action": "Scout lower canopy; remove severely diseased leaves showing dry brown target rings.",
        "chemical_treatment": [
            "Mancozeb 75% WP @ 2.5g per litre of water at first appearance of lesions",
            "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml per litre of water",
            "Chlorothalonil 75% WP @ 2g per litre of water every 7-10 days"
        ],
        "organic_treatment": [
            "Neem seed kernel extract (NSKE 5%) foliar spray",
            "Trichoderma harzianum @ 5g per litre of water",
            "Copper oxychloride @ 2.5g per litre of water"
        ],
        "prevention": [
            "Plant certified disease-free, vigorous seed tubers from certified seed farms",
            "Maintain balanced soil nitrogen; nitrogen-deficient potato crops suffer severe early blight attack",
            "Practice minimum 3-year crop rotation with maize, millets, or legumes"
        ],
        "recheck_days": 7
    },
    "Potato___Late_blight": {
        "crop": "Potato",
        "disease_name": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "display_name": "Potato — Late Blight (Phytophthora infestans)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Water-soaked lesions with pale margins detected on potato leaf. Late blight can destroy fields in 48-72 hours. Apply systemic oomycide immediately.",
        "immediate_action": "Apply curative systemic fungicide immediately across the entire plot within 24 hours.",
        "chemical_treatment": [
            "Cymoxanil 8% + Mancozeb 64% WP (Curzate) @ 2.5g per litre of water",
            "Metalaxyl 8% + Mancozeb 64% WP (Ridomil MZ) @ 2.5g per litre of water",
            "Dimethomorph 50% WP @ 1g per litre of water alternating with Fenamidone + Mancozeb"
        ],
        "organic_treatment": [
            "Copper hydroxide / Bordeaux mixture (1%) as prophylactic cover before fog/rain",
            "Bacillus amyloliquefaciens foliar drench"
        ],
        "prevention": [
            "Hill up potatoes high (20-25cm ridging) to create deep physical soil barrier preventing zoospores washing into tubers",
            "Destroy cull piles and volunteer potato sprouts before planting season",
            "Destroy infected haulms (dehaulming) with contact desiccant 10-14 days before tuber harvest"
        ],
        "recheck_days": 5
    },
    "Potato___healthy": {
        "crop": "Potato",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Solanum tuberosum",
        "display_name": "Potato — Healthy Foliage (Optimal Growth)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Potato foliage is intact, vigorous, and free from blight symptoms or viral crinkling.",
        "immediate_action": "Maintain soil ridging and monitor local agrometeorological blight advisories.",
        "chemical_treatment": [
            "No curative chemical required"
        ],
        "organic_treatment": [
            "Preventative bio-stimulant or dilute Panchagavya spray"
        ],
        "prevention": [
            "Monitor IMD blight warnings (high humidity >90% and cool temperatures 10-20°C)",
            "Maintain good ridging to prevent tuber greening and soil rot"
        ],
        "recheck_days": 30
    },
    "Raspberry___healthy": {
        "crop": "Raspberry",
        "disease_name": "Healthy Cane & Foliage",
        "scientific_name": "Rubus idaeus",
        "display_name": "Raspberry — Healthy Cane & Foliage (Prime Vigor)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Raspberry canes and leaves display prime chlorophyll vigor and healthy vein architecture.",
        "immediate_action": "Maintain organic mulch and prune old spent floricanes post-harvest.",
        "chemical_treatment": [
            "No chemical treatment required"
        ],
        "organic_treatment": [
            "Organic compost mulching at base of canes"
        ],
        "prevention": [
            "Prune spent floricanes immediately after summer harvest to increase sunlight and ventilation",
            "Ensure trellising keeps canes upright and well off the soil"
        ],
        "recheck_days": 30
    },
    "Soybean___healthy": {
        "crop": "Soybean",
        "disease_name": "Healthy Crop",
        "scientific_name": "Glycine max",
        "display_name": "Soybean — Healthy Crop (No Disease Detected)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Soybean trifoliate foliage displays excellent health, dark green color, and active nodulation vitality.",
        "immediate_action": "Maintain timely weed management and moisture conservation.",
        "chemical_treatment": [
            "No chemical fungicide needed"
        ],
        "organic_treatment": [
            "Seed inoculation with Bradyrhizobium japonicum + PSB culture at sowing"
        ],
        "prevention": [
            "Scout weekly during flowering and pod development stages (R1-R5)",
            "Maintain field drainage to prevent waterlogging during monsoon downpours"
        ],
        "recheck_days": 30
    },
    "Squash___Powdery_mildew": {
        "crop": "Squash / Cucurbits",
        "disease_name": "Powdery Mildew",
        "scientific_name": "Podosphaera xanthii",
        "display_name": "Squash / Cucurbits — Powdery Mildew (Podosphaera xanthii)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Powdery white fungal colonies identified on squash leaf surface. Thin dense older leaves and apply bio-fungicide.",
        "immediate_action": "Prune out heavily infected, white-powder-covered older crown leaves to retard spore dispersal.",
        "chemical_treatment": [
            "Azoxystrobin 23% SC @ 1ml per litre of water",
            "Myclobutanil 10% WP @ 0.5g per litre of water",
            "Sulfur 80% WP @ 2.5g per litre of water (avoid if temperature exceeds 32°C)"
        ],
        "organic_treatment": [
            "Potassium bicarbonate (3g/L) + Neem oil (3ml/L) foliar spray",
            "Baking soda (5g/L) with horticultural liquid soap surfactant",
            "Trichoderma harzianum @ 5g per litre of water"
        ],
        "prevention": [
            "Space vines generously (minimum 1.5–2m row spacing) for maximum air movement",
            "Install drip irrigation; never wet cucurbit foliage in the evening",
            "Plant powdery mildew tolerant hybrids (featuring PM resistance genes)"
        ],
        "recheck_days": 7
    },
    "Strawberry___Leaf_scorch": {
        "crop": "Strawberry",
        "disease_name": "Leaf Scorch",
        "scientific_name": "Diplocarpon earlianum",
        "display_name": "Strawberry — Leaf Scorch (Diplocarpon earlianum)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Dark purplish-brown scorch spots detected on strawberry foliage. Remove necrotic runner leaves and renovate bed mulch.",
        "immediate_action": "Remove and bag severely purplish-scorched leaves during dry weather; avoid overhead sprinkler watering.",
        "chemical_treatment": [
            "Captan 50% WP @ 2g per litre of water",
            "Thiophanate-methyl 70% WP @ 1g per litre of water",
            "Myclobutanil 10% WP @ 0.5g per litre of water during renovation"
        ],
        "organic_treatment": [
            "Copper soap fungicide foliar spray",
            "Neem oil 1500 ppm @ 3ml per litre of water",
            "Bio-fungicide Bacillus subtilis @ 2g per litre of water"
        ],
        "prevention": [
            "Plant certified disease-free strawberry runner transplants",
            "Renovate beds immediately after fruiting: mow foliage above crowns, rake out debris, and apply fertilizer",
            "Mulch beds with clean, fresh wheat or barley straw to prevent soil-splash onto crowns"
        ],
        "recheck_days": 10
    },
    "Strawberry___healthy": {
        "crop": "Strawberry",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Fragaria ananassa",
        "display_name": "Strawberry — Healthy Foliage (No Symptoms)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Strawberry crowns and trifoliate leaves display optimal chlorophyll development and vigor.",
        "immediate_action": "Maintain clean drip irrigation beneath strawberry mulch beds.",
        "chemical_treatment": [
            "No fungicides needed"
        ],
        "organic_treatment": [
            "Organic straw mulching and periodic vermicompost top-dressing"
        ],
        "prevention": [
            "Ensure drip irrigation lines are placed under plastic mulch",
            "Scout crowns regularly for cyclamen mite and crown rot symptoms"
        ],
        "recheck_days": 30
    },
    "Tomato___Bacterial_spot": {
        "crop": "Tomato",
        "disease_name": "Bacterial Spot",
        "scientific_name": "Xanthomonas perforans",
        "display_name": "Tomato — Bacterial Spot (Xanthomonas perforans)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Small, dark, water-soaked angular leaf spots observed. Disinfect pruning shears, avoid working in wet foliage, and spray copper bactericide.",
        "immediate_action": "Disinfect stakes and ties; do not cultivate or harvest while plants are wet with rain or dew.",
        "chemical_treatment": [
            "Copper oxychloride 50% WP @ 2.5g/L + Streptocycline (1g per 10L water)",
            "Copper hydroxide 53.8% DF @ 2g per litre of water",
            "Kasugamycin 3% SL @ 1.5ml per litre of water"
        ],
        "organic_treatment": [
            "Pseudomonas fluorescens 1% WP @ 10g/L foliar spray",
            "Botanical extract of raw garlic and neem oil (5ml/L)",
            "Bacillus subtilis @ 3g per litre of water"
        ],
        "prevention": [
            "Treat seeds with hot water (50°C for 25 minutes) or 1.3% sodium hypochlorite before sowing",
            "Rotate out of Solanaceae family for at least 2 years",
            "Install drip irrigation systems to eliminate foliar splash from rain or sprinklers"
        ],
        "recheck_days": 7
    },
    "Tomato___Early_blight": {
        "crop": "Tomato",
        "disease_name": "Early Blight",
        "scientific_name": "Alternaria solani",
        "display_name": "Tomato — Early Blight (Alternaria solani)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Early blight target spots detected with yellow chlorotic halos. Prune lower infected leaves, mulch soil base, and spray protectant fungicide.",
        "immediate_action": "Prune off bottom foliage exhibiting brown concentric target spots; destroy clippings away from field.",
        "chemical_treatment": [
            "Mancozeb 75% WP @ 2.5g per litre of water",
            "Azoxystrobin 18.2% + Difenoconazole 11.4% SC @ 1ml per litre of water",
            "Chlorothalonil 75% WP @ 2g per litre of water"
        ],
        "organic_treatment": [
            "Neem seed kernel extract (NSKE 5%) or Neem oil (5ml/L)",
            "Trichoderma viride @ 5g per litre foliar spray",
            "Copper oxychloride (0.25%) protective wash"
        ],
        "prevention": [
            "Stake indeterminate tomato vines and strip bottom 30cm of leaves to eliminate soil-contact splash",
            "Apply 7-10cm organic mulch (straw or paddy straw) beneath tomato plants",
            "Follow strict 3-year crop rotation avoiding tomato, potato, brinjal, and chili"
        ],
        "recheck_days": 7
    },
    "Tomato___Late_blight": {
        "crop": "Tomato",
        "disease_name": "Late Blight",
        "scientific_name": "Phytophthora infestans",
        "display_name": "Tomato — Late Blight (Phytophthora infestans)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Dark olive-green water-soaked lesions detected on tomato foliage. High epidemic risk in cool, moist conditions. Apply systemic oomycide immediately.",
        "immediate_action": "Apply curative systemic fungicide within 24 hours; remove and bag severely blighted vines immediately.",
        "chemical_treatment": [
            "Cymoxanil 8% + Mancozeb 64% WP @ 2.5g per litre of water",
            "Metalaxyl-M 4% + Mancozeb 64% WP @ 2.5g per litre of water",
            "Dimethomorph 50% WP @ 1g/L or Mandipropamid 23.4% SC @ 0.8ml/L"
        ],
        "organic_treatment": [
            "Preventative Bordeaux mixture (1%) before continuous cool rain spells",
            "Copper hydroxide @ 2g per litre of water"
        ],
        "prevention": [
            "Avoid overhead watering, especially late in the day when leaves remain wet overnight",
            "Space plants adequately (60cm x 90cm) to ensure rapid drying after rain",
            "Plant late-blight-resistant tomato varieties (e.g. Mountain Magic, Defiant, Arka Rakshak)"
        ],
        "recheck_days": 5
    },
    "Tomato___Leaf_Mold": {
        "crop": "Tomato",
        "disease_name": "Leaf Mold",
        "scientific_name": "Passalora fulva",
        "display_name": "Tomato — Leaf Mold (Passalora fulva)",
        "severity": "Medium",
        "color": "yellow",
        "is_healthy": False,
        "recommendation": "Yellow upper leaf patches with olive-green velvety mold underneath detected. Increase polyhouse ventilation and reduce canopy humidity below 85%.",
        "immediate_action": "Increase greenhouse or polyhouse ventilation immediately; lower relative humidity below 85%.",
        "chemical_treatment": [
            "Difenoconazole 25% EC @ 0.5ml per litre of water",
            "Chlorothalonil 75% WP @ 2g per litre of water",
            "Azoxystrobin 23% SC @ 1ml per litre of water"
        ],
        "organic_treatment": [
            "Copper oxychloride 50% WP @ 2g per litre of water",
            "Bio-fungicide Bacillus amyloliquefaciens spray @ 2g per litre of water"
        ],
        "prevention": [
            "Ensure forced air ventilation and exhaust fans inside greenhouse structures",
            "Drip irrigate early in the morning so surface moisture evaporates quickly",
            "Prune lower suckers and inner foliage to open dense canopies"
        ],
        "recheck_days": 7
    },
    "Tomato___Septoria_leaf_spot": {
        "crop": "Tomato",
        "disease_name": "Septoria Leaf Spot",
        "scientific_name": "Septoria lycopersici",
        "display_name": "Tomato — Septoria Leaf Spot (Septoria lycopersici)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Numerous small circular spots with gray centers and black fruiting specks observed on lower leaves. Remove affected foliage and mulch bed.",
        "immediate_action": "Prune infected lower leaves displaying tiny circular spots with dark borders and gray centers.",
        "chemical_treatment": [
            "Chlorothalonil 75% WP @ 2g per litre of water",
            "Mancozeb 75% WP @ 2.5g per litre of water at 7-10 day intervals",
            "Copper oxychloride @ 2.5g per litre of water"
        ],
        "organic_treatment": [
            "Copper sulfate + lime (Bordeaux mixture 0.5%)",
            "Neem oil 1500 ppm @ 3ml per litre of water",
            "Trichoderma harzianum @ 5g per litre of water"
        ],
        "prevention": [
            "Mulch heavily around base of plants with clean straw or plastic mulch to stop rain-splash of spores",
            "Eradicate horsenettle, groundcherry, and other solanaceous weeds around field borders",
            "Destroy tomato vines completely after final harvest; do not leave dead vines on ground over winter"
        ],
        "recheck_days": 7
    },
    "Tomato___Spider_mites Two-spotted_spider_mite": {
        "crop": "Tomato",
        "disease_name": "Two-Spotted Spider Mite Infestation",
        "scientific_name": "Tetranychus urticae",
        "display_name": "Tomato — Two-Spotted Spider Mites (Tetranychus urticae)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Fine foliar stippling, chlorosis, and fine webbing on leaf undersides indicate spider mite attack. Apply miticide and boost field humidity.",
        "immediate_action": "Spray undersides of leaves with strong water spray; apply targeted miticide before webbing envelops canopy.",
        "chemical_treatment": [
            "Spiromesifen 22.9% SC @ 1ml per litre of water",
            "Propargite 57% EC @ 2ml per litre of water",
            "Abamectin 1.9% EC @ 0.5ml per litre of water"
        ],
        "organic_treatment": [
            "Release predatory mites (Phytoseiulus persimilis or Neoseiulus californicus) @ 2-5 per plant",
            "Neem oil 10000 ppm @ 2-3ml/L water + horticultural potassium soap",
            "Wettable sulfur @ 2g/L (avoid when temperature exceeds 32°C)"
        ],
        "prevention": [
            "Maintain adequate soil moisture; spider mite populations explode under hot, dry, dusty conditions",
            "Wash down farm perimeter access paths to suppress dust clouds",
            "Avoid unnecessary broad-spectrum synthetic pyrethroids which kill beneficial predatory mites"
        ],
        "recheck_days": 5
    },
    "Tomato___Target_Spot": {
        "crop": "Tomato",
        "disease_name": "Target Spot",
        "scientific_name": "Corynespora cassiicola",
        "display_name": "Tomato — Target Spot (Corynespora cassiicola)",
        "severity": "High",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Brown lesions with light brown centers and distinct concentric rings observed on tomato leaves. Improve aeration and apply strobilurin/DMI fungicide.",
        "immediate_action": "Remove symptomatic leaves showing concentric brown-to-black target rings; improve air flow.",
        "chemical_treatment": [
            "Azoxystrobin 11% + Tebuconazole 18.3% SC @ 1.5ml per litre of water",
            "Chlorothalonil 75% WP @ 2g per litre of water",
            "Pyraclostrobin 20% WG @ 1g per litre of water"
        ],
        "organic_treatment": [
            "Copper oxychloride 50% WP @ 2.5g per litre of water",
            "Bacillus subtilis bio-fungicide @ 2g per litre of water"
        ],
        "prevention": [
            "Stake and prune tomato plants to maintain upright, airy canopy",
            "Avoid overhead sprinkler irrigation; keep foliage dry",
            "Rotate fields with non-host crops like corn or sorghum for 2 seasons"
        ],
        "recheck_days": 7
    },
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus": {
        "crop": "Tomato",
        "disease_name": "Tomato Yellow Leaf Curl Virus (TYLCV)",
        "scientific_name": "Begomovirus / TYLCV",
        "display_name": "Tomato — Yellow Leaf Curl Virus (TYLCV)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Upward cupping of leaves with pronounced yellowing and stunted internodes detected. Vector is whitefly (Bemisia tabaci). Rogue infected plants and control whiteflies.",
        "immediate_action": "Rogue and immediately bag and destroy infected plants with upward-curled yellowed leaves to prevent vector feeding; spray to kill whiteflies.",
        "chemical_treatment": [
            "Diafenthiuron 50% WP @ 1.2g per litre of water (whitefly vector control)",
            "Spiromesifen 22.9% SC @ 1ml per litre of water",
            "Thiamethoxam 25% WG @ 0.3g/L or Acetamiprid 20% SP @ 0.4g/L"
        ],
        "organic_treatment": [
            "Install yellow sticky traps (15–20 traps per acre) at canopy height",
            "Neem oil 10000 ppm @ 2ml/L + fish oil rosin soap spray",
            "Erect 40-50 mesh insect-proof netting over nursery beds"
        ],
        "prevention": [
            "Grow TYLCV-resistant hybrids (e.g. US 440, NS 501, Arka Rakshak, Arka Samrat)",
            "Raise nursery seedlings under 40-50 mesh insect-proof net tunnels",
            "Maintain 30-day crop-free buffer period between successive solanaceous crops"
        ],
        "recheck_days": 5
    },
    "Tomato___Tomato_mosaic_virus": {
        "crop": "Tomato",
        "disease_name": "Tomato Mosaic Tobamovirus (ToMV)",
        "scientific_name": "Tomato Mosaic Virus (ToMV)",
        "display_name": "Tomato — Tomato Mosaic Virus (ToMV)",
        "severity": "Critical",
        "color": "red",
        "is_healthy": False,
        "recommendation": "Light and dark green mosaic mottle with distorted, fern-like leaf growth detected. Mechanically transmitted virus. Disinfect all tools and rogue infected plants.",
        "immediate_action": "Rogue and burn infected mosaic-mottled plants immediately; wash hands and tools thoroughly with soap and water.",
        "chemical_treatment": [
            "No chemical cure exists for viral plant infections; focus strictly on vector control and strict phytosanitation"
        ],
        "organic_treatment": [
            "Foliar spray of 20% skimmed milk / non-fat dry milk to neutralize virus particles on hands/tools during pruning",
            "Foliar bio-stimulants to support plant vitality"
        ],
        "prevention": [
            "Soak seeds in 10% trisodium phosphate (TSP) for 20 minutes before sowing",
            "Strictly prohibit tobacco smoking, chewing, or handling near tomato crop (tobacco carries mosaic viruses)",
            "Disinfect all pruning shears, stakes, and trellises in 10% household bleach between rows"
        ],
        "recheck_days": 7
    },
    "Tomato___healthy": {
        "crop": "Tomato",
        "disease_name": "Healthy Foliage",
        "scientific_name": "Solanum lycopersicum",
        "display_name": "Tomato — Healthy Foliage (No Pathogen Detected)",
        "severity": "None",
        "color": "green",
        "is_healthy": True,
        "recommendation": "Tomato foliage shows robust chloroplast vigor, intact compound leaf structure, and no visible pathogenic symptoms.",
        "immediate_action": "Maintain balanced drip fertigation and scheduled staking.",
        "chemical_treatment": [
            "No chemical fungicide or pesticide required"
        ],
        "organic_treatment": [
            "Regular prophylactic spray of Jeevamrutham (5%) or Panchagavya (3%) every 14 days"
        ],
        "prevention": [
            "Maintain consistent drip irrigation to prevent calcium deficiency and blossom end rot",
            "Conduct regular weekly scouting of lower canopy leaves for early symptom detection",
            "Ensure sturdy staking and trellising to keep plants upright and off wet soil"
        ],
        "recheck_days": 30
    }
}


def get_pathology_profile(class_name: str) -> Dict[str, Any]:
    """Retrieve full pathology metadata for any class, with safe fallback."""
    if class_name in PATHOLOGY_MASTER_DATABASE:
        return PATHOLOGY_MASTER_DATABASE[class_name]
    
    # Fuzzy match by class or crop
    clean_search = class_name.lower().replace("_", " ")
    for k, v in PATHOLOGY_MASTER_DATABASE.items():
        if k.lower() in clean_search or v["crop"].lower() in clean_search:
            return v
            
    # Generic safe profile
    is_h = "healthy" in class_name.lower()
    return {
        "crop": "Crop",
        "disease_name": class_name.replace("___", " — ").replace("_", " "),
        "scientific_name": "Specimen",
        "display_name": class_name.replace("___", " — ").replace("_", " "),
        "severity": "None" if is_h else "Medium",
        "color": "green" if is_h else "yellow",
        "is_healthy": is_h,
        "recommendation": "Maintain standard agronomic care and balanced fertigation." if is_h else f"Symptom identified: {class_name.replace('_', ' ')}. Isolate affected foliage and monitor.",
        "immediate_action": "Continue scheduled crop monitoring." if is_h else "Inspect field canopy and isolate affected leaves.",
        "chemical_treatment": ["No chemical treatment required"] if is_h else ["Consult local Krishi Vigyan Kendra (KVK) for approved regional fungicides."],
        "organic_treatment": ["Apply prophylactic Jeevamrutham (200L/acre)"] if is_h else ["Neem oil spray (5ml/L water) or bio-fungicide Trichoderma viride."],
        "prevention": [
            "Follow balanced soil test-based NPK nutrition",
            "Maintain clean field sanitation and avoid waterlogging",
            "Regular weekly scouting of lower canopy leaves"
        ],
        "recheck_days": 30 if is_h else 10
    }
