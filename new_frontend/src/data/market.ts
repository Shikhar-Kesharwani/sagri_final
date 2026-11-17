export type Commodity = {
  id: string;
  name: string;
  short: string;
  msp: number | null;
  /** Today's modal price (₹/quintal) at the reference mandi. */
  base: number;
  change: number;
  /** Absolute move since yesterday (₹/quintal). */
  dayChange: number;
  /** Price multipliers for the next five months vs. today. */
  outlook: number[];
  /** Price multipliers for the previous three months vs. today. */
  past: number[];
};

export const COMMODITIES: Commodity[] = [
  {
    id: "wheat",
    name: "Sharbati Wheat",
    short: "Wheat",
    msp: 2125,
    base: 2176,
    change: 3.4,
    dayChange: 24,
    outlook: [2195 / 2176, 2210 / 2176, 2245 / 2176, 2270 / 2176, 2295 / 2176],
    past: [2120 / 2176, 2135 / 2176, 2152 / 2176],
  },
  {
    id: "paddy",
    name: "Basmati Paddy",
    short: "Paddy",
    msp: 2300,
    base: 3450,
    change: 1.2,
    dayChange: 41,
    outlook: [1.008, 1.017, 1.026, 1.02, 1.012],
    past: [0.97, 0.98, 0.99],
  },
  {
    id: "chana",
    name: "Desi Chana",
    short: "Chana",
    msp: 5440,
    base: 5850,
    change: -0.8,
    dayChange: -47,
    outlook: [1.0, 1.016, 1.038, 1.057, 1.031],
    past: [1.02, 1.01, 1.005],
  },
  {
    id: "tomato",
    name: "Hybrid Tomato",
    short: "Tomato",
    msp: null,
    base: 1850,
    change: -4.8,
    dayChange: -93,
    outlook: [0.92, 0.88, 0.95, 1.08, 1.15],
    past: [1.22, 1.14, 1.05],
  },
  {
    id: "cotton",
    name: "Medium Staple Cotton",
    short: "Cotton",
    msp: 6620,
    base: 6183,
    change: 2.1,
    dayChange: 127,
    outlook: [1.012, 1.028, 1.021, 1.04, 1.052],
    past: [0.96, 0.975, 0.99],
  },
];

export const commodityById = (id: string) => COMMODITIES.find((c) => c.id === id) ?? COMMODITIES[0];

export type Mandi = { name: string; distance: number; factor: number; arrivals: number; transport?: number };

/** Nearby mandis per state. `factor` scales the commodity price at that mandi. */
export const MANDIS_BY_STATE: Record<string, Mandi[]> = {
  "Madhya Pradesh": [
    { name: "Bhopal Mandi", distance: 12, factor: 1, arrivals: 2400, transport: 20 },
    { name: "Sehore Mandi", distance: 38, factor: 2192 / 2176, arrivals: 1800, transport: 44 },
    { name: "Hoshangabad Mandi", distance: 74, factor: 2215 / 2176, arrivals: 3100, transport: 80 },
    { name: "Vidisha Mandi", distance: 54, factor: 2160 / 2176, arrivals: 900, transport: 50 },
  ],
  Punjab: [
    { name: "Ludhiana Grain Market", distance: 15, factor: 1.012, arrivals: 6100 },
    { name: "Jalandhar Mandi", distance: 30, factor: 1.004, arrivals: 3300 },
    { name: "Amritsar Mandi", distance: 45, factor: 1.024, arrivals: 3900 },
  ],
  Haryana: [
    { name: "Karnal Anaj Mandi", distance: 20, factor: 1.006, arrivals: 5200 },
    { name: "Panipat Mandi", distance: 34, factor: 0.996, arrivals: 2100 },
    { name: "Kurukshetra Mandi", distance: 40, factor: 1.015, arrivals: 2600 },
  ],
  Gujarat: [
    { name: "Rajkot Mandi", distance: 10, factor: 1, arrivals: 4800 },
    { name: "Gondal Mandi", distance: 38, factor: 1.011, arrivals: 3600 },
    { name: "Jamnagar Mandi", distance: 90, factor: 1.026, arrivals: 1900 },
  ],
  Maharashtra: [
    { name: "Nagpur Kalamna Mandi", distance: 14, factor: 0.998, arrivals: 3700 },
    { name: "Wardha Mandi", distance: 76, factor: 1.018, arrivals: 1600 },
    { name: "Amravati Mandi", distance: 150, factor: 1.03, arrivals: 2400 },
  ],
  "Uttar Pradesh": [
    { name: "Lucknow Naveen Mandi", distance: 11, factor: 0.994, arrivals: 3900 },
    { name: "Barabanki Mandi", distance: 32, factor: 1.006, arrivals: 1700 },
    { name: "Kanpur Chakarpur Mandi", distance: 88, factor: 1.021, arrivals: 4300 },
  ],
  Rajasthan: [
    { name: "Jaipur Muhana Mandi", distance: 16, factor: 1.003, arrivals: 3500 },
    { name: "Kota Bhamashah Mandi", distance: 250, factor: 1.034, arrivals: 6200 },
  ],
  Bihar: [
    { name: "Patna Bazar Samiti", distance: 9, factor: 0.99, arrivals: 2200 },
    { name: "Ara Mandi", distance: 58, factor: 1.008, arrivals: 1100 },
  ],
};

export const transportCost = (distanceKm: number) => Math.round(8 + distanceKm);

/** Live rates shown on the Market Rates screen (₹/quintal). */
export type MandiRate = { crop: string; price: number; change: number };
export const MARKET_BOARD: Record<string, { mandi: string; address?: string; distance: number; query: string; rates: MandiRate[] }[]> = {
  Punjab: [
    {
      mandi: "Ludhiana Mandi",
      address: "Grain Market, Ludhiana",
      distance: 15,
      query: "Ludhiana Grain Market",
      rates: [
        { crop: "Wheat", price: 2450, change: 5 },
        { crop: "Rice", price: 3200, change: -3 },
        { crop: "Cotton", price: 6800, change: 8 },
      ],
    },
    {
      mandi: "Amritsar Mandi",
      address: "Grain Mandi, Amritsar",
      distance: 45,
      query: "Amritsar Grain Mandi",
      rates: [
        { crop: "Wheat", price: 2480, change: 4 },
        { crop: "Rice", price: 3120, change: -2 },
        { crop: "Cotton", price: 6750, change: 6 },
      ],
    },
    {
      mandi: "Jalandhar Mandi",
      address: "Grain Mandi, Jalandhar",
      distance: 30,
      query: "Jalandhar Grain Mandi",
      rates: [
        { crop: "Wheat", price: 2430, change: 3 },
        { crop: "Rice", price: 3180, change: 1 },
        { crop: "Cotton", price: 6820, change: 7 },
      ],
    },
  ],
  "Madhya Pradesh": [
    {
      mandi: "Bhopal Mandi",
      distance: 12,
      query: "Bhopal Karond Krishi Upaj Mandi",
      rates: [
        { crop: "Wheat", price: 2176, change: 3.4 },
        { crop: "Soybean", price: 4520, change: 1.1 },
        { crop: "Chana", price: 5790, change: -0.6 },
      ],
    },
    {
      mandi: "Sehore Mandi",
      distance: 38,
      query: "Sehore Krishi Upaj Mandi",
      rates: [
        { crop: "Wheat", price: 2192, change: 2.8 },
        { crop: "Soybean", price: 4560, change: 1.6 },
        { crop: "Chana", price: 5850, change: -0.8 },
      ],
    },
    {
      mandi: "Hoshangabad Mandi",
      distance: 74,
      query: "Hoshangabad Krishi Upaj Mandi",
      rates: [
        { crop: "Wheat", price: 2215, change: 3.9 },
        { crop: "Soybean", price: 4490, change: 0.4 },
        { crop: "Chana", price: 5810, change: 0.3 },
      ],
    },
  ],
  Haryana: [
    {
      mandi: "Karnal Anaj Mandi",
      distance: 20,
      query: "Karnal Anaj Mandi",
      rates: [
        { crop: "Wheat", price: 2440, change: 4.2 },
        { crop: "Paddy", price: 3450, change: 1.2 },
        { crop: "Mustard", price: 5710, change: 0.9 },
      ],
    },
    {
      mandi: "Kurukshetra Mandi",
      distance: 40,
      query: "Kurukshetra Anaj Mandi",
      rates: [
        { crop: "Wheat", price: 2460, change: 3.6 },
        { crop: "Paddy", price: 3410, change: 0.8 },
        { crop: "Mustard", price: 5680, change: -0.4 },
      ],
    },
  ],
};

/** Dashboard live mandi rates table. */
export const DASHBOARD_RATES = [
  { commodity: "Sharbati Wheat", id: "wheat", mandi: "Bhopal Mandi", price: 2176, change: 3.4 },
  { commodity: "Basmati Paddy", id: "paddy", mandi: "Karnal Mandi", price: 3450, change: 1.2 },
  { commodity: "Desi Chana (Gram)", id: "chana", mandi: "Indore Mandi", price: 5850, change: -0.8 },
  { commodity: "Hybrid Tomato", id: "tomato", mandi: "Azadpur Mandi", price: 1850, change: -4.8 },
  { commodity: "Medium Cotton", id: "cotton", mandi: "Rajkot Mandi", price: 6183, change: 2.1 },
];

/** Benchmark MSP / FRP per quintal used by Sell Produce. */
export const MSP: Record<string, number> = {
  Wheat: 2125,
  Rice: 2300,
  Cotton: 6620,
  Sugarcane: 340,
  Maize: 2225,
  Pulses: 7550,
  Soybean: 4892,
  Mustard: 5650,
};
