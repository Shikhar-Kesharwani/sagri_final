import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Leaf, Droplet, ThermometerSun, Wind, CheckCircle, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../components/AuthProvider';
import { BackButton } from '../components/BackButton';
import { supabase } from '../lib/supabase';

export function CropRecommendation() {
  const [formData, setFormData] = useState({
    state: '',
    season: 'Kharif',
    soilType: '',
    irrigation: '0',
    nitrogen: '',
    phosphorus: '',
    potassium: '',
    temperature: '',
    humidity: '',
    rainfall: '',
    ph: '',
    isControlledEnv: false,
  });
  
  const [statesList, setStatesList] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [isFetchingWeather, setIsFetchingWeather] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [baseAnnualRainfall, setBaseAnnualRainfall] = useState<number | null>(null);
  const [baseAnnualTemp, setBaseAnnualTemp] = useState<number | null>(null);
  const [baseAnnualHumidity, setBaseAnnualHumidity] = useState<number | null>(null);
  const { user, updatePoints } = useAuth();

  useEffect(() => {
    fetch('http://localhost:8001/api/states')
      .then(res => res.json())
      .then(data => {
        if (data.states) {
          setStatesList(data.states);
        }
      })
      .catch(err => console.error("Failed to load states", err));
  }, []);

  const handleStateChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newState = e.target.value;
    setFormData(prev => ({ ...prev, state: newState }));
    
    if (!newState) return;
    setIsLoadingProfile(true);
    toast.loading(`Fetching ICAR profile for ${newState}...`);
    try {
      const res = await fetch(`http://localhost:8001/api/state-profile/${newState}`);
      if (!res.ok) throw new Error("Failed to fetch state profile");
      const data = await res.json();
      
      if (data.profile) {
        setBaseAnnualRainfall(data.profile.rainfall);
        setBaseAnnualTemp(data.profile.temperature);
        setBaseAnnualHumidity(data.profile.humidity);
        
        let seasonalRainfall = data.profile.rainfall;
        let seasonalTemp = data.profile.temperature;
        let seasonalHumidity = data.profile.humidity;
        
        if (formData.season === 'Kharif') {
            seasonalRainfall *= 0.8;
            seasonalHumidity = Math.min(seasonalHumidity + 15, 95);
        } else if (formData.season === 'Rabi') {
            seasonalRainfall *= 0.15;
            seasonalTemp -= 5;
            seasonalHumidity = Math.max(seasonalHumidity - 10, 30);
        } else if (formData.season === 'Zaid') {
            seasonalRainfall *= 0.05;
            seasonalTemp += 5;
            seasonalHumidity = Math.max(seasonalHumidity - 20, 20);
        }
        
        setFormData(prev => ({
          ...prev,
          temperature: seasonalTemp.toFixed(1),
          humidity: seasonalHumidity.toFixed(1),
          rainfall: seasonalRainfall.toFixed(1),
        }));
        toast.dismiss();
        toast.success(`Pre-filled climate data for ${newState}. Please enter your exact soil nutrients.`);
      }
    } catch (error) {
      toast.dismiss();
      toast.error("Could not fetch state profile.");
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleAutoFillWeather = async () => {
    setIsFetchingWeather(true);
    
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      setIsFetchingWeather(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        toast.loading("Fetching 90-day climate forecast for your location...");
        
        // Calculate dates for exactly 1 year ago, spanning 90 days
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 90);

        const sDateStr = startDate.toISOString().split('T')[0];
        const eDateStr = endDate.toISOString().split('T')[0];

        const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${sDateStr}&end_date=${eDateStr}&daily=temperature_2m_mean,precipitation_sum,relative_humidity_2m_mean&timezone=auto`);
        if (!response.ok) throw new Error("Failed to fetch climate data");
        
        const data = await response.json();
        
        // Calculate averages and sums safely
        const temps = data.daily?.temperature_2m_mean?.filter((t: number | null) => t !== null) || [];
        const rains = data.daily?.precipitation_sum?.filter((r: number | null) => r !== null) || [];
        const hums = data.daily?.relative_humidity_2m_mean?.filter((h: number | null) => h !== null) || [];

        const avgTemp = temps.length > 0 ? temps.reduce((a: number, b: number) => a + b, 0) / temps.length : 25;
        const sumRain = rains.length > 0 ? rains.reduce((a: number, b: number) => a + b, 0) : 500;
        const avgHum = hums.length > 0 ? hums.reduce((a: number, b: number) => a + b, 0) / hums.length : 60;
        
        setFormData(prev => ({
          ...prev,
          temperature: avgTemp.toFixed(1),
          humidity: avgHum.toFixed(1),
          rainfall: sumRain.toFixed(1),
        }));
        
        toast.dismiss();
        toast.success("90-Day Seasonal Climate Data auto-filled!");
      } catch (error) {
        toast.dismiss();
        toast.error("Could not fetch live weather data. Please enter manually.");
      } finally {
        setIsFetchingWeather(false);
      }
    }, (error) => {
      toast.error("Location access denied. Please enter weather manually.");
      setIsFetchingWeather(false);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      toast.loading('Analyzing soil data...');
      const response = await fetch('http://localhost:8001/api/predict_crop', {
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
          state: formData.state,
          season: formData.season,
          soil_texture: formData.soilType,
          irrigation: Number(formData.irrigation),
          is_controlled_env: formData.isControlledEnv
        }),
      });

      if (!response.ok) throw new Error('API Request Failed');

      const data = await response.json();
      
      if (data.error) {
        toast.dismiss();
        toast.error(data.message, { duration: 8000 });
        return;
      }

      const crops = data.top3 ? data.top3.map((item: any) => ({
        name: item.crop.charAt(0).toUpperCase() + item.crop.slice(1),
        suitability: item.confidence,
        expectedYield: 'Based on optimal conditions',
        duration: 'Standard crop cycle',
        investment: 'Variable',
        profit: 'Calculating...',
        prescription: item.prescription || 'N/A',
        reason: data.is_mock 
          ? 'Mock Prediction: ' + (data.warning || '')
          : item.note,
      })) : [];

      toast.dismiss();
      setRecommendations({ crops, excluded: data.crops_excluded || [], stateUsed: data.state_used });
      updatePoints(15);
      toast.success(data.is_mock ? 'Mock recommendation generated!' : 'AI Recommendation generated! +15 points');

      // Asynchronously fetch prices
      crops.forEach(async (c: any, index: number) => {
        try {
          const pRes = await fetch('http://localhost:8001/api/forecast_price', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ crop_name: c.name.toLowerCase(), state: formData.state || 'Maharashtra' }),
          });
          const pData = await pRes.json();
          if (pData.success) {
            setRecommendations((prev: any) => {
              if (!prev) return prev;
              const newCrops = [...prev.crops];
              newCrops[index].profit = `₹${pData.forecast[pData.forecast.length - 1].predicted_price} / qtl (Projected)`;
              return { ...prev, crops: newCrops };
            });
          } else {
             setRecommendations((prev: any) => {
              if (!prev) return prev;
              const newCrops = [...prev.crops];
              newCrops[index].profit = `High Potential`;
              return { ...prev, crops: newCrops };
            });
          }
        } catch (e) {
          setRecommendations((prev: any) => {
            if (!prev) return prev;
            const newCrops = [...prev.crops];
            newCrops[index].profit = `High Potential`;
            return { ...prev, crops: newCrops };
          });
        }
      });
      
      if (user?.email && crops.length > 0) {
        await supabase.from('prediction_history').insert([{
          user_email: user.email,
          prediction_type: 'Crop Recommendation',
          input_data: formData,
          result: crops[0].name,
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
            
            {/* Geographic & Agronomic Info */}
            <div className="col-span-full mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Farm Geography & Agronomics
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State (Optional)
                </label>
                <select
                  value={formData.state}
                  onChange={handleStateChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a state</option>
                  {statesList.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Filters out crops that can't grow in your region.</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Season
                </label>
                <select
                  value={formData.season}
                  onChange={(e) => {
                    const newSeason = e.target.value;
                    setFormData(prev => {
                      let newRainfall = prev.rainfall;
                      let newTemp = prev.temperature;
                      let newHumidity = prev.humidity;
                      
                      if (baseAnnualRainfall !== null && baseAnnualTemp !== null && baseAnnualHumidity !== null) {
                        let seasonalR = baseAnnualRainfall;
                        let seasonalT = baseAnnualTemp;
                        let seasonalH = baseAnnualHumidity;
                        
                        if (newSeason === 'Kharif') {
                            seasonalR *= 0.8;
                            seasonalH = Math.min(seasonalH + 15, 95);
                        } else if (newSeason === 'Rabi') {
                            seasonalR *= 0.15;
                            seasonalT -= 5;
                            seasonalH = Math.max(seasonalH - 10, 30);
                        } else if (newSeason === 'Zaid') {
                            seasonalR *= 0.05;
                            seasonalT += 5;
                            seasonalH = Math.max(seasonalH - 20, 20);
                        }
                        newRainfall = seasonalR.toFixed(1);
                        newTemp = seasonalT.toFixed(1);
                        newHumidity = seasonalH.toFixed(1);
                      }
                      return { 
                          ...prev, 
                          season: newSeason, 
                          rainfall: newRainfall,
                          temperature: newTemp,
                          humidity: newHumidity
                      };
                    });
                  }}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="Kharif">Kharif (June - Oct)</option>
                  <option value="Rabi">Rabi (Oct - March)</option>
                  <option value="Zaid">Zaid (March - June)</option>
                  <option value="Perennial">Perennial (All year)</option>
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
                  <option value="Clay">Clay</option>
                  <option value="Sandy">Sandy</option>
                  <option value="Loamy">Loamy</option>
                  <option value="Laterite">Laterite</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Irrigation Availability
                </label>
                <select
                  value={formData.irrigation}
                  onChange={(e) => setFormData({ ...formData, irrigation: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="0">Rainfed Only (No irrigation)</option>
                  <option value="1">Irrigation Available</option>
                </select>
              </div>
            </div>

            {/* Soil Nutrients */}
            <div className="col-span-full mt-6 border-b border-gray-200 dark:border-gray-700 pb-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-500" />
                Soil Nutrients
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nitrogen (N) kg/ha
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
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
                  min="0"
                  step="any"
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
                  min="0"
                  step="any"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                  placeholder="30"
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
                  min="0"
                  max="14"
                  step="0.1"
                  value={formData.ph}
                  onChange={(e) => setFormData({ ...formData, ph: e.target.value })}
                  placeholder="6.5"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Environmental Data */}
            <div className="col-span-full mt-6 flex flex-col md:flex-row items-start md:items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2 gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <ThermometerSun className="w-5 h-5 text-orange-500" />
                  Environmental Data
                </h3>
                <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isControlledEnv}
                    onChange={(e) => setFormData(prev => ({ ...prev, isControlledEnv: e.target.checked }))}
                    className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500"
                  />
                  <span>Controlled Environment? (e.g., Greenhouse) - <span className="italic text-xs">Bypasses geographic limits</span></span>
                </label>
              </div>
              <button
                type="button"
                onClick={handleAutoFillWeather}
                disabled={isFetchingWeather}
                className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-400 px-3 py-1.5 rounded-lg transition-colors"
              >
                {isFetchingWeather ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
                Auto-fill via GPS
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  min="-50"
                  max="60"
                  step="any"
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
                  min="0"
                  max="100"
                  step="any"
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
                  min="0"
                  step="any"
                  value={formData.rainfall}
                  onChange={(e) => setFormData({ ...formData, rainfall: e.target.value })}
                  placeholder="800"
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
            
            {recommendations.excluded && recommendations.excluded.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-200">
                    Geographically Excluded Crops
                  </h3>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  The following crops are scientifically impossible to grow in <strong>{recommendations.stateUsed}</strong> and were automatically removed from predictions: 
                  <span className="font-semibold ml-1">{recommendations.excluded.join(', ')}</span>
                </p>
              </div>
            )}
            
            {recommendations.crops.map((crop: any, index: number) => (
              <div
                key={index}
                className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg border p-6 ${index === 0 ? 'border-green-500 dark:border-green-500 shadow-green-100 dark:shadow-none' : 'border-gray-100 dark:border-gray-700'}`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gray-100 dark:bg-gray-700'}`}>
                    <Leaf className={`w-6 h-6 ${index === 0 ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {crop.name}
                      </h3>
                      {index === 0 && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          Top Recommendation
                        </span>
                      )}
                      {index > 0 && (
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                          Alternative Option
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${index === 0 ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-blue-500'}`}
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

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Expected Yield</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.expectedYield}</p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 dark:text-purple-400 mb-1">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.duration}</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg">
                    <p className="text-sm text-orange-600 dark:text-orange-400 mb-1">Prescription</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{crop.prescription}</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <p className="text-sm text-green-600 dark:text-green-400 mb-1">Expected Profit</p>
                    {crop.profit === 'Calculating...' ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-green-500" />
                        <p className="font-semibold text-gray-500 dark:text-gray-400 italic">Calculating...</p>
                      </div>
                    ) : (
                      <p className="font-semibold text-gray-900 dark:text-white">{crop.profit}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}