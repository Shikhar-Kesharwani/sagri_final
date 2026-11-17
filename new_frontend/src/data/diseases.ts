export type Remedy = { name: string; detail: string };
export type Diagnosis = {
  id: string;
  sample: string;
  crop: string;
  disease: string;
  pathogen: string;
  pathogenType: string;
  family: string;
  confidence: number;
  severity: string;
  action: string;
  chemical: Remedy[];
  organic: Remedy[];
  cultural: Remedy[];
};

export const DIAGNOSES: Diagnosis[] = [
  {
    id: "tomato-early-blight",
    sample: "Tomato Blight",
    crop: "Tomato",
    disease: "Early Blight",
    pathogen: "Alternaria solani",
    pathogenType: "Fungal pathogen",
    family: "Solanaceae",
    confidence: 95.7,
    severity: "Moderate Foliar Spread (Stage 2)",
    action: "Prune infected lower foliage immediately and burn debris away from the field. Avoid overhead sprinkler irrigation.",
    chemical: [
      { name: "Azoxystrobin 23% SC", detail: "1.0 ml / liter of water (200 ml / acre). Spray every 10–14 days." },
      { name: "Mancozeb 75% WP", detail: "2.0 g / liter of water (400 g / acre)." },
    ],
    organic: [
      { name: "Neem Seed Kernel Extract (NSKE 5%)", detail: "50 ml / liter of water." },
      { name: "Trichoderma viride", detail: "Bio-control soil application around the plant base." },
    ],
    cultural: [
      { name: "Crop rotation", detail: "Rotate crops with non-solanaceous plants for 2 seasons." },
      { name: "Straw mulch", detail: "Mulch plant base with clean straw to prevent soil splash." },
    ],
  },
  {
    id: "potato-common-scab",
    sample: "Potato Scab",
    crop: "Potato",
    disease: "Common Scab",
    pathogen: "Streptomyces scabies",
    pathogenType: "Soil-borne actinomycete",
    family: "Solanaceae",
    confidence: 92.4,
    severity: "Mild surface lesions (Stage 1)",
    action: "Keep soil evenly moist through tuber initiation; avoid fresh manure.",
    chemical: [
      { name: "Boric acid 3% dip", detail: "Dip seed tubers for 30 minutes before planting" },
      { name: "Gypsum", detail: "Apply 250 kg/acre to lower soil pH towards 5.5" },
    ],
    organic: [
      { name: "Trichoderma viride", detail: "Mix 2.5 kg/acre with farmyard manure before planting" },
      { name: "Green manuring", detail: "Turn in dhaincha 45 days before planting" },
    ],
    cultural: [
      { name: "Irrigation timing", detail: "Irrigate every 7–8 days during tuber set" },
      { name: "Rotation", detail: "Rotate with cereals for 3–4 years" },
    ],
  },
  {
    id: "apple-cedar-rust",
    sample: "Apple Rust",
    crop: "Apple",
    disease: "Cedar Apple Rust",
    pathogen: "Gymnosporangium juniperi-virginianae",
    pathogenType: "Fungal pathogen",
    family: "Rosaceae",
    confidence: 93.1,
    severity: "Early leaf spotting (Stage 1)",
    action: "Spray at pink bud stage and remove nearby juniper hosts.",
    chemical: [
      { name: "Hexaconazole 5% EC", detail: "1 ml per litre at pink bud and petal fall" },
      { name: "Mancozeb 75% WP", detail: "3 g per litre at 10–14 day intervals" },
    ],
    organic: [
      { name: "Neem oil", detail: "3 ml per litre, every 10 days in wet weather" },
      { name: "Wettable sulphur", detail: "2 g per litre; avoid above 30°C" },
    ],
    cultural: [
      { name: "Remove alternate hosts", detail: "Cut junipers within 200 m of the orchard" },
      { name: "Resistant varieties", detail: "Prefer tolerant cultivars when replanting" },
    ],
  },
  {
    id: "corn-gray-leaf-spot",
    sample: "Corn Spot",
    crop: "Maize",
    disease: "Gray Leaf Spot",
    pathogen: "Cercospora zeae-maydis",
    pathogenType: "Fungal pathogen",
    family: "Poaceae",
    confidence: 94.2,
    severity: "Lesions on lower canopy (Stage 2)",
    action: "Spray before tasselling if lesions reach the ear leaf.",
    chemical: [
      { name: "Azoxystrobin + Difenoconazole SC", detail: "1 ml per litre, one spray at tasselling" },
      { name: "Mancozeb 75% WP", detail: "2.5 g per litre, repeat after 10 days" },
    ],
    organic: [
      { name: "Pseudomonas fluorescens", detail: "10 g per litre foliar spray" },
      { name: "Neem seed kernel extract", detail: "5% spray to slow lesion spread" },
    ],
    cultural: [
      { name: "Residue management", detail: "Plough under infected residue after harvest" },
      { name: "Rotation", detail: "Rotate with soybean or pulses for one season" },
    ],
  },
];
