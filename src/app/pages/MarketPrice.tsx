import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { DollarSign, TrendingUp, TrendingDown, MapPin } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function MarketPrice() {
  const mandis = [
    {
      location: 'Ludhiana Mandi',
      distance: '15 km',
      lat: 30.9010,
      lng: 75.8573,
      address: 'Grain Market, Ludhiana, Punjab',
      crops: [
        { name: 'Wheat', price: 2450, change: 5, trend: 'up' },
        { name: 'Rice', price: 3200, change: -3, trend: 'down' },
        { name: 'Cotton', price: 6800, change: 8, trend: 'up' },
      ],
    },
    {
      location: 'Amritsar Mandi',
      distance: '45 km',
      lat: 31.6340,
      lng: 74.8723,
      address: 'Agricultural Market, Amritsar, Punjab',
      crops: [
        { name: 'Wheat', price: 2480, change: 7, trend: 'up' },
        { name: 'Rice', price: 3150, change: -5, trend: 'down' },
        { name: 'Cotton', price: 6750, change: 3, trend: 'up' },
      ],
    },
    {
      location: 'Jalandhar Mandi',
      distance: '30 km',
      lat: 31.3260,
      lng: 75.5762,
      address: 'Mandi Gobindgarh, Jalandhar, Punjab',
      crops: [
        { name: 'Wheat', price: 2420, change: 2, trend: 'up' },
        { name: 'Rice', price: 3180, change: -2, trend: 'down' },
        { name: 'Cotton', price: 6820, change: 10, trend: 'up' },
      ],
    },
  ];

  const handleGetDirections = (mandi: typeof mandis[0]) => {
    // Open Google Maps with directions to the mandi
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mandi.lat},${mandi.lng}&destination_place_id=${encodeURIComponent(mandi.address)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const bestPrices = [
    { crop: 'Wheat', location: 'Amritsar', price: 2480, badge: 'Best' },
    { crop: 'Rice', location: 'Jalandhar', price: 3180, badge: 'Best' },
    { crop: 'Cotton', location: 'Jalandhar', price: 6820, badge: 'Best' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Market Price Comparison
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Compare prices across different mandis near you
          </p>
        </div>

        {/* Best Prices */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {bestPrices.map((item) => (
            <div
              key={item.crop}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {item.badge}
                </span>
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold mb-1">{item.crop}</h3>
              <p className="text-3xl font-bold mb-2">₹{item.price}</p>
              <div className="flex items-center gap-1 text-sm text-green-100">
                <MapPin className="w-4 h-4" />
                <span>{item.location} Mandi</span>
              </div>
            </div>
          ))}
        </div>

        {/* Mandi Comparison */}
        <div className="space-y-6">
          {mandis.map((mandi) => (
            <div
              key={mandi.location}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {mandi.location}
                  </h2>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{mandi.distance} away</span>
                  </div>
                </div>
                <button
                  className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  onClick={() => handleGetDirections(mandi)}
                >
                  Get Directions
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {mandi.crops.map((crop) => (
                  <div
                    key={crop.name}
                    className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{crop.name}</h3>
                      {crop.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      ₹{crop.price}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">per quintal</p>
                    <p
                      className={`text-sm font-medium mt-2 ${
                        crop.trend === 'up'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}
                    >
                      {crop.trend === 'up' ? '+' : ''}
                      {crop.change}% from yesterday
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tips */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">Market Tips</h3>
          <ul className="space-y-2 text-blue-800 dark:text-blue-400 text-sm">
            <li>• Prices are updated every 6 hours from official mandi sources</li>
            <li>• Consider transportation costs when choosing a mandi</li>
            <li>• Check weather forecasts before planning your trip</li>
            <li>• Call ahead to confirm prices and availability</li>
          </ul>
        </div>
      </div>
    </div>
  );
}