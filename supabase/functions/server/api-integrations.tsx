// ==================== API INTEGRATIONS ====================

// Cache for API responses
const apiCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

function getCachedData(key: string): any | null {
  const cached = apiCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

function setCachedData(key: string, data: any): void {
  apiCache.set(key, { data, timestamp: Date.now() });
}

// ==================== WEATHER API (OpenWeatherMap) ====================

export interface WeatherData {
  current: {
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    feelsLike: number;
    pressure: number;
  };
  forecast: Array<{
    day: string;
    high: number;
    low: number;
    rain: number;
    condition: string;
  }>;
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  const cacheKey = `weather:${location}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`Weather cache hit for ${location}`);
    return cached;
  }

  const apiKey = Deno.env.get("OPENWEATHER_API_KEY");

  if (!apiKey) {
    console.warn("OpenWeatherMap API key not configured, using mock data");
    return getMockWeatherData();
  }

  try {
    // Get coordinates for location (using geocoding API)
    const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)},IN&limit=1&appid=${apiKey}`;
    const geoResponse = await fetch(geoUrl);
    
    if (!geoResponse.ok) {
      throw new Error(`Geocoding failed: ${geoResponse.status}`);
    }

    const geoData = await geoResponse.json();
    
    if (!geoData || geoData.length === 0) {
      console.warn(`Location not found: ${location}, using mock data`);
      return getMockWeatherData();
    }

    const { lat, lon } = geoData[0];

    // Get current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const currentResponse = await fetch(currentUrl);
    
    if (!currentResponse.ok) {
      throw new Error(`Weather API failed: ${currentResponse.status}`);
    }

    const currentData = await currentResponse.json();

    // Get 5-day forecast
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    const forecastResponse = await fetch(forecastUrl);
    
    if (!forecastResponse.ok) {
      throw new Error(`Forecast API failed: ${forecastResponse.status}`);
    }

    const forecastData = await forecastResponse.json();

    // Process forecast data (get daily summaries)
    const dailyForecasts = new Map<string, any[]>();
    forecastData.list.forEach((item: any) => {
      const date = new Date(item.dt * 1000).toLocaleDateString('en-US', { weekday: 'short' });
      if (!dailyForecasts.has(date)) {
        dailyForecasts.set(date, []);
      }
      dailyForecasts.get(date)!.push(item);
    });

    const forecast = Array.from(dailyForecasts.entries()).slice(0, 7).map(([day, items]) => {
      const temps = items.map(i => i.main.temp);
      const rainProb = Math.max(...items.map(i => (i.pop || 0) * 100));
      return {
        day,
        high: Math.round(Math.max(...temps)),
        low: Math.round(Math.min(...temps)),
        rain: Math.round(rainProb),
        condition: items[0].weather[0].main,
      };
    });

    const weatherData: WeatherData = {
      current: {
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].main,
        humidity: currentData.main.humidity,
        windSpeed: Math.round(currentData.wind.speed * 3.6), // Convert m/s to km/h
        feelsLike: Math.round(currentData.main.feels_like),
        pressure: currentData.main.pressure,
      },
      forecast,
    };

    setCachedData(cacheKey, weatherData);
    console.log(`Weather data fetched for ${location}`);
    return weatherData;

  } catch (error) {
    console.error("Weather API error:", error);
    return getMockWeatherData();
  }
}

function getMockWeatherData(): WeatherData {
  return {
    current: {
      temp: 28,
      condition: "Partly Cloudy",
      humidity: 65,
      windSpeed: 12,
      feelsLike: 30,
      pressure: 1013,
    },
    forecast: [
      { day: "Mon", high: 30, low: 22, rain: 20, condition: "Sunny" },
      { day: "Tue", high: 29, low: 21, rain: 60, condition: "Rain" },
      { day: "Wed", high: 28, low: 20, rain: 80, condition: "Rain" },
      { day: "Thu", high: 27, low: 19, rain: 40, condition: "Cloudy" },
      { day: "Fri", high: 29, low: 21, rain: 10, condition: "Sunny" },
      { day: "Sat", high: 31, low: 23, rain: 5, condition: "Sunny" },
      { day: "Sun", high: 30, low: 22, rain: 15, condition: "Partly Cloudy" },
    ],
  };
}

// ==================== MARKET PRICES API ====================

export interface MarketPrice {
  crop: string;
  variety?: string;
  price: number;
  minPrice: number;
  maxPrice: number;
  location: string;
  mandi: string;
  date: string;
  change: number;
  unit: string;
}

export async function getMarketPrices(location?: string): Promise<MarketPrice[]> {
  const cacheKey = `market:${location || "default"}`;
  const cached = getCachedData(cacheKey);
  if (cached) {
    console.log(`Market price cache hit for ${location || "default"}`);
    return cached;
  }

  // Try to fetch from India's data.gov.in API
  // Note: This API may require registration and may have rate limits
  try {
    // Using data.gov.in agricultural market prices API
    // You may need to register at https://data.gov.in/ to get an API key
    const apiKey = Deno.env.get("DATA_GOV_IN_API_KEY");
    
    if (!apiKey) {
      console.warn("data.gov.in API key not configured, using mock data");
      return getMockMarketPrices();
    }

    // Example API endpoint (replace with actual endpoint)
    const url = `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key=${apiKey}&format=json&limit=50`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Market API failed: ${response.status}`);
    }

    const data = await response.json();
    
    // Process and format the data
    const prices: MarketPrice[] = (data.records || []).slice(0, 20).map((record: any) => ({
      crop: record.commodity || "Unknown",
      variety: record.variety,
      price: parseFloat(record.modal_price) || 0,
      minPrice: parseFloat(record.min_price) || 0,
      maxPrice: parseFloat(record.max_price) || 0,
      location: record.district || "Unknown",
      mandi: record.market || "Unknown",
      date: record.arrival_date || new Date().toISOString().split('T')[0],
      change: Math.round((Math.random() - 0.5) * 20), // Mock change for now
      unit: "Quintal",
    }));

    setCachedData(cacheKey, prices);
    console.log(`Market prices fetched for ${location || "default"}`);
    return prices;

  } catch (error) {
    console.error("Market prices API error:", error);
    return getMockMarketPrices();
  }
}

function getMockMarketPrices(): MarketPrice[] {
  const crops = [
    { crop: "Wheat", price: 2450, min: 2400, max: 2500, location: "Ludhiana", change: 5 },
    { crop: "Rice (Basmati)", price: 3200, min: 3100, max: 3350, location: "Amritsar", change: -3 },
    { crop: "Cotton", price: 6800, min: 6500, max: 7000, location: "Bathinda", change: 8 },
    { crop: "Sugarcane", price: 3500, min: 3400, max: 3600, location: "Jalandhar", change: 2 },
    { crop: "Maize", price: 1950, min: 1900, max: 2000, location: "Patiala", change: -2 },
    { crop: "Potato", price: 1200, min: 1100, max: 1300, location: "Hoshiarpur", change: 12 },
    { crop: "Onion", price: 2500, min: 2300, max: 2700, location: "Moga", change: -8 },
    { crop: "Tomato", price: 1800, min: 1600, max: 2000, location: "Ludhiana", change: 15 },
  ];

  return crops.map(item => ({
    ...item,
    variety: "Common",
    minPrice: item.min,
    maxPrice: item.max,
    mandi: `${item.location} Mandi`,
    date: new Date().toISOString().split('T')[0],
    unit: "Quintal",
  }));
}

// ==================== AI/ML MOCK SERVICES ====================

export interface DiseaseDetectionResult {
  disease: string;
  confidence: number;
  severity: string;
  treatment: string[];
  preventiveMeasures: string[];
}

export async function detectCropDisease(imageUrl: string, cropType: string): Promise<DiseaseDetectionResult> {
  // In production, this would call a real ML model
  // For now, return realistic mock data based on crop type

  const diseases: Record<string, DiseaseDetectionResult> = {
    wheat: {
      disease: "Leaf Rust",
      confidence: 87.5,
      severity: "Moderate",
      treatment: [
        "Apply fungicide containing Propiconazole",
        "Spray at 7-10 day intervals",
        "Remove infected plant debris",
      ],
      preventiveMeasures: [
        "Use disease-resistant varieties",
        "Maintain proper plant spacing",
        "Ensure adequate drainage",
        "Regular field monitoring",
      ],
    },
    rice: {
      disease: "Bacterial Leaf Blight",
      confidence: 91.2,
      severity: "High",
      treatment: [
        "Apply Copper Oxychloride spray",
        "Remove and destroy infected plants",
        "Improve field drainage",
      ],
      preventiveMeasures: [
        "Use certified disease-free seeds",
        "Avoid excessive nitrogen fertilization",
        "Maintain proper water management",
        "Practice crop rotation",
      ],
    },
    default: {
      disease: "Fungal Leaf Spot",
      confidence: 78.3,
      severity: "Low",
      treatment: [
        "Remove infected leaves",
        "Apply organic fungicide",
        "Improve air circulation",
      ],
      preventiveMeasures: [
        "Avoid overhead watering",
        "Maintain plant hygiene",
        "Use resistant varieties",
      ],
    },
  };

  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  return diseases[cropType.toLowerCase()] || diseases.default;
}

export interface RiskPredictionResult {
  riskLevel: string;
  riskScore: number;
  factors: Array<{
    name: string;
    impact: string;
    description: string;
  }>;
  recommendations: string[];
}

export async function predictCropRisk(cropType: string, location: string): Promise<RiskPredictionResult> {
  // Mock risk prediction based on weather and historical data
  const riskScore = Math.random() * 100;
  const riskLevel = riskScore > 70 ? "High" : riskScore > 40 ? "Medium" : "Low";

  return {
    riskLevel,
    riskScore: Math.round(riskScore),
    factors: [
      {
        name: "Weather Conditions",
        impact: riskScore > 60 ? "High" : "Low",
        description: "Forecasted rainfall may increase disease risk",
      },
      {
        name: "Pest Activity",
        impact: "Medium",
        description: "Seasonal pest activity expected in the region",
      },
      {
        name: "Soil Moisture",
        impact: "Low",
        description: "Adequate moisture levels detected",
      },
    ],
    recommendations: [
      "Monitor crop daily for early signs of stress",
      "Prepare drainage systems for expected rainfall",
      "Keep pesticides ready for quick intervention",
      "Consider crop insurance for high-value crops",
    ],
  };
}
