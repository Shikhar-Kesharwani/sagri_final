import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Leaf, Droplet, Wind, TestTube } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function SoilHealth() {
  const soilData = [
    { nutrient: 'Nitrogen', value: 75, ideal: 80 },
    { nutrient: 'Phosphorus', value: 65, ideal: 70 },
    { nutrient: 'Potassium', value: 80, ideal: 75 },
    { nutrient: 'Organic Carbon', value: 55, ideal: 60 },
    { nutrient: 'pH Level', value: 85, ideal: 85 },
  ];

  const recommendations = [
    {
      nutrient: 'Nitrogen',
      status: 'Low',
      recommendation: 'Apply 20 kg Urea per acre',
      priority: 'high',
    },
    {
      nutrient: 'Phosphorus',
      status: 'Moderate',
      recommendation: 'Apply 15 kg DAP per acre',
      priority: 'medium',
    },
    {
      nutrient: 'Organic Matter',
      status: 'Low',
      recommendation: 'Add compost or farmyard manure',
      priority: 'high',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Soil Health Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive analysis and recommendations for your soil
          </p>
        </div>

        {/* Overall Health Score */}
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-8 mb-8 text-white shadow-2xl">
          <div className="text-center">
            <Droplet className="w-16 h-16 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-semibold mb-2">Overall Soil Health</h2>
            <div className="text-6xl font-bold mb-2">72/100</div>
            <p className="text-green-100 text-lg">Good Condition</p>
          </div>
        </div>

        {/* Nutrient Analysis Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Nutrient Analysis
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={soilData}>
              <PolarGrid stroke="#374151" />
              <PolarAngleAxis dataKey="nutrient" stroke="#9ca3af" />
              <PolarRadiusAxis stroke="#9ca3af" />
              <Radar
                name="Current"
                dataKey="value"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.5}
              />
              <Radar
                name="Ideal"
                dataKey="ideal"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.3}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Detailed Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {soilData.map((item) => {
            const diff = item.value - item.ideal;
            const status = diff >= 0 ? 'good' : 'low';

            return (
              <div
                key={item.nutrient}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900 dark:text-white">{item.nutrient}</h4>
                  {status === 'good' ? (
                    <TrendingUp className="w-5 h-5 text-green-500" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-orange-500" />
                  )}
                </div>
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {item.value}%
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      / {item.ideal}% ideal
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        status === 'good' ? 'bg-green-500' : 'bg-orange-500'
                      }`}
                      style={{ width: `${(item.value / item.ideal) * 100}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                    status === 'good'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                  }`}
                >
                  {status === 'good' ? 'Good' : 'Needs Attention'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Recommendations */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recommended Actions
          </h3>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  rec.priority === 'high'
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500'
                }`}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                      rec.priority === 'high'
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-yellow-600 dark:text-yellow-400'
                    }`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {rec.nutrient}
                      </h4>
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          rec.priority === 'high'
                            ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                        }`}
                      >
                        {rec.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{rec.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next Test */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6 text-center">
          <p className="text-blue-900 dark:text-blue-300 mb-4">
            Next soil test recommended in <strong>6 months</strong>
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Schedule Test
          </button>
        </div>
      </div>
    </div>
  );
}