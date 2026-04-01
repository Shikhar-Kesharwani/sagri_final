import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Leaf, Droplet, ThermometerSun, Wind, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';

export function CropRecommendation() {
  const [formData, setFormData] = useState({
    soilType: '',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    ph: '',
  });
  const [recommendations, setRecommendations] = useState<any>(null);
  const { updatePoints } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Show loading toast
      toast.loading('Analyzing soil data...');

      const response = await fetch('http://localhost:8000/api/predict_crop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          N: Number(formData.nitrogen),
          P: Number(formData.phosphorus),
          K: Number(formData.potassium),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          rainfall: Number(formData.rainfall),
          ph: Number(formData.ph),
        }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      
      const crops = [
        {
          name: data.recommended_crop.charAt(0).toUpperCase() + data.recommended_crop.slice(1),
          suitability: 98,
          expectedYield: 'Based on optimal conditions',
          duration: 'Standard crop cycle',
          investment: 'Variable',
          profit: 'High Potential',
          reason: data.is_mock 
            ? 'Mock Prediction: ' + (data.warning || '')
            : 'ML Prediction based on your exact NPK and weather values!',
        }
      ];

      toast.dismiss(); // clear loading
      setRecommendations({ crops });
      updatePoints(15);
      toast.success(data.is_mock ? 'Mock recommendation generated!' : 'AI Recommendation generated! +15 points');
      
    } catch (error) {
      toast.dismiss();
      toast.error('Could not reach AI backend. Is the FastAPI server running?');
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
            Smart Crop Recommendation
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get personalized crop suggestions based on your soil and climate data
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
                  <option value="red">Red Soil</option>
                  <option value="black">Black Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nitrogen (N) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                  placeholder="50"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Phosphorus (P) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                  placeholder="40"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Potassium (K) kg/ha
                </label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  placeholder="30"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature (°C)
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
                  placeholder="65"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rainfall (mm)
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
                  Soil pH
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  placeholder="6.5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
            >
              Get Crop Recommendations
            </button>
          </form>
        </div>

        {recommendations && (
          <div className="space-y-6">
            {recommendations.crops.map((crop: any, index: number) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Leaf className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {crop.name}
                      </h3>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          Best Match
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all"
                          style={{ width: `${crop.suitability}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {crop.suitability}% Match
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{crop.reason}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Expected Yield</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.expectedYield}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.duration}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Investment</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.investment}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    <p className="font-medium text-green-900 dark:text-green-300">
                      Expected Profit
                    </p>
                  </div>
                  <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                    {crop.profit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}