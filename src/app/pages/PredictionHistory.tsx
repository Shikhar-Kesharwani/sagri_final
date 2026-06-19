import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { History, Camera, TrendingUp, AlertTriangle, Sprout, Calendar } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';

export function PredictionHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([
    { label: 'Total Predictions', value: '0', icon: <History className="w-5 h-5" /> },
    { label: 'This Month', value: '0', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Success Rate', value: '100%', icon: <TrendingUp className="w-5 h-5" /> },
  ]);

  useEffect(() => {
    async function fetchHistory() {
      if (!user?.email) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('prediction_history')
          .select('*')
          .eq('user_email', user.email)
          .order('timestamp', { ascending: false });

        if (error) throw error;

        if (data) {
          const formatted = data.map((item: any) => {
            const dateObj = new Date(item.timestamp);
            let icon = <Sprout className="w-6 h-6" />;
            let color = 'from-purple-500 to-pink-500';
            
            if (item.prediction_type === 'Price Forecast') {
              icon = <TrendingUp className="w-6 h-6" />;
              color = 'from-blue-500 to-cyan-500';
            }

            return {
              type: item.prediction_type,
              icon,
              date: dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              time: dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              result: item.result,
              status: 'success',
              details: JSON.stringify(item.input_data),
              color,
            };
          });

          setHistory(formatted);

          // Update stats
          const thisMonth = data.filter((item: any) => {
            const d = new Date(item.timestamp);
            const now = new Date();
            return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          }).length;

          setStats([
            { label: 'Total Predictions', value: formatted.length.toString(), icon: <History className="w-5 h-5" /> },
            { label: 'This Month', value: thisMonth.toString(), icon: <Calendar className="w-5 h-5" /> },
            { label: 'Success Rate', value: '100%', icon: <TrendingUp className="w-5 h-5" /> },
          ]);
        }
      } catch (err) {
        console.error("Error fetching history", err);
        toast.error("Could not load prediction history");
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [user]);

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
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
          </div>
        ) : history.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-100 dark:border-gray-700">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Predictions Yet</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Go to Crop Recommendation or Price Forecasting to get started!
            </p>
          </div>
        ) : (
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

                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-3 overflow-hidden text-ellipsis whitespace-nowrap">Input: {item.details}</p>

                    <div className="flex items-center gap-4">
                      <button className="text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 transition-colors">
                        View Full Analysis
                      </button>
                      <button className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                        Share Report
                      </button>
                    </div>
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