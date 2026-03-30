// Location-specific market price data for various crops

export interface MarketPrice {
  cropId: string;
  cropName: string;
  state: string;
  district: string;
  mandi: string; // Market name
  price: number; // Price per quintal
  date: string;
  change: number; // Percentage change from last week
  minPrice: number;
  maxPrice: number;
  modal: number; // Most common price
  variety?: string;
}

// Generate realistic mock market prices based on location
export const getMarketPrices = (state?: string, district?: string, cropId?: string): MarketPrice[] => {
  const baseData: MarketPrice[] = [
    // Punjab - Wheat
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Punjab',
      district: 'Ludhiana',
      mandi: 'Ludhiana Mandi',
      price: 2350,
      date: '2026-03-27',
      change: 3.2,
      minPrice: 2200,
      maxPrice: 2500,
      modal: 2350,
      variety: 'PBW 343'
    },
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Punjab',
      district: 'Amritsar',
      mandi: 'Amritsar Grain Market',
      price: 2320,
      date: '2026-03-27',
      change: 2.8,
      minPrice: 2180,
      maxPrice: 2450,
      modal: 2320,
      variety: 'PBW 550'
    },
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Punjab',
      district: 'Patiala',
      mandi: 'Patiala Grain Market',
      price: 2380,
      date: '2026-03-27',
      change: 4.1,
      minPrice: 2250,
      maxPrice: 2520,
      modal: 2380,
    },
    
    // Punjab - Rice
    {
      cropId: 'rice',
      cropName: 'Rice (Paddy)',
      state: 'Punjab',
      district: 'Ludhiana',
      mandi: 'Ludhiana Mandi',
      price: 3150,
      date: '2026-03-27',
      change: -2.1,
      minPrice: 2900,
      maxPrice: 3400,
      modal: 3150,
      variety: 'Basmati 1121'
    },
    {
      cropId: 'rice',
      cropName: 'Rice (Paddy)',
      state: 'Punjab',
      district: 'Amritsar',
      mandi: 'Amritsar Grain Market',
      price: 3200,
      date: '2026-03-27',
      change: -1.5,
      minPrice: 3000,
      maxPrice: 3450,
      modal: 3200,
      variety: 'Pusa 44'
    },
    
    // Punjab - Cotton
    {
      cropId: 'cotton',
      cropName: 'Cotton',
      state: 'Punjab',
      district: 'Bathinda',
      mandi: 'Bathinda Cotton Market',
      price: 6800,
      date: '2026-03-27',
      change: 5.5,
      minPrice: 6200,
      maxPrice: 7200,
      modal: 6800,
    },
    {
      cropId: 'cotton',
      cropName: 'Cotton',
      state: 'Punjab',
      district: 'Faridkot',
      mandi: 'Faridkot Mandi',
      price: 6750,
      date: '2026-03-27',
      change: 4.8,
      minPrice: 6150,
      maxPrice: 7100,
      modal: 6750,
    },
    
    // Haryana - Wheat
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Haryana',
      district: 'Karnal',
      mandi: 'Karnal Grain Market',
      price: 2330,
      date: '2026-03-27',
      change: 3.0,
      minPrice: 2190,
      maxPrice: 2480,
      modal: 2330,
    },
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Haryana',
      district: 'Ambala',
      mandi: 'Ambala Mandi',
      price: 2310,
      date: '2026-03-27',
      change: 2.5,
      minPrice: 2170,
      maxPrice: 2460,
      modal: 2310,
    },
    
    // Haryana - Rice
    {
      cropId: 'rice',
      cropName: 'Rice (Paddy)',
      state: 'Haryana',
      district: 'Karnal',
      mandi: 'Karnal Grain Market',
      price: 3100,
      date: '2026-03-27',
      change: -1.8,
      minPrice: 2850,
      maxPrice: 3350,
      modal: 3100,
    },
    
    // Uttar Pradesh - Wheat
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      mandi: 'Meerut Grain Market',
      price: 2280,
      date: '2026-03-27',
      change: 2.3,
      minPrice: 2150,
      maxPrice: 2420,
      modal: 2280,
    },
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Uttar Pradesh',
      district: 'Muzaffarnagar',
      mandi: 'Muzaffarnagar Mandi',
      price: 2260,
      date: '2026-03-27',
      change: 1.9,
      minPrice: 2130,
      maxPrice: 2400,
      modal: 2260,
    },
    
    // Uttar Pradesh - Sugarcane
    {
      cropId: 'sugarcane',
      cropName: 'Sugarcane',
      state: 'Uttar Pradesh',
      district: 'Meerut',
      mandi: 'Meerut Sugar Mill',
      price: 320,
      date: '2026-03-27',
      change: 1.5,
      minPrice: 295,
      maxPrice: 340,
      modal: 320,
    },
    {
      cropId: 'sugarcane',
      cropName: 'Sugarcane',
      state: 'Uttar Pradesh',
      district: 'Muzaffarnagar',
      mandi: 'Muzaffarnagar Sugar Mill',
      price: 315,
      date: '2026-03-27',
      change: 1.2,
      minPrice: 290,
      maxPrice: 335,
      modal: 315,
    },
    
    // Maharashtra - Cotton
    {
      cropId: 'cotton',
      cropName: 'Cotton',
      state: 'Maharashtra',
      district: 'Akola',
      mandi: 'Akola Cotton Market',
      price: 6950,
      date: '2026-03-27',
      change: 6.2,
      minPrice: 6350,
      maxPrice: 7350,
      modal: 6950,
    },
    {
      cropId: 'cotton',
      cropName: 'Cotton',
      state: 'Maharashtra',
      district: 'Nagpur',
      mandi: 'Nagpur Cotton Market',
      price: 6900,
      date: '2026-03-27',
      change: 5.8,
      minPrice: 6300,
      maxPrice: 7300,
      modal: 6900,
    },
    
    // Maharashtra - Soybean
    {
      cropId: 'soybean',
      cropName: 'Soybean',
      state: 'Maharashtra',
      district: 'Latur',
      mandi: 'Latur Grain Market',
      price: 4200,
      date: '2026-03-27',
      change: 3.5,
      minPrice: 3800,
      maxPrice: 4600,
      modal: 4200,
    },
    
    // Madhya Pradesh - Wheat
    {
      cropId: 'wheat',
      cropName: 'Wheat',
      state: 'Madhya Pradesh',
      district: 'Indore',
      mandi: 'Indore Grain Market',
      price: 2270,
      date: '2026-03-27',
      change: 2.1,
      minPrice: 2140,
      maxPrice: 2410,
      modal: 2270,
    },
    
    // Madhya Pradesh - Soybean
    {
      cropId: 'soybean',
      cropName: 'Soybean',
      state: 'Madhya Pradesh',
      district: 'Indore',
      mandi: 'Indore Grain Market',
      price: 4150,
      date: '2026-03-27',
      change: 3.2,
      minPrice: 3750,
      maxPrice: 4550,
      modal: 4150,
    },
    {
      cropId: 'soybean',
      cropName: 'Soybean',
      state: 'Madhya Pradesh',
      district: 'Ujjain',
      mandi: 'Ujjain Mandi',
      price: 4180,
      date: '2026-03-27',
      change: 3.4,
      minPrice: 3780,
      maxPrice: 4580,
      modal: 4180,
    },
    
    // Rajasthan - Bajra
    {
      cropId: 'bajra',
      cropName: 'Bajra',
      state: 'Rajasthan',
      district: 'Jodhpur',
      mandi: 'Jodhpur Grain Market',
      price: 2100,
      date: '2026-03-27',
      change: 2.5,
      minPrice: 1950,
      maxPrice: 2250,
      modal: 2100,
    },
    {
      cropId: 'bajra',
      cropName: 'Bajra',
      state: 'Rajasthan',
      district: 'Jaipur',
      mandi: 'Jaipur Mandi',
      price: 2080,
      date: '2026-03-27',
      change: 2.2,
      minPrice: 1930,
      maxPrice: 2230,
      modal: 2080,
    },
    
    // Rajasthan - Mustard
    {
      cropId: 'mustard',
      cropName: 'Mustard',
      state: 'Rajasthan',
      district: 'Bharatpur',
      mandi: 'Bharatpur Oilseed Market',
      price: 5800,
      date: '2026-03-27',
      change: 4.5,
      minPrice: 5200,
      maxPrice: 6200,
      modal: 5800,
    },
    {
      cropId: 'mustard',
      cropName: 'Mustard',
      state: 'Rajasthan',
      district: 'Alwar',
      mandi: 'Alwar Mandi',
      price: 5750,
      date: '2026-03-27',
      change: 4.2,
      minPrice: 5150,
      maxPrice: 6150,
      modal: 5750,
    },
  ];

  // Filter by parameters
  let filtered = baseData;
  
  if (state) {
    filtered = filtered.filter(p => p.state === state);
  }
  
  if (district) {
    filtered = filtered.filter(p => p.district === district);
  }
  
  if (cropId) {
    filtered = filtered.filter(p => p.cropId === cropId);
  }
  
  return filtered;
};

// Get price forecast for a crop in a location
export const getPriceForecast = (
  cropId: string, 
  state: string, 
  district: string,
  months: number = 3
): Array<{ month: string; price: number; confidence: number }> => {
  const currentPrices = getMarketPrices(state, district, cropId);
  const basePrice = currentPrices.length > 0 
    ? currentPrices[0].price 
    : 2000;
  
  const forecast = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  for (let i = 1; i <= months; i++) {
    const monthIndex = (currentMonth + i) % 12;
    // Simulate seasonal variation and trend
    const seasonalFactor = 1 + (Math.sin(monthIndex * Math.PI / 6) * 0.1);
    const trend = 1 + (i * 0.02); // 2% growth per month
    const randomVariation = 1 + ((Math.random() - 0.5) * 0.05);
    
    forecast.push({
      month: monthNames[monthIndex],
      price: Math.round(basePrice * seasonalFactor * trend * randomVariation),
      confidence: Math.max(70, 95 - (i * 5)) // Confidence decreases over time
    });
  }
  
  return forecast;
};

// Compare prices across mandis for a crop
export const comparePrices = (cropId: string, state: string): MarketPrice[] => {
  const prices = getMarketPrices(state, undefined, cropId);
  return prices.sort((a, b) => b.price - a.price);
};

// Get best market for selling
export const getBestMarket = (cropId: string, state: string): MarketPrice | null => {
  const prices = comparePrices(cropId, state);
  return prices.length > 0 ? prices[0] : null;
};

// Get market trends
export const getMarketTrends = (cropId: string, state: string) => {
  const prices = getMarketPrices(state, undefined, cropId);
  
  if (prices.length === 0) {
    return {
      averagePrice: 0,
      trend: 'stable',
      changePercent: 0,
      recommendation: 'No data available'
    };
  }
  
  const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const avgChange = prices.reduce((sum, p) => sum + p.change, 0) / prices.length;
  
  let trend: 'rising' | 'falling' | 'stable';
  let recommendation: string;
  
  if (avgChange > 2) {
    trend = 'rising';
    recommendation = 'Good time to sell. Prices are increasing.';
  } else if (avgChange < -2) {
    trend = 'falling';
    recommendation = 'Consider holding. Prices are declining.';
  } else {
    trend = 'stable';
    recommendation = 'Stable market. Sell based on your needs.';
  }
  
  return {
    averagePrice: Math.round(avgPrice),
    trend,
    changePercent: Math.round(avgChange * 10) / 10,
    recommendation
  };
};
