import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/RootLayout";
import { Landing } from "./pages/Landing";
import { FarmerDashboard } from "./pages/FarmerDashboard";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { RiskPrediction } from "./pages/RiskPrediction";
import { PriceForecasting } from "./pages/PriceForecasting";
import { CropRecommendation } from "./pages/CropRecommendation";
import { CropCalendar } from "./pages/CropCalendar";
import { WeatherDashboard } from "./pages/WeatherDashboard";
import { MarketPrice } from "./pages/MarketPrice";
import { Community } from "./pages/Community";
import { ExpertConnect } from "./pages/ExpertConnect";
import { GovernmentSchemes } from "./pages/GovernmentSchemes";
import { SoilHealth } from "./pages/SoilHealth";
import { PredictionHistory } from "./pages/PredictionHistory";
import { SellCrops } from "./pages/SellCrops";
import { BuySeeds } from "./pages/BuySeeds";
import { CheckLoans } from "./pages/CheckLoans";
import { BookEquipment } from "./pages/BookEquipment";
import { ResetPassword } from "./pages/ResetPassword";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Landing,
      },
      {
        path: "farmer",
        Component: FarmerDashboard,
      },
      {
        path: "admin",
        Component: AdminDashboard,
      },
      {
        path: "disease-detection",
        Component: DiseaseDetection,
      },
      {
        path: "risk-prediction",
        Component: RiskPrediction,
      },
      {
        path: "price-forecasting",
        Component: PriceForecasting,
      },
      {
        path: "crop-recommendation",
        Component: CropRecommendation,
      },
      {
        path: "crop-calendar",
        Component: CropCalendar,
      },
      {
        path: "weather",
        Component: WeatherDashboard,
      },
      {
        path: "market-price",
        Component: MarketPrice,
      },
      {
        path: "community",
        Component: Community,
      },
      {
        path: "expert-connect",
        Component: ExpertConnect,
      },
      {
        path: "schemes",
        Component: GovernmentSchemes,
      },
      {
        path: "soil-health",
        Component: SoilHealth,
      },
      {
        path: "history",
        Component: PredictionHistory,
      },
      {
        path: "sell-crops",
        Component: SellCrops,
      },
      {
        path: "buy-seeds",
        Component: BuySeeds,
      },
      {
        path: "check-loans",
        Component: CheckLoans,
      },
      {
        path: "book-equipment",
        Component: BookEquipment,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
      },
    ],
  },
]);