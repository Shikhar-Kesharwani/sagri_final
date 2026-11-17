export type District = { id: string; name: string; state: string; short: string; lat: number; lon: number; zone?: string };

/** ICAR agro-climatic zones for the districts SAGRI covers. */
export const AGRO_ZONES: Record<string, string> = {
  bhopal: "Central Narmada Valley",
  indore: "Malwa Plateau",
  jabalpur: "Kymore Plateau & Satpura Hills",
  ludhiana: "Central Plain Zone (Punjab)",
  amritsar: "Sub-Mountain Undulating Zone",
  karnal: "Eastern Haryana Zone",
  jaipur: "Semi-Arid Eastern Plain",
  rajkot: "North Saurashtra",
  nagpur: "Eastern Vidarbha",
  pune: "Western Maharashtra Plain",
  lucknow: "Central Plain Zone (UP)",
  patna: "North-West Alluvial Plain",
};

export const DISTRICTS: District[] = [
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", short: "MP", lat: 23.2599, lon: 77.4126 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", short: "MP", lat: 22.7196, lon: 75.8577 },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", short: "MP", lat: 23.1815, lon: 79.9864 },
  { id: "ludhiana", name: "Ludhiana", state: "Punjab", short: "PB", lat: 30.901, lon: 75.8573 },
  { id: "amritsar", name: "Amritsar", state: "Punjab", short: "PB", lat: 31.634, lon: 74.8723 },
  { id: "karnal", name: "Karnal", state: "Haryana", short: "HR", lat: 29.6857, lon: 76.9905 },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", short: "RJ", lat: 26.9124, lon: 75.7873 },
  { id: "rajkot", name: "Rajkot", state: "Gujarat", short: "GJ", lat: 22.3039, lon: 70.8022 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", short: "MH", lat: 21.1458, lon: 79.0882 },
  { id: "pune", name: "Pune", state: "Maharashtra", short: "MH", lat: 18.5204, lon: 73.8567 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", short: "UP", lat: 26.8467, lon: 80.9462 },
  { id: "patna", name: "Patna", state: "Bihar", short: "BR", lat: 25.5941, lon: 85.1376 },
];

export const districtById = (id: string) => DISTRICTS.find((d) => d.id === id) ?? DISTRICTS[0];
export const STATES = Array.from(new Set(DISTRICTS.map((d) => d.state)));
