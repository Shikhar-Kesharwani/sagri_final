// Comprehensive crop data for location-based recommendations

export interface CropData {
  id: string;
  name: string;
  hindiName: string;
  punjabiName: string;
  scientificName: string;
  category: 'cereal' | 'pulse' | 'oilseed' | 'cash' | 'vegetable' | 'fruit';
  sowingMonths: number[];
  harvestMonths: number[];
  duration: number; // days
  waterRequirement: 'low' | 'medium' | 'high';
  soilType: string[];
  temperature: { min: number; max: number }; // Celsius
  rainfall: { min: number; max: number }; // mm
  suitableStates: string[];
  diseases: string[];
  pests: string[];
  marketPrice: { min: number; max: number }; // per quintal
  avgYield: number; // quintals per acre
}

export const CROPS: CropData[] = [
  {
    id: 'wheat',
    name: 'Wheat',
    hindiName: 'गेहूं',
    punjabiName: 'ਕਣਕ',
    scientificName: 'Triticum aestivum',
    category: 'cereal',
    sowingMonths: [10, 11, 12], // Oct-Dec
    harvestMonths: [3, 4], // Mar-Apr
    duration: 120,
    waterRequirement: 'medium',
    soilType: ['Loamy', 'Clay loam', 'Sandy loam'],
    temperature: { min: 10, max: 25 },
    rainfall: { min: 400, max: 600 },
    suitableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan', 'Bihar'],
    diseases: ['Rust', 'Smut', 'Blight', 'Powdery Mildew'],
    pests: ['Aphids', 'Termites', 'Army worms'],
    marketPrice: { min: 1800, max: 2500 },
    avgYield: 18,
  },
  {
    id: 'rice',
    name: 'Rice',
    hindiName: 'धान',
    punjabiName: 'ਝੋਨਾ',
    scientificName: 'Oryza sativa',
    category: 'cereal',
    sowingMonths: [6, 7], // Jun-Jul
    harvestMonths: [10, 11], // Oct-Nov
    duration: 120,
    waterRequirement: 'high',
    soilType: ['Clay', 'Clay loam', 'Alluvial'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 1000, max: 2000 },
    suitableStates: ['Punjab', 'Haryana', 'Uttar Pradesh', 'West Bengal', 'Andhra Pradesh', 'Tamil Nadu'],
    diseases: ['Blast', 'Bacterial blight', 'Sheath blight'],
    pests: ['Stem borer', 'Leaf folder', 'Brown plant hopper'],
    marketPrice: { min: 2000, max: 3500 },
    avgYield: 20,
  },
  {
    id: 'cotton',
    name: 'Cotton',
    hindiName: 'कपास',
    punjabiName: 'ਕਪਾਹ',
    scientificName: 'Gossypium hirsutum',
    category: 'cash',
    sowingMonths: [4, 5], // Apr-May
    harvestMonths: [10, 11, 12], // Oct-Dec
    duration: 180,
    waterRequirement: 'medium',
    soilType: ['Black cotton soil', 'Alluvial', 'Sandy loam'],
    temperature: { min: 21, max: 35 },
    rainfall: { min: 500, max: 1000 },
    suitableStates: ['Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Punjab', 'Haryana', 'Rajasthan'],
    diseases: ['Wilt', 'Root rot', 'Leaf curl', 'Boll rot'],
    pests: ['Bollworm', 'Aphids', 'Whitefly', 'Jassids'],
    marketPrice: { min: 5500, max: 7500 },
    avgYield: 8,
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    hindiName: 'गन्ना',
    punjabiName: 'ਗੰਨਾ',
    scientificName: 'Saccharum officinarum',
    category: 'cash',
    sowingMonths: [2, 3, 10, 11], // Feb-Mar, Oct-Nov
    harvestMonths: [12, 1, 2], // Dec-Feb
    duration: 365,
    waterRequirement: 'high',
    soilType: ['Loamy', 'Clay loam', 'Alluvial'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 750, max: 1500 },
    suitableStates: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Punjab', 'Haryana'],
    diseases: ['Red rot', 'Smut', 'Wilt', 'Grassy shoot'],
    pests: ['Early shoot borer', 'Top borer', 'Pyrilla'],
    marketPrice: { min: 280, max: 350 },
    avgYield: 300,
  },
  {
    id: 'maize',
    name: 'Maize',
    hindiName: 'मक्का',
    punjabiName: 'ਮੱਕੀ',
    scientificName: 'Zea mays',
    category: 'cereal',
    sowingMonths: [6, 7], // Jun-Jul (Kharif)
    harvestMonths: [9, 10], // Sep-Oct
    duration: 90,
    waterRequirement: 'medium',
    soilType: ['Loamy', 'Sandy loam', 'Clay loam'],
    temperature: { min: 18, max: 30 },
    rainfall: { min: 500, max: 900 },
    suitableStates: ['Karnataka', 'Madhya Pradesh', 'Bihar', 'Andhra Pradesh', 'Rajasthan', 'Maharashtra'],
    diseases: ['Maydis leaf blight', 'Common rust', 'Downy mildew'],
    pests: ['Stem borer', 'Fall armyworm', 'Shoot fly'],
    marketPrice: { min: 1500, max: 2200 },
    avgYield: 15,
  },
  {
    id: 'bajra',
    name: 'Pearl Millet (Bajra)',
    hindiName: 'बाजरा',
    punjabiName: 'ਬਾਜਰਾ',
    scientificName: 'Pennisetum glaucum',
    category: 'cereal',
    sowingMonths: [6, 7], // Jun-Jul
    harvestMonths: [9, 10], // Sep-Oct
    duration: 75,
    waterRequirement: 'low',
    soilType: ['Sandy loam', 'Loamy', 'Light soil'],
    temperature: { min: 25, max: 35 },
    rainfall: { min: 250, max: 500 },
    suitableStates: ['Rajasthan', 'Uttar Pradesh', 'Maharashtra', 'Gujarat', 'Haryana'],
    diseases: ['Downy mildew', 'Ergot', 'Smut'],
    pests: ['Shoot fly', 'Stem borer', 'Aphids'],
    marketPrice: { min: 1800, max: 2500 },
    avgYield: 10,
  },
  {
    id: 'jowar',
    name: 'Sorghum (Jowar)',
    hindiName: 'ज्वार',
    punjabiName: 'ਜਵਾਰ',
    scientificName: 'Sorghum bicolor',
    category: 'cereal',
    sowingMonths: [6, 7], // Jun-Jul
    harvestMonths: [10, 11], // Oct-Nov
    duration: 110,
    waterRequirement: 'low',
    soilType: ['Black soil', 'Loamy', 'Sandy loam'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 400, max: 800 },
    suitableStates: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Andhra Pradesh', 'Tamil Nadu'],
    diseases: ['Grain mold', 'Leaf blight', 'Charcoal rot'],
    pests: ['Shoot fly', 'Stem borer', 'Midge'],
    marketPrice: { min: 2000, max: 2800 },
    avgYield: 12,
  },
  {
    id: 'mustard',
    name: 'Mustard',
    hindiName: 'सरसों',
    punjabiName: 'ਸਰ੍ਹੋਂ',
    scientificName: 'Brassica juncea',
    category: 'oilseed',
    sowingMonths: [10, 11], // Oct-Nov
    harvestMonths: [2, 3], // Feb-Mar
    duration: 120,
    waterRequirement: 'low',
    soilType: ['Loamy', 'Sandy loam', 'Clay loam'],
    temperature: { min: 10, max: 25 },
    rainfall: { min: 250, max: 400 },
    suitableStates: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'Gujarat'],
    diseases: ['White rust', 'Alternaria blight', 'Powdery mildew'],
    pests: ['Aphids', 'Sawfly', 'Painted bug'],
    marketPrice: { min: 4500, max: 6500 },
    avgYield: 8,
  },
  {
    id: 'soybean',
    name: 'Soybean',
    hindiName: 'सोयाबीन',
    punjabiName: 'ਸੋਇਆਬੀਨ',
    scientificName: 'Glycine max',
    category: 'oilseed',
    sowingMonths: [6, 7], // Jun-Jul
    harvestMonths: [10, 11], // Oct-Nov
    duration: 95,
    waterRequirement: 'medium',
    soilType: ['Black soil', 'Loamy', 'Clay loam'],
    temperature: { min: 20, max: 30 },
    rainfall: { min: 500, max: 900 },
    suitableStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka', 'Telangana'],
    diseases: ['Rust', 'Yellow mosaic virus', 'Bacterial pustule'],
    pests: ['Stem fly', 'Girdle beetle', 'Semilooper'],
    marketPrice: { min: 3500, max: 5000 },
    avgYield: 12,
  },
  {
    id: 'groundnut',
    name: 'Groundnut',
    hindiName: 'मूंगफली',
    punjabiName: 'ਮੂੰਗਫਲੀ',
    scientificName: 'Arachis hypogaea',
    category: 'oilseed',
    sowingMonths: [6, 7], // Jun-Jul
    harvestMonths: [10, 11], // Oct-Nov
    duration: 115,
    waterRequirement: 'medium',
    soilType: ['Sandy loam', 'Loamy', 'Red soil'],
    temperature: { min: 20, max: 30 },
    rainfall: { min: 500, max: 1000 },
    suitableStates: ['Gujarat', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Maharashtra'],
    diseases: ['Tikka disease', 'Rust', 'Collar rot'],
    pests: ['Leaf miner', 'Aphids', 'Thrips'],
    marketPrice: { min: 5000, max: 6500 },
    avgYield: 10,
  },
  {
    id: 'pulses',
    name: 'Pulses (Mixed)',
    hindiName: 'दालें',
    punjabiName: 'ਦਾਲਾਂ',
    scientificName: 'Various legumes',
    category: 'pulse',
    sowingMonths: [10, 11], // Oct-Nov
    harvestMonths: [3, 4], // Mar-Apr
    duration: 120,
    waterRequirement: 'low',
    soilType: ['Loamy', 'Sandy loam', 'Black soil'],
    temperature: { min: 15, max: 30 },
    rainfall: { min: 300, max: 700 },
    suitableStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Uttar Pradesh', 'Karnataka'],
    diseases: ['Wilt', 'Root rot', 'Pod borer'],
    pests: ['Pod borer', 'Aphids', 'Thrips'],
    marketPrice: { min: 5000, max: 8000 },
    avgYield: 6,
  },
  {
    id: 'barley',
    name: 'Barley',
    hindiName: 'जौ',
    punjabiName: 'ਜੌਂ',
    scientificName: 'Hordeum vulgare',
    category: 'cereal',
    sowingMonths: [10, 11], // Oct-Nov
    harvestMonths: [3, 4], // Mar-Apr
    duration: 120,
    waterRequirement: 'low',
    soilType: ['Loamy', 'Sandy loam', 'Clay loam'],
    temperature: { min: 10, max: 20 },
    rainfall: { min: 300, max: 500 },
    suitableStates: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Bihar'],
    diseases: ['Stripe rust', 'Loose smut', 'Leaf blight'],
    pests: ['Aphids', 'Termites', 'Shoot fly'],
    marketPrice: { min: 1400, max: 1900 },
    avgYield: 15,
  },
  {
    id: 'vegetables',
    name: 'Vegetables',
    hindiName: 'सब्जियां',
    punjabiName: 'ਸਬਜ਼ੀਆਂ',
    scientificName: 'Various species',
    category: 'vegetable',
    sowingMonths: [1, 2, 3, 6, 7, 8, 9, 10, 11, 12], // Year-round
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year-round
    duration: 60,
    waterRequirement: 'medium',
    soilType: ['Loamy', 'Sandy loam', 'Organic-rich'],
    temperature: { min: 15, max: 35 },
    rainfall: { min: 400, max: 1200 },
    suitableStates: ['All states'],
    diseases: ['Leaf spot', 'Powdery mildew', 'Damping off'],
    pests: ['Aphids', 'Fruit borers', 'Whitefly'],
    marketPrice: { min: 800, max: 3000 },
    avgYield: 100,
  },
  {
    id: 'fruits',
    name: 'Fruits',
    hindiName: 'फल',
    punjabiName: 'ਫਲ',
    scientificName: 'Various species',
    category: 'fruit',
    sowingMonths: [6, 7, 8], // Jun-Aug (varies by fruit)
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], // Year-round
    duration: 365,
    waterRequirement: 'medium',
    soilType: ['Loamy', 'Sandy loam', 'Well-drained'],
    temperature: { min: 20, max: 35 },
    rainfall: { min: 600, max: 1500 },
    suitableStates: ['All states'],
    diseases: ['Fruit rot', 'Anthracnose', 'Canker'],
    pests: ['Fruit fly', 'Mealy bugs', 'Scale insects'],
    marketPrice: { min: 2000, max: 8000 },
    avgYield: 80,
  },
];

// Get crop by ID
export const getCropById = (id: string): CropData | undefined => {
  return CROPS.find(crop => crop.id === id);
};

// Get crops suitable for a state
export const getCropsByState = (state: string): CropData[] => {
  return CROPS.filter(crop => 
    crop.suitableStates.includes(state) || crop.suitableStates.includes('All states')
  );
};

// Get crops by category
export const getCropsByCategory = (category: string): CropData[] => {
  return CROPS.filter(crop => crop.category === category);
};

// Get crops suitable for current month
export const getCropsBySowingMonth = (month: number): CropData[] => {
  return CROPS.filter(crop => crop.sowingMonths.includes(month));
};

// Get crop price for location
export const getCropPrice = (cropId: string, district: string): number => {
  const crop = getCropById(cropId);
  if (!crop) return 0;
  
  // In real app, this would fetch location-specific prices from API
  // For now, return average of min and max
  return (crop.marketPrice.min + crop.marketPrice.max) / 2;
};

// Check if crop is suitable for location
export const isCropSuitableForLocation = (
  cropId: string, 
  state: string, 
  soilType?: string
): boolean => {
  const crop = getCropById(cropId);
  if (!crop) return false;
  
  const stateMatch = crop.suitableStates.includes(state) || crop.suitableStates.includes('All states');
  const soilMatch = !soilType || crop.soilType.some(s => 
    s.toLowerCase().includes(soilType.toLowerCase())
  );
  
  return stateMatch && soilMatch;
};
