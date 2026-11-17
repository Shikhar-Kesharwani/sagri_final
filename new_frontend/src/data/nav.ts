import {
  BookOpenCheck,
  CalendarRange,
  CloudSun,
  FileClock,
  HandCoins,
  Landmark,
  LayoutDashboard,
  Leaf,
  LineChart,
  MessagesSquare,
  Microscope,
  Radar,
  ShoppingBasket,
  Sprout,
  Store,
  Tractor,
  Users,
  Wallet,
  ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = { to: string; label: string; icon: LucideIcon; blurb: string };

export const NAV_GROUPS: { label: string; items: NavItem[] }[] = [
  {
    label: "Farm Intelligence",
    items: [
      { to: "/dashboard", label: "Farm Command Centre", icon: LayoutDashboard, blurb: "Real-time agro dashboard & daily operations" },
      { to: "/crop-recommendation", label: "Crop Recommendation", icon: Sprout, blurb: "Multi-variable soil mapping for 22 crops" },
      { to: "/disease-detection", label: "Plant Disease Vision", icon: Microscope, blurb: "Identify 38 leaf pathogens with CIBRC remedies" },
      { to: "/risk-prediction", label: "Crop Risk Radar", icon: Radar, blurb: "Drought, heat, and yield shortfall detector" },
      { to: "/soil-health", label: "Soil Health & NPK", icon: Leaf, blurb: "Nutrient deficit and fertilizer calculator" },
      { to: "/weather", label: "Live Weather & Rain Radar", icon: CloudSun, blurb: "Hourly temperatures, spray advisories & 7-day outlook" },
      { to: "/crop-calendar", label: "AI Crop Calendar", icon: CalendarRange, blurb: "Stage-by-stage sowing, irrigation and harvest scheduler" },
    ],
  },
  {
    label: "Marketplace & Commerce",
    items: [
      { to: "/price-forecasting", label: "Mandi Price Forecaster", icon: LineChart, blurb: "6-month inflation-adjusted price predictions" },
      { to: "/market-price", label: "Mandi Market Rates", icon: Store, blurb: "Compare live modal prices across regional APMC yards" },
      { to: "/sell-crops", label: "Sell Produce (Sell Crops)", icon: HandCoins, blurb: "List harvest directly to millers & get MSP+ rates" },
      { to: "/buy-seeds", label: "Buy Certified Seeds", icon: ShoppingBasket, blurb: "Certified high-germination seed varieties" },
      { to: "/rent-machinery", label: "Book Equipment & Machinery", icon: Tractor, blurb: "Rent tractors, harvesters & spray drones" },
    ],
  },
  {
    label: "Advisory & Schemes",
    items: [
      { to: "/expert-connect", label: "Krishi Sahayak AI Expert", icon: MessagesSquare, blurb: "Conversational agronomist advisory in 5 Indic languages" },
      { to: "/community", label: "Farmer Community Forum", icon: Users, blurb: "Ask questions, share harvest photos and crop knowledge" },
      { to: "/schemes", label: "Government Schemes", icon: Landmark, blurb: "PM-Kisan, PMFBY & central subsidy checker" },
      { to: "/loans", label: "Check Kisan Loans", icon: Wallet, blurb: "Calculate KCC credit limits & 4% subvented credit" },
      { to: "/history", label: "Audit & Prediction History", icon: FileClock, blurb: "Complete log of past diagnostics and recommendations" },
      { to: "/admin", label: "Admin Console", icon: ShieldCheck, blurb: "Platform analytics & telemetry" },
    ],
  },
];

export const NAV_ITEMS = NAV_GROUPS.flatMap((group) => group.items);
export const PROFILE_NAV: NavItem = {
  to: "/profile",
  label: "Farm profile",
  icon: BookOpenCheck,
  blurb: "Land, crops and soil card",
};

/* ---------- Season chapters (mirrors the home page's scroll story) ---------- */

export type Chapter = { key: string; label: string; to: string; sky: string; at: number };

/** Same five chapters, sky colours and chapter links as the home page's season story. */
export const CHAPTERS: Chapter[] = [
  { key: "intro", label: "Season Story", to: "/", sky: "hsl(222, 22%, 11%)", at: 0 },
  { key: "soil", label: "Before sowing", to: "/soil-health", sky: "hsl(26, 16%, 9%)", at: 0.25 },
  { key: "rain", label: "Monsoon", to: "/crop-recommendation", sky: "hsl(210, 14%, 15%)", at: 0.5 },
  { key: "grow", label: "Growing", to: "/disease-detection", sky: "hsl(32, 18%, 12%)", at: 0.75 },
  { key: "harvest", label: "Harvest", to: "/price-forecasting", sky: "hsl(20, 36%, 13%)", at: 1 },
];

const CHAPTER_BY_PATH: Record<string, Chapter["key"]> = {
  "/": "intro",
  "/season-story": "intro",
  "/dashboard": "intro",
  "/farmer": "intro",
  "/admin": "intro",
  "/history": "intro",
  "/profile": "intro",
  "/schemes": "intro",
  "/loans": "intro",
  "/check-loans": "intro",
  "/soil-health": "soil",
  "/buy-seeds": "soil",
  "/crop-calendar": "soil",
  "/crop-recommendation": "rain",
  "/weather": "rain",
  "/rent-machinery": "rain",
  "/book-equipment": "rain",
  "/disease-detection": "grow",
  "/risk-prediction": "grow",
  "/expert-connect": "grow",
  "/community": "grow",
  "/price-forecasting": "harvest",
  "/market-price": "harvest",
  "/sell": "harvest",
  "/sell-crops": "harvest",
};

export const chapterFor = (path: string) => CHAPTERS.find((c) => c.key === CHAPTER_BY_PATH[path]) ?? CHAPTERS[0];
