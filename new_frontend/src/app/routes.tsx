import type { ComponentType } from "react";
import { createBrowserRouter } from "react-router";
import FarmerDashboard from "../../FarmerDashboard";
import AppShell from "./AppShell";

function PageFallback() {
  return <div className="min-h-screen bg-background" />;
}

const page = (path: string, load: () => Promise<{ default: ComponentType }>) => ({
  path,
  lazy: async () => ({ Component: (await load()).default }),
  HydrateFallback: PageFallback,
});

export const router = createBrowserRouter([
  page("/", () => import("../../FarmerDashboard")),
  page("/season-story", () => import("../../FarmerDashboard")),
  page("/home", () => import("../../FarmerDashboard")),
  page("/landing", () => import("../pages/Landing")),
  {
    Component: AppShell,
    HydrateFallback: PageFallback,
    children: [
      page("/dashboard", () => import("../pages/CommandCentre")),
      page("/farmer", () => import("../pages/CommandCentre")),
      page("/admin", () => import("../pages/AdminDashboard")),
      page("/disease-detection", () => import("../pages/DiseaseDetection")),
      page("/crop-recommendation", () => import("../pages/CropRecommendation")),
      page("/price-forecasting", () => import("../pages/PriceForecasting")),
      page("/risk-prediction", () => import("../pages/RiskRadar")),
      page("/soil-health", () => import("../pages/SoilHealth")),
      page("/weather", () => import("../pages/Weather")),
      page("/market-price", () => import("../pages/MarketRates")),
      page("/crop-calendar", () => import("../pages/CropCalendar")),
      page("/history", () => import("../pages/History")),
      page("/sell", () => import("../pages/SellProduce")),
      page("/sell-crops", () => import("../pages/SellProduce")),
      page("/buy-seeds", () => import("../pages/BuySeeds")),
      page("/rent-machinery", () => import("../pages/RentMachinery")),
      page("/book-equipment", () => import("../pages/RentMachinery")),
      page("/expert-connect", () => import("../pages/ExpertConnect")),
      page("/community", () => import("../pages/Community")),
      page("/schemes", () => import("../pages/Schemes")),
      page("/loans", () => import("../pages/Loans")),
      page("/check-loans", () => import("../pages/Loans")),
      page("/profile", () => import("../pages/Profile")),
      page("/reset-password", () => import("../pages/ResetPassword")),
      page("*", () => import("../pages/NotFound")),
    ],
  },
]);
