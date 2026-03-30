import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Calendar as CalendarIcon, Droplet, Sun, Scissors, CheckCircle } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function CropCalendar() {
  const crops = [
    {
      name: 'Wheat',
      season: 'Rabi',
      stages: [
        { name: 'Sowing', period: 'Nov 1-15', icon: <Sun className="w-5 h-5" />, status: 'upcoming' },
        { name: 'Irrigation', period: 'Dec-Feb', icon: <Droplet className="w-5 h-5" />, status: 'pending' },
        { name: 'Fertilizer', period: 'Jan', icon: <Sun className="w-5 h-5" />, status: 'pending' },
        { name: 'Harvest', period: 'Apr 1-20', icon: <Scissors className="w-5 h-5" />, status: 'pending' },
      ],
    },
    {
      name: 'Rice',
      season: 'Kharif',
      stages: [
        { name: 'Sowing', period: 'Jun-Jul', icon: <Sun className="w-5 h-5" />, status: 'completed' },
        { name: 'Transplanting', period: 'Jul', icon: <Droplet className="w-5 h-5" />, status: 'completed' },
        { name: 'Irrigation', period: 'Aug-Sep', icon: <Droplet className="w-5 h-5" />, status: 'active' },
        { name: 'Harvest', period: 'Oct-Nov', icon: <Scissors className="w-5 h-5" />, status: 'upcoming' },
      ],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'active':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800';
      case 'upcoming':
        return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800';
      default:
        return 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-600';
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
            AI Crop Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Optimal timing for sowing, irrigation, and harvesting
          </p>
        </div>

        <div className="space-y-6">
          {crops.map((crop) => (
            <div
              key={crop.name}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{crop.name}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{crop.season} Season</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {crop.stages.map((stage, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border-2 ${getStatusColor(stage.status)}`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {stage.icon}
                      <h3 className="font-semibold">{stage.name}</h3>
                    </div>
                    <p className="text-sm mb-2">{stage.period}</p>
                    <span className="text-xs uppercase font-medium">{stage.status}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Tasks */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Upcoming Tasks This Week
          </h2>
          <div className="space-y-3">
            {[
              { task: 'Wheat Sowing', date: 'Nov 5, 2026', priority: 'high' },
              { task: 'Rice Irrigation', date: 'Nov 8, 2026', priority: 'medium' },
              { task: 'Apply Fertilizer', date: 'Nov 10, 2026', priority: 'low' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.task}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.date}</p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    item.priority === 'high'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                      : item.priority === 'medium'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                      : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                  }`}
                >
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}