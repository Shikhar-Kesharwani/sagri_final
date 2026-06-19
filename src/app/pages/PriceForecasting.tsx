import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';
import { supabase } from '../lib/supabase';

export const CROPS = ['Apple', 'Banana', 'Banana - Green', 'Bengal Gram (Gram)(Whole)', 'Bhindi (Ladies Finger)', 'Bitter gourd', 'Bottle gourd', 'Brinjal', 'Cabbage', 'Capsicum', 'Carrot', 'Cauliflower', 'Cucumbar (Kheera)', 'Garlic', 'Ginger (Green)', 'Green Chilli', 'Lemon', 'Maize', 'Mustard', 'Onion', 'Paddy (Dhan)(Common)', 'Papaya', 'Potato', 'Pumpkin', 'Raddish', 'Rice', 'Ridgeguard (Tori)', 'Soyabean', 'Tomato', 'Wheat'];

export const REGIONS = ['Andaman and Nicobar', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chattisgarh', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'NCT of Delhi', 'Nagaland', 'Odisha', 'Pondicherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'Uttrakhand', 'West Bengal'];

export function PriceForecasting() {
  const [selectedCrop, setSelectedCrop] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [forecast, setForecast] = useState<any>(null);
  const { user, updatePoints } = useAuth();

  const handlePredict = async () => {
    if (!selectedCrop || !selectedRegion) {
      toast.error('Please select crop and region');
      return;
    }

    try {
      toast.loading('Analyzing market trends...');

      const [forecastRes, historyRes] = await Promise.all([
        fetch('http://localhost:8000/api/forecast_price', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crop_name: selectedCrop,
            state: selectedRegion,
            months_ahead: 6
          }),
        }),
        fetch('http://localhost:8000/api/historical_prices', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            crop_name: selectedCrop,
            state: selectedRegion,
            months: 12
          }),
        })
      ]);

      if (!forecastRes.ok || !historyRes.ok) throw new Error('API Request Failed');

      const data = await forecastRes.json();
      const historyJson = await historyRes.json();
      
      // Map API response to the UI format
      const currentPrice = data.forecast[0].predicted_price;
      const futurePrice = data.forecast[data.forecast.length - 1].predicted_price;
      const trend = futurePrice > currentPrice ? 'up' : 'down';
      const change = Math.round(Math.abs((futurePrice - currentPrice) / currentPrice) * 100);

      const historicalData = historyJson.history;

      // Use the returned forecast (which is exactly 6 months)
      const forecastData = data.forecast.map((item: any, index: number) => ({
        month: `Next ${index + 1}M`,
        predicted: item.predicted_price
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
            value: data.is_mock ? 'Mock Data' : '91.7% R²',
            color: 'blue',
          },
        ],
        aiMetadata: data.metadata || null,
        recommendations: [
          data.is_mock ? 'This is a mock response from the backend.' : 'Predicted using Sagri Random Forest AI (25-Year Dataset).',
          trend === 'up' 
            ? 'Good time to hold and sell later for better prices'
            : 'Consider selling soon before prices drop further',
          'Monitor weather forecasts for unexpected changes',
        ],
      });

      toast.dismiss();
      updatePoints(12);
      toast.success(data.is_mock ? 'Mock forecast generated!' : 'AI forecast generated! +12 points');

      // Save to prediction history
      if (user?.email) {
        await supabase.from('prediction_history').insert([{
          user_email: user.email,
          prediction_type: 'Price Forecast',
          input_data: { crop: selectedCrop, state: selectedRegion },
          result: `₹${currentPrice}/quintal -> ₹${futurePrice}/quintal`,
        }]);
      }

    } catch (error) {
      toast.dismiss();
      toast.error('Could not reach AI backend. Is the FastAPI server running?');
    }
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
                {CROPS.map((crop) => (
                  <option key={crop} value={crop}>{crop}</option>
                ))}
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
                {REGIONS.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
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

            {/* AI Engine Variables Section */}
            {forecast.aiMetadata && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  AI Engine Variables (Live Data)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400">🌡️ Expected Temperature</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {forecast.aiMetadata.temperature !== null ? `${forecast.aiMetadata.temperature.toFixed(1)} °C` : 'Historical Average'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400">🌧️ Expected Rainfall</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      {forecast.aiMetadata.rainfall !== null ? `${forecast.aiMetadata.rainfall.toFixed(1)} mm` : 'Historical Average'}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600">
                    <p className="text-sm text-gray-500 dark:text-gray-400">⚓ Inflation-Adjusted Base</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white mt-1">
                      ₹{forecast.aiMetadata.lag_price !== null ? forecast.aiMetadata.lag_price.toFixed(0) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}

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