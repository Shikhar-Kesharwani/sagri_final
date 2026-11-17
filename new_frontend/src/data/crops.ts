/** Mean growing conditions per crop (N-P-K kg/ha, °C, %, pH, mm) for the 22-crop recommendation model. */
export type CropProfile = {
  id: string;
  name: string;
  n: number;
  p: number;
  k: number;
  temp: number;
  humidity: number;
  ph: number;
  rain: number;
  seasons: ("Kharif" | "Rabi" | "Zaid")[];
  soils: string[];
  yield: [number, number];
  price: number;
  advice: string;
  /** Display descriptor, e.g. "Kharif Cash Crop". */
  alias?: string;
  /** Mandi the price is quoted from. */
  market?: string;
  /** What ideal N and pH support for this crop. */
  focus?: string;
  note?: string;
};

export const CROPS: CropProfile[] = [
  { id: "cotton", name: "Cotton", n: 118, p: 46, k: 20, temp: 24, humidity: 80, ph: 6.9, rain: 80, seasons: ["Kharif"], soils: ["Black", "Alluvial"], yield: [18, 22], price: 6183, advice: "Apply urea in two split doses at 30 and 60 days after sowing.", alias: "Kharif Cash Crop", market: "Rajkot Mandi", focus: "vegetative boll formation with minimal osmotic stress" },
  { id: "maize", name: "Maize", n: 78, p: 48, k: 20, temp: 22.4, humidity: 65, ph: 6.2, rain: 84, seasons: ["Kharif", "Rabi"], soils: ["Alluvial", "Black", "Red"], yield: [28, 32], price: 2443, advice: "Basal DAP at sowing; top-dress urea at knee-high stage.", alias: "Hybrid Corn", market: "Indore Mandi", focus: "rapid stalk and cob development" },
  { id: "blackgram", name: "Blackgram", n: 40, p: 67, k: 19, temp: 30, humidity: 65, ph: 7.1, rain: 68, seasons: ["Kharif", "Zaid"], soils: ["Black", "Red", "Alluvial"], yield: [5, 7], price: 7400, advice: "Treat seed with Rhizobium culture; apply SSP for phosphorus.", alias: "Urad Pulse", market: "Indore Mandi", focus: "pod setting in warm conditions", note: "Nitrogen-fixing legume to enrich soil for next Rabi season." },
  { id: "rice", name: "Rice", n: 80, p: 48, k: 40, temp: 23.7, humidity: 82, ph: 6.4, rain: 236, seasons: ["Kharif"], soils: ["Clayey", "Alluvial"], yield: [20, 25], price: 2300, advice: "Keep 5 cm standing water until panicle initiation." },
  { id: "chickpea", name: "Chickpea", n: 40, p: 68, k: 80, temp: 18.9, humidity: 17, ph: 7.3, rain: 80, seasons: ["Rabi"], soils: ["Black", "Sandy loam"], yield: [8, 10], price: 5440, advice: "Avoid excess irrigation; one light watering at flowering." },
  { id: "kidneybeans", name: "Kidney Beans", n: 20, p: 67, k: 20, temp: 20, humidity: 21.6, ph: 5.7, rain: 106, seasons: ["Rabi"], soils: ["Sandy loam", "Red"], yield: [6, 8], price: 7800, advice: "Needs well-drained soil; apply phosphorus at sowing." },
  { id: "pigeonpeas", name: "Pigeon Peas", n: 21, p: 68, k: 20, temp: 27.7, humidity: 48, ph: 5.8, rain: 149, seasons: ["Kharif"], soils: ["Black", "Red"], yield: [7, 9], price: 7550, advice: "Sow on ridges; intercrop with soybean for extra income." },
  { id: "mothbeans", name: "Moth Beans", n: 21, p: 48, k: 20, temp: 28.2, humidity: 53, ph: 6.8, rain: 51, seasons: ["Kharif"], soils: ["Sandy loam"], yield: [3, 5], price: 6200, advice: "Drought-hardy; suited to light sandy soils." },
  { id: "mungbean", name: "Mung Bean", n: 21, p: 47, k: 20, temp: 28.5, humidity: 85.5, ph: 6.7, rain: 48, seasons: ["Kharif", "Zaid"], soils: ["Sandy loam", "Alluvial"], yield: [4, 6], price: 8682, advice: "Short 65-day crop; fits between wheat and paddy." },
  { id: "lentil", name: "Lentil", n: 19, p: 68, k: 19, temp: 24.5, humidity: 64.8, ph: 6.9, rain: 46, seasons: ["Rabi"], soils: ["Sandy loam", "Alluvial"], yield: [5, 7], price: 6425, advice: "Seed rate 40 kg/ha; one irrigation at pod filling." },
  { id: "pomegranate", name: "Pomegranate", n: 19, p: 19, k: 40, temp: 21.8, humidity: 90, ph: 6.4, rain: 107, seasons: ["Kharif", "Rabi"], soils: ["Sandy loam", "Red"], yield: [40, 60], price: 6000, advice: "Drip irrigate; bag fruits to prevent fruit borer." },
  { id: "banana", name: "Banana", n: 100, p: 82, k: 50, temp: 27.4, humidity: 80, ph: 6, rain: 105, seasons: ["Kharif"], soils: ["Alluvial", "Sandy loam"], yield: [250, 300], price: 1200, advice: "Apply potash monthly; prop plants before bunch emergence." },
  { id: "mango", name: "Mango", n: 20, p: 27, k: 30, temp: 31.2, humidity: 50, ph: 5.8, rain: 95, seasons: ["Zaid"], soils: ["Alluvial", "Red"], yield: [35, 50], price: 3500, advice: "Withhold irrigation 2 months before flowering." },
  { id: "grapes", name: "Grapes", n: 23, p: 133, k: 200, temp: 23.8, humidity: 81.9, ph: 6, rain: 70, seasons: ["Rabi"], soils: ["Sandy loam", "Black"], yield: [80, 100], price: 4500, advice: "Foundation pruning in April, fruit pruning in October." },
  { id: "watermelon", name: "Watermelon", n: 99, p: 17, k: 50, temp: 25.6, humidity: 85, ph: 6.5, rain: 51, seasons: ["Zaid"], soils: ["Sandy loam"], yield: [100, 150], price: 900, advice: "Mulch beds; stop irrigation a week before harvest." },
  { id: "muskmelon", name: "Muskmelon", n: 100, p: 18, k: 50, temp: 28.7, humidity: 92, ph: 6.4, rain: 25, seasons: ["Zaid"], soils: ["Sandy loam"], yield: [60, 80], price: 1500, advice: "Raised beds with drip; watch for fruit fly." },
  { id: "apple", name: "Apple", n: 21, p: 134, k: 200, temp: 22.6, humidity: 92, ph: 5.9, rain: 113, seasons: ["Rabi"], soils: ["Sandy loam"], yield: [60, 80], price: 6000, advice: "Needs chilling hours; suited to hill districts." },
  { id: "orange", name: "Orange", n: 20, p: 17, k: 10, temp: 22.8, humidity: 92, ph: 7, rain: 110, seasons: ["Rabi"], soils: ["Sandy loam", "Black"], yield: [70, 90], price: 3000, advice: "Apply zinc sulphate spray before flowering." },
  { id: "papaya", name: "Papaya", n: 50, p: 59, k: 50, temp: 33.7, humidity: 92, ph: 6.7, rain: 143, seasons: ["Kharif", "Zaid"], soils: ["Sandy loam", "Alluvial"], yield: [150, 200], price: 1400, advice: "Avoid waterlogging; rogue virus-infected plants early." },
  { id: "coconut", name: "Coconut", n: 22, p: 17, k: 31, temp: 27.4, humidity: 95, ph: 6, rain: 176, seasons: ["Kharif"], soils: ["Sandy loam", "Laterite"], yield: [40, 60], price: 2500, advice: "Basin irrigation and husk burial conserve moisture." },
  { id: "jute", name: "Jute", n: 78, p: 47, k: 40, temp: 25, humidity: 80, ph: 6.7, rain: 175, seasons: ["Kharif"], soils: ["Alluvial", "Clayey"], yield: [22, 28], price: 5050, advice: "Ret in slow-moving clean water for best fibre." },
  { id: "coffee", name: "Coffee", n: 101, p: 29, k: 30, temp: 25.5, humidity: 58.9, ph: 6.8, rain: 158, seasons: ["Kharif"], soils: ["Laterite", "Red"], yield: [7, 10], price: 25000, advice: "Maintain two-tier shade; prune after harvest." },
];

export const SOIL_TYPES = ["Alluvial", "Black", "Red", "Laterite", "Clayey", "Sandy loam"];
export const SEASONS = ["Kharif", "Rabi", "Zaid"] as const;
export type Season = (typeof SEASONS)[number];
