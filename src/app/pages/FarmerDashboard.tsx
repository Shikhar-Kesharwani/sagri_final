import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { useAuth } from '../components/AuthProvider';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { useWeather } from '../hooks/useWeather';
import {
  Camera,
  AlertTriangle,
  TrendingUp,
  Sprout,
  Calendar,
  Cloud,
  DollarSign,
  Users,
  MessageCircle,
  FileText,
  Droplet,
  Award,
  Bell,
  ChevronRight,
  MapPin,
  Sun,
  CloudRain,
  Wind,
  Thermometer,
  TrendingDown,
  CheckCircle2,
  AlertCircle,
  Activity,
  Target,
  Zap,
  Sparkles,
  ShoppingCart,
  ShoppingBag,
  Landmark,
  Tractor,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

export function FarmerDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Fetch real weather data
  const location = user?.location || 'Punjab, India';
  const { weather } = useWeather(location);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Use real weather data or fallback to mock
  const weatherData = weather?.hourly || [
    { time: '6 AM', temp: 22, humidity: 75 },
    { time: '9 AM', temp: 26, humidity: 68 },
    { time: '12 PM', temp: 32, humidity: 55 },
    { time: '3 PM', temp: 34, humidity: 50 },
    { time: '6 PM', temp: 28, humidity: 60 },
    { time: '9 PM', temp: 24, humidity: 70 },
  ];

  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: t('disease_detection'),
      description: t('upload_crop_photo'),
      link: '/disease-detection',
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: <AlertTriangle className="w-8 h-8" />,
      title: t('risk_prediction'),
      description: t('check_crop_failure_risk'),
      link: '/risk-prediction',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: t('price_forecast'),
      description: t('future_price_trends'),
      link: '/price-forecasting',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Sprout className="w-8 h-8" />,
      title: t('crop_advice'),
      description: t('smart_recommendations'),
      link: '/crop-recommendation',
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: t('crop_calendar'),
      description: t('best_time_to_sow_harvest'),
      link: '/crop-calendar',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: t('weather'),
      description: t('live_weather_updates'),
      link: '/weather',
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: t('market_price'),
      description: t('compare_mandi_rates'),
      link: '/market-price',
      gradient: 'from-green-600 to-emerald-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: t('community'),
      description: t('connect_with_farmers'),
      link: '/community',
      gradient: 'from-indigo-500 to-purple-500',
    },
    {
      icon: <MessageCircle className="w-8 h-8" />,
      title: t('expert_connect'),
      description: t('chat_with_experts'),
      link: '/expert-connect',
      gradient: 'from-pink-500 to-rose-500',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: t('govt_schemes'),
      description: t('subsidy_information'),
      link: '/schemes',
      gradient: 'from-orange-500 to-red-500',
    },
    {
      icon: <Droplet className="w-8 h-8" />,
      title: t('soil_health'),
      description: t('soil_test_reports'),
      link: '/soil-health',
      gradient: 'from-cyan-500 to-blue-500',
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: t('my_history'),
      description: t('past_predictions'),
      link: '/history',
      gradient: 'from-purple-600 to-indigo-600',
    },
  ];

  const alerts = [
    {
      message: t('heavy_rain_expected'),
      type: 'warning' as const,
      time: '2 hours ago',
      icon: <CloudRain className="w-5 h-5" />,
    },
    {
      message: t('disease_outbreak_nearby_area'),
      type: 'danger' as const,
      time: '5 hours ago',
      icon: <AlertCircle className="w-5 h-5" />,
    },
    {
      message: t('wheat_prices_rising'),
      type: 'success' as const,
      time: '1 day ago',
      icon: <TrendingUp className="w-5 h-5" />,
    },
  ];

  const farmStats = [
    { label: t('land_size'), value: '15 Acres', icon: <MapPin className="w-5 h-5" />, color: 'emerald' },
    { label: t('active_crops'), value: '3', icon: <Sprout className="w-5 h-5" />, color: 'green' },
    { label: t('yield_prediction'), value: '125%', icon: <Target className="w-5 h-5" />, color: 'blue' },
    { label: t('health_score'), value: '95/100', icon: <Activity className="w-5 h-5" />, color: 'purple' },
  ];

  const soilHealthData = [
    { name: 'Nitrogen', value: 85, color: '#10b981' },
    { name: 'Phosphorus', value: 72, color: '#3b82f6' },
    { name: 'Potassium', value: 68, color: '#f59e0b' },
    { name: 'pH Level', value: 90, color: '#8b5cf6' },
  ];

  const marketTrendData = [
    { month: 'Jan', wheat: 2100, rice: 2800, cotton: 5500 },
    { month: 'Feb', wheat: 2150, rice: 2750, cotton: 5600 },
    { month: 'Mar', wheat: 2200, rice: 2900, cotton: 5400 },
    { month: 'Apr', wheat: 2250, rice: 3000, cotton: 5700 },
    { month: 'May', wheat: 2300, rice: 3100, cotton: 5850 },
    { month: 'Jun', wheat: 2250, rice: 3050, cotton: 5800 },
  ];

  const tasks = [
    { id: 1, task: 'Water wheat field (Section A)', time: 'Today, 6:00 AM', priority: 'high', completed: false },
    { id: 2, task: 'Apply fertilizer to rice', time: 'Today, 10:00 AM', priority: 'medium', completed: false },
    { id: 3, task: 'Check irrigation system', time: 'Tomorrow, 7:00 AM', priority: 'low', completed: false },
    { id: 4, task: 'Harvest wheat (Section B)', time: 'In 3 days', priority: 'high', completed: false },
  ];

  const cropDistribution = [
    { name: 'Wheat', value: 60, color: '#fbbf24' },
    { name: 'Rice', value: 25, color: '#10b981' },
    { name: 'Cotton', value: 15, color: '#3b82f6' },
  ];

  const recentActivity = [
    {
      title: t('wheat_disease_check'),
      result: t('healthy'),
      date: 'Today, 10:30 AM',
      icon: <Camera className="w-5 h-5" />,
      color: 'emerald',
    },
    {
      title: t('rice_price_forecast'),
      result: '₹2,850/quintal',
      date: 'Yesterday, 3:45 PM',
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'blue',
    },
    {
      title: t('soil_health_report'),
      result: t('good_condition'),
      date: '2 days ago',
      icon: <Droplet className="w-5 h-5" />,
      color: 'cyan',
    },
  ];

  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-emerald-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 relative overflow-hidden pb-20 md:pb-0">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl"
        />
      </div>

      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Welcome Banner with Farm Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-emerald-500 via-green-600 to-emerald-500 rounded-3xl p-8 mb-8 text-white shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-3 mb-3"
                >
                  <Sparkles className="w-6 h-6" />
                  <span className="text-emerald-100 font-medium">{currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                </motion.div>
                <motion.h1
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl md:text-4xl font-bold mb-2"
                >
                  {greeting}, {user?.name || 'Farmer'}! 🌾
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-emerald-100 text-lg"
                >
                  {t('farm_looking_great')}
                </motion.p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl font-bold">{user?.points || 850}</div>
                  <div className="text-sm text-emerald-100 mt-1">{t('dashboard.points')}</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/20 backdrop-blur-md rounded-2xl p-4 text-center"
                >
                  <div className="text-3xl font-bold">24</div>
                  <div className="text-sm text-emerald-100 mt-1">{t('dashboard.totalPredictions')}</div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Farm Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {farmStats.map((stat, idx) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 dark:border-stone-700/20`}
            >
              <div className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl flex items-center justify-center text-white mb-4 shadow-lg`}>
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-stone-900 dark:text-white mb-1">{stat.value}</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Marketplace Quick Actions - NEW */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-6 h-6 text-emerald-500" />
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white">
              {t('marketplace_services')}
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/sell-crops">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <ShoppingCart className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{t('sell_crops')}</h3>
                <p className="text-green-100 text-sm mb-3">{t('sell_crops_desc')}</p>
                <div className="flex items-center text-sm font-semibold">
                  {t('get_best_price')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </Link>

            <Link to="/buy-seeds">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <ShoppingBag className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{t('buy_seeds')}</h3>
                <p className="text-blue-100 text-sm mb-3">{t('buy_seeds_desc')}</p>
                <div className="flex items-center text-sm font-semibold">
                  {t('browse_seeds')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </Link>

            <Link to="/check-loans">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <Landmark className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{t('check_loans')}</h3>
                <p className="text-purple-100 text-sm mb-3">{t('check_loans_desc')}</p>
                <div className="flex items-center text-sm font-semibold">
                  {t('view_schemes')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </Link>

            <Link to="/book-equipment">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer"
              >
                <Tractor className="w-10 h-10 mb-3 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{t('rent_equipment')}</h3>
                <p className="text-orange-100 text-sm mb-3">{t('rent_equipment_desc')}</p>
                <div className="flex items-center text-sm font-semibold">
                  {t('book_now')}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </motion.div>
            </Link>
          </div>
        </motion.div>

        {/* Weather Widget & Alerts */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Weather Widget */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-stone-700/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Cloud className="w-6 h-6 text-emerald-500" />
                {t('weather_forecast')}
              </h2>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-4xl font-bold text-stone-900 dark:text-white">28°C</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">{t('partly_cloudy')}</div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sun className="w-16 h-16 text-amber-500" />
                </motion.div>
              </div>
            </div>
            
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={weatherData}>
                <defs>
                  <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="time" stroke="#78716c" />
                <YAxis stroke="#78716c" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={3} fill="url(#tempGradient)" />
              </AreaChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
                <Droplet className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">65%</div>
                <div className="text-xs opacity-90">{t('humidity')}</div>
              </div>
              <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-xl p-4 text-white">
                <Wind className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">12 km/h</div>
                <div className="text-xs opacity-90">{t('wind_speed_label')}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-indigo-500 rounded-xl p-4 text-white">
                <CloudRain className="w-6 h-6 mb-2" />
                <div className="text-2xl font-bold">45%</div>
                <div className="text-xs opacity-90">{t('rain_chance')}</div>
              </div>
            </div>
          </motion.div>

          {/* Alerts & Notifications */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-stone-700/20"
          >
            <div className="flex items-center gap-2 mb-6">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Bell className="w-6 h-6 text-emerald-500" />
              </motion.div>
              <h2 className="text-xl font-bold text-stone-900 dark:text-white">{t('alerts')}</h2>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className={`p-4 rounded-xl border-l-4 ${
                    alert.type === 'warning'
                      ? 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
                      : alert.type === 'danger'
                      ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                      : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 ${
                      alert.type === 'warning' ? 'text-amber-600' :
                      alert.type === 'danger' ? 'text-red-600' : 'text-emerald-600'
                    }`}>
                      {alert.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-stone-900 dark:text-white mb-1">
                        {alert.message}
                      </p>
                      <p className="text-xs text-stone-600 dark:text-stone-400">{alert.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Soil Health & Market Trends */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Soil Health Analytics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-stone-700/20"
          >
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <Droplet className="w-6 h-6 text-emerald-500" />
              {t('soil_health_analytics')}
            </h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {soilHealthData.map((item, idx) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-800 rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{item.name}</span>
                    <span className="text-lg font-bold text-stone-900 dark:text-white">{item.value}%</span>
                  </div>
                  <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.value}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 + 0.2, duration: 0.8 }}
                      className="h-2 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={cropDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}-${entry.name}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Market Trends */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-stone-700/20"
          >
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
              {t('market_price_trends')}
            </h2>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                <XAxis dataKey="month" stroke="#78716c" />
                <YAxis stroke="#78716c" />
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(255, 255, 255, 0.9)', 
                    border: 'none', 
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="wheat" stroke="#fbbf24" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rice" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="cotton" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Task Manager */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20 dark:border-stone-700/20 mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              {t('todays_tasks')}
            </h2>
            <span className="text-sm text-stone-600 dark:text-stone-400">{tasks.filter(t => !t.completed).length} {t('pending')}</span>
          </div>
          
          <div className="space-y-3">
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: task.id * 0.05 }}
                whileHover={{ scale: 1.02, x: 10 }}
                className="bg-gradient-to-r from-stone-50 to-white dark:from-stone-900 dark:to-stone-800 rounded-xl p-4 flex items-center gap-4 border border-stone-200 dark:border-stone-700"
              >
                <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-2 border-emerald-500 checked:bg-emerald-500"
                />
                <div className="flex-1">
                  <div className="font-medium text-stone-900 dark:text-white">{task.task}</div>
                  <div className="text-sm text-stone-600 dark:text-stone-400">{task.time}</div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  task.priority === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                  task.priority === 'medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                  'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                }`}>
                  {task.priority}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
            {t('dashboard.quickActions')}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <Link
                  to={feature.link}
                  className="block bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all border border-white/20 dark:border-stone-700/20 group"
                >
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                    className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-4 text-white shadow-lg`}
                  >
                    {feature.icon}
                  </motion.div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-stone-400 mb-4">
                    {feature.description}
                  </p>
                  <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
                    {t('open_feature')}
                    <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">
            {t('dashboard.recentActivity')}
          </h2>
          <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 dark:border-stone-700/20 overflow-hidden">
            {recentActivity.map((activity, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.05)', x: 10 }}
                className={`p-6 flex items-center justify-between transition-all ${
                  idx !== recentActivity.length - 1 ? 'border-b border-stone-200 dark:border-stone-700' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 bg-gradient-to-br from-${activity.color}-500 to-${activity.color}-600 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                    {activity.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 dark:text-white text-lg">
                      {activity.title}
                    </h3>
                    <p className="text-sm text-stone-600 dark:text-stone-400">{activity.date}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-base font-semibold text-${activity.color}-600 dark:text-${activity.color}-400`}>
                    {activity.result}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* AI Assistant Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.02 }}
          className="mt-8 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"
          />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8" />
                <h3 className="text-2xl font-bold">AI Assistant Available</h3>
              </div>
              <p className="text-purple-100 text-lg mb-4">
                Get instant answers to your farming questions. Try our voice assistant for hands-free help!
              </p>
              <button className="px-6 py-3 bg-white text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition-all shadow-lg">
                Start Conversation
              </button>
            </div>
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-32 h-32 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center"
            >
              <MessageCircle className="w-16 h-16" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}