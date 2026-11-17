export type Product = {
  id: string;
  name: string;
  source: string;
  category: "Cereals" | "Pulses" | "Vegetables" | "Oilseeds" | "Cotton";
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  traits: string[];
  badges: string[];
};

export const PRODUCTS: Product[] = [
  { id: "hd3086", name: "HD-3086 Wheat Seeds", source: "Punjab Agricultural University", category: "Cereals", price: 45, unit: "kg", rating: 4.8, reviews: 245, traits: ["Yield: 55–60 quintals / acre", "Maturity: 135–140 days"], badges: ["Certified", "Rust Resistant"] },
  { id: "pr126", name: "PR-126 Basmati Paddy Seeds", source: "IARI", category: "Cereals", price: 60, unit: "kg", rating: 4.6, reviews: 198, traits: ["Maturity: 120–125 days", "Saves irrigation water"], badges: ["Certified", "Short Duration"] },
  { id: "ml1425", name: "Moong Dal Seeds ML-1425", source: "ICAR", category: "Pulses", price: 120, unit: "kg", rating: 4.9, reviews: 104, traits: ["Maturity: 65–70 days", "Yellow mosaic virus resistant"], badges: ["Certified", "Disease Resistant"] },
  { id: "dhm117", name: "Maize DHM-117 Hybrid", source: "ANGRAU", category: "Cereals", price: 380, unit: "packet", rating: 4.7, reviews: 156, traits: ["Yield: 32–36 quintals / acre", "Stay-green stalks"], badges: ["Certified", "Hybrid"] },
  { id: "jg14", name: "Chickpea JG-14", source: "JNKVV certified", category: "Pulses", price: 110, unit: "kg", rating: 4.7, reviews: 221, traits: ["Heat tolerant", "Wilt resistant"], badges: ["Late sowing"] },
  { id: "js9560", name: "Soybean JS-95-60", source: "JNKVV certified", category: "Oilseeds", price: 95, unit: "kg", rating: 4.5, reviews: 287, traits: ["Matures in 82 days", "Suits black soil"], badges: ["Early maturing"] },
  { id: "pusabold", name: "Mustard Pusa Bold", source: "IARI certified", category: "Oilseeds", price: 160, unit: "kg", rating: 4.6, reviews: 143, traits: ["40% oil content", "Bold grain"], badges: ["High oil"] },
  { id: "arkarakshak", name: "Tomato Arka Rakshak F1", source: "IIHR certified", category: "Vegetables", price: 650, unit: "10 g", rating: 4.8, reviews: 96, traits: ["Triple disease resistance", "Firm fruit for transport"], badges: ["Hybrid", "Disease resistant"] },
  { id: "rch659", name: "Bt Cotton RCH-659 BG-II", source: "GEAC approved", category: "Cotton", price: 864, unit: "packet", rating: 4.4, reviews: 409, traits: ["Bollworm tolerant", "Big boll size"], badges: ["Bollgard II"] },
];

export type Machine = {
  id: string;
  name: string;
  owner: string;
  distance: number;
  rate: number;
  per: "hour" | "acre" | "day";
  dayRate?: number;
  place: string;
  includes: string;
  rating: number;
  bookings: number;
};

export const MACHINES: Machine[] = [
  { id: "tractor", name: "Tractor 50 HP (Mahindra with Rotavator Attachment)", owner: "Punjab Agri Rentals", place: "Ludhiana", distance: 5, rate: 500, per: "hour", dayRate: 3500, includes: "Fuel included, trained operator included", rating: 4.8, bookings: 156 },
  { id: "harvester", name: "John Deere Combine Harvester (120 HP)", owner: "Kisan Yantra Kendra", place: "Khanna", distance: 8, rate: 1200, per: "hour", dayRate: 8500, includes: "Fuel included, trained operator included", rating: 4.9, bookings: 94 },
  { id: "drone", name: "Agricultural Spraying Drone (10L Tank)", owner: "SkyKrishi Drones", place: "Ludhiana", distance: 6, rate: 450, per: "acre", includes: "DGCA-certified pilot and chemical mixing included", rating: 4.7, bookings: 61 },
  { id: "seeder", name: "Happy Seeder (Zero-Tillage)", owner: "Custom Hiring Centre, Samrala", place: "Samrala", distance: 12, rate: 1500, per: "acre", includes: "Tractor and driver included · sows wheat without burning stubble", rating: 4.5, bookings: 48 },
];

export type Expert = { id: string; name: string; field: string; institute: string; rating: number; consultations: number; fee: number; languages: string[] };

export const EXPERTS: Expert[] = [
  { id: "dhaliwal", name: "Dr. H. S. Dhaliwal", field: "Soil & Agronomy Specialist", institute: "PAU", rating: 4.9, consultations: 1240, fee: 0, languages: ["Punjabi", "Hindi", "English"] },
  { id: "sharma", name: "Dr. Meena Sharma", field: "Plant Pathology Specialist", institute: "IARI", rating: 4.8, consultations: 980, fee: 0, languages: ["Hindi", "English"] },
  { id: "verma", name: "Dr. Sunita Verma", field: "Agricultural Economics Specialist", institute: "JNKVV", rating: 4.8, consultations: 640, fee: 0, languages: ["Hindi", "English"] },
  { id: "patil", name: "Dr. Anil Patil", field: "Horticulture Specialist", institute: "MPKV", rating: 4.7, consultations: 512, fee: 99, languages: ["Marathi", "Hindi", "English"] },
];

export type Scheme = {
  id: string;
  name: string;
  full: string;
  benefit: string;
  eligibility: string;
  documents: string[];
  status: string;
  url: string;
  needs: ("land" | "aadhaar" | "bank" | "notTaxpayer")[];
};

export const SCHEMES: Scheme[] = [
  { id: "pm-kisan", name: "PM-KISAN", full: "Pradhan Mantri Kisan Samman Nidhi", benefit: "₹6,000 / year (in 3 installments)", eligibility: "All landholding farmer families", documents: ["Aadhaar Card", "Land Ownership Papers", "Bank Account Details"], status: "Applications open", url: "https://pmkisan.gov.in", needs: ["land", "aadhaar", "bank", "notTaxpayer"] },
  { id: "pmfby", name: "PM Fasal Bima Yojana (PMFBY)", full: "Pradhan Mantri Fasal Bima Yojana", benefit: "Comprehensive crop loss insurance (2% premium for Kharif)", eligibility: "All farmers growing notified crops.", documents: ["Aadhaar card", "Bank account", "Land record or tenancy agreement", "Sowing certificate"], status: "Rabi enrolment till 31 Dec", url: "https://pmfby.gov.in", needs: ["aadhaar", "bank"] },
  { id: "pm-kusum", name: "PM Kusum Solar Pump Scheme", full: "Pradhan Mantri Kisan Urja Suraksha evam Utthaan Mahabhiyan", benefit: "Up to 60% subsidy for solar water pumps", eligibility: "Individual farmers, cooperatives and panchayats.", documents: ["Aadhaar card", "Land documents", "Bank account"], status: "State portal open", url: "https://pmkusum.mnre.gov.in", needs: ["land", "aadhaar", "bank"] },
  { id: "shc", name: "Soil Health Card Scheme", full: "Ministry of Agriculture & Farmers Welfare", benefit: "Free soil testing service", eligibility: "All farmers.", documents: ["Aadhaar card", "Land survey number"], status: "Always open", url: "https://soilhealth.dac.gov.in", needs: ["aadhaar"] },
  { id: "pmksy", name: "PMKSY", full: "Per Drop More Crop (Micro Irrigation)", benefit: "55% subsidy on drip and sprinkler systems for small farmers, 45% for others.", eligibility: "Farmers with their own or leased land and a water source.", documents: ["Aadhaar card", "Land records", "Bank account", "Water source proof"], status: "Applications open", url: "https://pmksy.gov.in", needs: ["land", "aadhaar", "bank"] },
  { id: "enam", name: "e-NAM", full: "National Agriculture Market", benefit: "Sell to buyers across 1,389 mandis online with transparent bidding.", eligibility: "Any farmer registered at a linked mandi.", documents: ["Aadhaar card", "Bank account"], status: "Registration open", url: "https://enam.gov.in", needs: ["aadhaar", "bank"] },
];

export type Comment = { id: string; author: string; text: string; at: string };
export type Post = {
  id: string;
  author: string;
  place: string;
  distance: number;
  at: string;
  text: string;
  likes: number;
  liked: boolean;
  comments: Comment[];
};

const hoursAgo = (h: number) => new Date(Date.now() - h * 3600_000).toISOString();

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    author: "Ramesh Yadav",
    place: "Berasia, Bhopal",
    distance: 2,
    at: hoursAgo(2),
    text: "Seeing initial aphid attack on mustard crops in North block. Anyone tried Neem spray?",
    likes: 24,
    liked: false,
    comments: [
      { id: "c1", author: "Vikram Joshi", text: "Imidacloprid 17.8 SL at 0.5 ml per litre worked for me. Spray in the evening.", at: hoursAgo(1.6) },
      { id: "c2", author: "Sunita Patel", text: "Neem oil 5 ml per litre if the attack is light. Check the yellow sticky traps first.", at: hoursAgo(1.2) },
      { id: "c3", author: "Harpreet Singh", text: "The KVK sent an advisory on this yesterday, same advice.", at: hoursAgo(0.8) },
      { id: "c3a", author: "Mohan Lal", text: "Neem spray worked for me last year when I caught it early.", at: hoursAgo(0.75) },
      { id: "c3b", author: "Kavita Sahu", text: "Seeing the same near the canal side. Mostly on the late-sown plots.", at: hoursAgo(0.7) },
      { id: "c3c", author: "Rajesh Meena", text: "Add a little soap solution so the neem sticks to the leaves.", at: hoursAgo(0.65) },
      { id: "c3d", author: "Anita Verma", text: "Ladybird beetles are back in our field too. Don't spray chemical if you see them.", at: hoursAgo(0.6) },
      { id: "c3e", author: "Ramesh Yadav", text: "Thanks everyone. Will try neem tomorrow morning and report back.", at: hoursAgo(0.55) },
      { id: "c3f", author: "Suresh Thakur", text: "Check under the leaves at the top of the plant, that's where they start.", at: hoursAgo(0.5) },
      { id: "c3g", author: "Vikram Joshi", text: "Cloudy weather is making it worse. Keep an eye after the next two days.", at: hoursAgo(0.4) },
      { id: "c3h", author: "Pooja Rajput", text: "The Krishi Sahayak chat gave me the same dose, 5 ml neem oil per litre.", at: hoursAgo(0.3) },
      { id: "c3i", author: "Harpreet Singh", text: "Yellow sticky traps cost about ₹10 each at the society store.", at: hoursAgo(0.2) },
    ],
  },
  {
    id: "p2",
    author: "Vikram Joshi",
    place: "Sehore",
    distance: 4,
    at: hoursAgo(5),
    text: "Wheat sowing completed using zero-tillage machine. Saved 30% diesel.",
    likes: 41,
    liked: false,
    comments: [{ id: "c4", author: "Mohan Lal", text: "Which machine did you hire? Thinking of trying it next week.", at: hoursAgo(4) }],
  },
  {
    id: "p3",
    author: "Sunita Patel",
    place: "Vidisha",
    distance: 5,
    at: hoursAgo(26),
    text: "Our custom hiring centre now has a Happy Seeder. Sow wheat straight into paddy stubble without burning it. Book through Rent Machinery.",
    likes: 63,
    liked: false,
    comments: [],
  },
];

export const NEARBY_FARMERS = [
  { name: "Ramesh Yadav", distance: 2, crop: "Mustard" },
  { name: "Vikram Joshi", distance: 4, crop: "Wheat" },
  { name: "Sunita Patel", distance: 5, crop: "Soybean" },
  { name: "Harpreet Singh", distance: 7, crop: "Chickpea" },
  { name: "Mohan Lal", distance: 9, crop: "Tomato" },
];
