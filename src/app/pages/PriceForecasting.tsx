import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';

export function PriceForecasting() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [forecast, setForecast] = useState<any>(null);
  const { updatePoints } = useAuth();

  const handlePredict = () => {
    if (!selectedCrop || !selectedRegion) {
      toast.error('Please select crop and region');
      return;
    }

    // Mock forecast data
    const currentPrice = Math.floor(Math.random() * 2000) + 2000;
    const trend = Math.random() > 0.5 ? 'up' : 'down';
    const change = Math.floor(Math.random() * 20) + 5;

    const historicalData = Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      price: currentPrice + Math.floor(Math.random() * 400) - 200,
    }));

    const forecastData = Array.from({ length: 6 }, (_, i) => ({
      month: ['Next 1M', 'Next 2M', 'Next 3M', 'Next 4M', 'Next 5M', 'Next 6M'][i],
      predicted: trend === 'up' 
        ? currentPrice + (change * (i + 1) * 5)
        : currentPrice - (change * (i + 1) * 5),
    }));

    setForecast({
      currentPrice,
      trend,
      change,
      historicalData,
      forecastData,
      insights: [
        {
          title: 'Market Trend',
          value: trend === 'up' ? 'Bullish' : 'Bearish',
          color: trend === 'up' ? 'green' : 'red',
        },
        {
          title: 'Expected Change',
          value: `${trend === 'up' ? '+' : '-'}${change}%`,
          color: trend === 'up' ? 'green' : 'red',
        },
        {
          title: 'Confidence',
          value: '87%',
          color: 'blue',
        },
      ],
      recommendations: [
        trend === 'up' 
          ? 'Good time to hold and sell later for better prices'
          : 'Consider selling soon before prices drop further',
        'Monitor weather forecasts for unexpected changes',
        'Compare prices across different mandis',
        'Check government procurement prices',
      ],
    });

    updatePoints(12);
    toast.success('Price forecast generated! +12 points earned');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Price Forecasting
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get AI-powered price predictions for your crops
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Crop
              </label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a crop</option>
                <option value="wheat">Wheat</option>
                <option value="rice">Rice</option>
                <option value="cotton">Cotton</option>
                <option value="sugarcane">Sugarcane</option>
                <option value="maize">Maize</option>
                <option value="potato">Potato</option>
                <option value="onion">Onion</option>
                <option value="tomato">Tomato</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Region
              </label>
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="">Choose a region</option>
                <option value="punjab">Punjab</option>
                <option value="haryana">Haryana</option>
                <option value="up">Uttar Pradesh</option>
                <option value="mp">Madhya Pradesh</option>
                <option value="rajasthan">Rajasthan</option>
                <option value="gujarat">Gujarat</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={handlePredict}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get Forecast
              </button>
            </div>
          </div>
        </div>

        {forecast && (
          <>
            {/* Current Price & Insights */}
            <div className="grid md:grid-cols-4 gap-6 mb-6">
              <div className="md:col-span-1 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg">
                <DollarSign className="w-8 h-8 mb-2 opacity-80" />
                <p className="text-sm opacity-90 mb-1">Current Price</p>
                <p className="text-3xl font-bold">₹{forecast.currentPrice}</p>
                <p className="text-sm opacity-90 mt-1">per quintal</p>
              </div>

              {forecast.insights.map((insight: any, index: number) => (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700"
                >
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{insight.title}</p>
                  <p
                    className={`text-2xl font-bold ${
                      insight.color === 'green'
                        ? 'text-green-600 dark:text-green-400'
                        : insight.color === 'red'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-blue-600 dark:text-blue-400'
                    }`}
                  >
                    {insight.value}
                  </p>
                  {insight.title === 'Market Trend' && (
                    <div className="mt-2">
                      {forecast.trend === 'up' ? (
                        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Historical Data Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Historical Price Trend (Last 12 Months)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast.historicalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={{ fill: '#10b981', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Forecast Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Price Forecast (Next 6 Months)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={forecast.forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#fff',
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke={forecast.trend === 'up' ? '#10b981' : '#ef4444'}
                    strokeWidth={3}
                    dot={{ fill: forecast.trend === 'up' ? '#10b981' : '#ef4444', r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Recommendations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Recommendations
              </h3>
              <div className="space-y-3">
                {forecast.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}