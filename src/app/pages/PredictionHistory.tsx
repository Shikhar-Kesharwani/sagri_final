import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { History, Camera, TrendingUp, AlertTriangle, Sprout, Calendar } from 'lucide-react';

export function PredictionHistory() {
  const history = [
    {
      type: 'Disease Detection',
      icon: <Camera className="w-6 h-6" />,
      date: 'Mar 24, 2026',
      time: '10:30 AM',
      result: 'Healthy Crop',
      status: 'success',
      details: 'Wheat crop analysis - No disease detected',
      color: 'from-green-500 to-emerald-500',
    },
    {
      type: 'Price Forecast',
      icon: <TrendingUp className="w-6 h-6" />,
      date: 'Mar 23, 2026',
      time: '03:15 PM',
      result: '₹2,450/quintal',
      status: 'info',
      details: 'Wheat price prediction for next month',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      type: 'Risk Assessment',
      icon: <AlertTriangle className="w-6 h-6" />,
      date: 'Mar 22, 2026',
      time: '11:45 AM',
      result: 'Low Risk',
      status: 'success',
      details: 'Crop failure risk prediction',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      type: 'Crop Recommendation',
      icon: <Sprout className="w-6 h-6" />,
      date: 'Mar 20, 2026',
      time: '09:20 AM',
      result: 'Rice - 92% Match',
      status: 'success',
      details: 'Based on soil and climate conditions',
      color: 'from-purple-500 to-pink-500',
    },
    {
      type: 'Disease Detection',
      icon: <Camera className="w-6 h-6" />,
      date: 'Mar 18, 2026',
      time: '02:30 PM',
      result: 'Leaf Blight Detected',
      status: 'warning',
      details: 'Wheat crop - Medium severity',
      color: 'from-red-500 to-orange-500',
    },
    {
      type: 'Price Forecast',
      icon: <TrendingUp className="w-6 h-6" />,
      date: 'Mar 15, 2026',
      time: '04:00 PM',
      result: '₹3,200/quintal',
      status: 'info',
      details: 'Rice price prediction',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  const stats = [
    { label: 'Total Predictions', value: '48', icon: <History className="w-5 h-5" /> },
    { label: 'This Month', value: '12', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Success Rate', value: '94%', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Prediction History
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View all your past predictions and analyses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="text-green-600 dark:text-green-400">{stat.icon}</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* History List */}
        <div className="space-y-4">
          {history.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 hover:shadow-xl transition-all"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-14 h-14 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center text-white flex-shrink-0`}
                >
                  {item.icon}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {item.type}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.date} at {item.time}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'success'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : item.status === 'warning'
                          ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Result</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{item.result}</p>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">{item.details}</p>

                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                      View Details
                    </button>
                    <button className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                      Download Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl">
            Load More History
          </button>
        </div>
      </div>
    </div>
  );
}