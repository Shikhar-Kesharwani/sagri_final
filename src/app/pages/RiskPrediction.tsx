import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { AlertTriangle, Droplet, Cloud, ThermometerSun, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';
import { supabase } from '../lib/supabase';
import { ML_API_BASE_URL } from '../../utils/api';

export function RiskPrediction() {
  const [formData, setFormData] = useState({
    cropType: '',
    soilType: '',
    soilPh: '',
    rainfall: '',
    temperature: '',
    humidity: '',
    season: '',
    windspeed: '',
    nitrogen: '',
    phosphate: '',
    potash: '',
  });
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { user, updatePoints } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${ML_API_BASE_URL}/api/predict_risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropType: formData.cropType,
          soilPh: Number(formData.soilPh),
          rainfall: Number(formData.rainfall),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          windspeed: Number(formData.windspeed) || 2.5,
          nitrogen: Number(formData.nitrogen) || 60,
          phosphate: Number(formData.phosphate) || 30,
          potash: Number(formData.potash) || 20,
          season: formData.season,
        }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      const riskLevel = data.riskLevel;
      const risk =
        riskLevel < 30
          ? { level: 'Low', color: 'green', message: 'Conditions are favorable' }
          : riskLevel < 70
          ? { level: 'Medium', color: 'orange', message: 'Some risks detected' }
          : { level: 'High', color: 'red', message: 'High risk conditions' };

      setResult({
        riskLevel,
        risk,
        factors: [
          { name: 'Soil Quality', status: 'Good', icon: <Droplet className="w-5 h-5" /> },
          {
            name: 'Weather Conditions',
            status: riskLevel > 60 ? 'Poor' : 'Good',
            icon: <Cloud className="w-5 h-5" />,
          },
          {
            name: 'Temperature',
            status: 'Optimal',
            icon: <ThermometerSun className="w-5 h-5" />,
          },
          {
            name: 'Market Trends',
            status: 'Favorable',
            icon: <TrendingUp className="w-5 h-5" />,
          },
        ],
        recommendations: [
          data.is_mock ? 'Note: Using mock prediction. Train the AI model!' : 'AI-verified environmental risk reading.',
          'Monitor weather forecasts regularly',
          'Ensure proper drainage systems',
          'Maintain soil moisture levels',
        ],
      });
      setLoading(false);
      updatePoints(15);
      toast.success(data.is_mock ? 'Mock assessment complete!' : 'AI Risk assessment complete! +15 points');

      if (user?.email) {
        try {
          await supabase.from('prediction_history').insert([{
            user_email: user.email,
            prediction_type: 'Risk Assessment',
            input_data: formData,
            result: `${risk.level} Risk`,
          }]);
        } catch (_) {}
        try {
          const list = JSON.parse(localStorage.getItem('sagri_prediction_history') || '[]');
          list.unshift({
            prediction_type: 'Risk Assessment',
            result: `${risk.level} Risk`,
            input_data: formData,
            timestamp: new Date().toISOString()
          });
          localStorage.setItem('sagri_prediction_history', JSON.stringify(list.slice(0, 50)));
        } catch (_) {}
      }
    } catch (error) {
      setLoading(false);
      toast.error('Could not reach backend API.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crop Failure Risk Prediction
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Predict crop failure risks based on environmental and soil data
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Crop Type
                </label>
                <select
                  value={formData.cropType}
                  onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select crop</option>
                  <option value="wheat">Wheat</option>
                  <option value="rice">Rice</option>
                  <option value="cotton">Cotton</option>
                  <option value="sugarcane">Sugarcane</option>
                  <option value="maize">Maize</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soil Type
                </label>
                <select
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select soil type</option>
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy</option>
                  <option value="silt">Silt</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Soil pH
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.soilPh}
                  onChange={(e) => setFormData({ ...formData, soilPh: e.target.value })}
                  placeholder="6.5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expected Rainfall (mm)
                </label>
                <input
                  type="number"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  placeholder="800"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Average Temperature (°C)
                </label>
                <input
                  type="number"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                  placeholder="25"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Humidity (%)
                </label>
                <input
                  type="number"
                  value={formData.humidity}
                  onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                  placeholder="60"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wind Speed (m/s)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.windspeed}
                  onChange={(e) => setFormData({ ...formData, windspeed: e.target.value })}
                  placeholder="2.5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nitrogen (tons)
                </label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  placeholder="60"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phosphate (tons)
                </label>
                <input
                  type="number"
                  value={formData.phosphate}
                  onChange={(e) => setFormData({ ...formData, phosphate: e.target.value })}
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Potash (tons)
                </label>
                <input
                  type="number"
                  value={formData.potash}
                  onChange={(e) => setFormData({ ...formData, potash: e.target.value })}
                  placeholder="20"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Select season</option>
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="zaid">Zaid (Summer)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Analyzing...' : 'Predict Risk Level'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
            {/* Risk Level */}
            <div
              className={`mb-6 p-6 rounded-xl ${
                result.risk.color === 'green'
                  ? 'bg-green-50 dark:bg-green-900/20'
                  : result.risk.color === 'orange'
                  ? 'bg-orange-50 dark:bg-orange-900/20'
                  : 'bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <AlertTriangle
                  className={`w-8 h-8 ${
                    result.risk.color === 'green'
                      ? 'text-green-600 dark:text-green-400'
                      : result.risk.color === 'orange'
                      ? 'text-orange-600 dark:text-orange-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {result.risk.level} Risk
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300">{result.risk.message}</p>
                </div>
              </div>
              <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${
                    result.risk.color === 'green'
                      ? 'bg-green-500'
                      : result.risk.color === 'orange'
                      ? 'bg-orange-500'
                      : 'bg-red-500'
                  } transition-all`}
                  style={{ width: `${result.riskLevel}%` }}
                />
              </div>
              <p className="text-right text-sm text-gray-600 dark:text-gray-400 mt-2">
                Risk Score: {result.riskLevel}%
              </p>
            </div>

            {/* Risk Factors */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Risk Factors</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {result.factors.map((factor: any, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
                  >
                    <div className="text-green-600 dark:text-green-400">{factor.icon}</div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{factor.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{factor.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recommendations</h3>
              <div className="space-y-2">
                {result.recommendations.map((rec: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
                  >
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}