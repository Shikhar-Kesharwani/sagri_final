import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Cloud, CloudRain, Wind, Droplet, Eye, Sun, Umbrella, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useWeather } from '../hooks/useWeather';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';

export function WeatherDashboard() {
  const { user } = useAuth();
  const location = user?.location || 'Ludhiana, Punjab';
  const { weather, loading, error } = useWeather(location);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading weather data...</p>
        </div>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Cloud className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No weather data available</p>
        </div>
      </div>
    );
  }

  const currentWeather = {
    temp: weather.temperature,
    condition: weather.condition,
    humidity: weather.humidity,
    windSpeed: weather.windSpeed,
    rainfall: weather.rainfall,
    visibility: weather.visibility,
    uvIndex: weather.uvIndex,
  };

  const forecast = weather.forecast.map((f, i) => ({
    id: `f${i}`,
    day: f.day,
    high: f.high,
    low: f.low,
    rain: f.rainChance,
  }));

  const tempData = weather.hourly.map((h, i) => ({
    id: `t${i}`,
    time: h.time,
    temp: h.temp,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Weather Intelligence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time weather insights and forecasts
          </p>
        </div>

        {/* Current Weather */}
        <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-blue-100 mb-2">{location}</p>
              <h2 className="text-6xl font-bold mb-2">{currentWeather.temp}°C</h2>
              <p className="text-xl text-blue-100">{currentWeather.condition}</p>
            </div>
            <Cloud className="w-24 h-24 opacity-80" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Droplet className="w-6 h-6 mb-2" />
              <p className="text-sm text-blue-100">Humidity</p>
              <p className="text-xl font-semibold">{currentWeather.humidity}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Wind className="w-6 h-6 mb-2" />
              <p className="text-sm text-blue-100">Wind Speed</p>
              <p className="text-xl font-semibold">{currentWeather.windSpeed} km/h</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <CloudRain className="w-6 h-6 mb-2" />
              <p className="text-sm text-blue-100">Rainfall</p>
              <p className="text-xl font-semibold">{currentWeather.rainfall} mm</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
              <Eye className="w-6 h-6 mb-2" />
              <p className="text-sm text-blue-100">Visibility</p>
              <p className="text-xl font-semibold">{currentWeather.visibility} km</p>
            </div>
          </div>
        </div>

        {/* Temperature Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Today's Temperature
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={tempData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#9ca3af" />
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
                key="temp-line"
                type="monotone"
                dataKey="temp"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ fill: '#3b82f6', r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 7-Day Forecast */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            7-Day Forecast
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {forecast.map((day) => (
              <div
                key={day.day}
                className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 text-center"
              >
                <p className="font-semibold text-gray-900 dark:text-white mb-2">{day.day}</p>
                {day.rain > 50 ? (
                  <Umbrella className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                ) : (
                  <Sun className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
                )}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {day.high}° / {day.low}°
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">{day.rain}% rain</p>
              </div>
            ))}
          </div>
        </div>

        {/* Weather Alerts */}
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-3">
            <CloudRain className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-300">Weather Alert</h3>
          </div>
          <p className="text-yellow-800 dark:text-yellow-400">
            Heavy rainfall expected on Wednesday. Plan your irrigation and harvesting accordingly.
          </p>
        </div>
      </div>
    </div>
  );
}