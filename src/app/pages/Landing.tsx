import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Header } from '../components/Header';
import { ModernAuth } from '../components/ModernAuth';
import { motion } from 'motion/react';
import {
  Sprout,
  Brain,
  TrendingUp,
  Cloud,
  Users,
  Award,
  Shield,
  Zap,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Sun,
  Droplets,
  Wind,
  ShoppingCart,
  Tractor,
  CreditCard,
  Package,
  Star,
  Quote,
  CloudRain,
  ThermometerSun,
} from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { useLanguage } from '../contexts/LanguageContext';

export function Landing() {
  const [showLogin, setShowLogin] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: t('features.diseaseDetection'),
      description: t('features.diseaseDesc'),
      gradient: 'from-rose-500 to-pink-500',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: t('features.priceForecasting'),
      description: t('features.priceDesc'),
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Risk Prediction',
      description: 'Predict crop failure risks using AI and historical data',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: <Sprout className="w-6 h-6" />,
      title: t('features.recommendations'),
      description: t('features.recommendDesc'),
      gradient: 'from-emerald-500 to-green-500',
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'Weather Intelligence',
      description: 'Real-time weather insights and forecasts',
      gradient: 'from-sky-500 to-blue-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Farmer Community',
      description: 'Connect, share, and grow together',
      gradient: 'from-purple-500 to-indigo-500',
    },
  ];

  const weatherData = {
    temperature: 28,
    humidity: 65,
    rainfall: 45,
    condition: 'Partly Cloudy',
  };

  const cropRecommendations = [
    { name: 'Wheat', season: 'Rabi', suitability: 95 },
    { name: 'Rice', season: 'Kharif', suitability: 88 },
    { name: 'Cotton', season: 'Kharif', suitability: 82 },
  ];

  const marketPrices = [
    { crop: 'Wheat', price: '₹2,250', change: '+5%', trend: 'up' },
    { crop: 'Rice', price: '₹3,100', change: '+2%', trend: 'up' },
    { crop: 'Cotton', price: '₹5,850', change: '-1%', trend: 'down' },
  ];

  const quickActions = [
    {
      icon: <ShoppingCart className="w-6 h-6" />,
      label: 'Sell Crops',
      color: 'from-emerald-500 to-green-600',
    },
    {
      icon: <Package className="w-6 h-6" />,
      label: 'Buy Seeds',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      label: 'Check Loans',
      color: 'from-purple-500 to-indigo-600',
    },
    {
      icon: <Tractor className="w-6 h-6" />,
      label: 'Book Equipment',
      color: 'from-orange-500 to-red-600',
    },
  ];

  const testimonials = [
    {
      name: 'राजेश कुमार',
      location: 'Punjab',
      image: '👨‍🌾',
      text: 'SAGRI helped me increase my wheat yield by 30%. The disease detection is amazing!',
      rating: 5,
    },
    {
      name: 'प्रिया शर्मा',
      location: 'Haryana',
      image: '👩‍🌾',
      text: 'Price forecasting feature saved me from losses. Highly recommended!',
      rating: 5,
    },
    {
      name: 'सुरेश पटेल',
      location: 'Gujarat',
      image: '👨‍🌾',
      text: 'The weather alerts are so accurate. I can plan my farming activities better now.',
      rating: 5,
    },
  ];

  const stats = [
    { label: 'Active Farmers', value: '50,000+' },
    { label: 'Predictions Made', value: '2M+' },
    { label: 'Villages Covered', value: '5,000+' },
    { label: 'Success Rate', value: '95%' },
  ];

  // Floating animation variants
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950 relative overflow-hidden pb-20 md:pb-0">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={floatingAnimation}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-emerald-400/20 to-green-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1 } }}
          className="absolute top-1/3 right-10 w-96 h-96 bg-gradient-to-r from-amber-400/20 to-yellow-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 2 } }}
          className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-blue-400/20 to-cyan-400/20 rounded-full blur-3xl"
        />
      </div>

      <Header />

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500/10 to-green-500/10 backdrop-blur-sm border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-semibold mb-6 shadow-lg"
              >
                <Zap className="w-4 h-4" />
                AI-Powered Smart Agriculture
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-bold text-stone-900 dark:text-white mb-6 leading-tight">
                <span className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-500 bg-clip-text text-transparent">
                  Smart Farming,
                </span>
                <br />
                <span className="text-stone-800 dark:text-stone-100">Smarter Future</span>
              </h1>

              <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 mb-8 leading-relaxed">
                Transform your farm with AI-driven insights. Increase yields, reduce risks, and maximize profits with SAGRI - Krishi Shayak.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                {user ? (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate(user.role === 'farmer' ? '/farmer' : '/admin')}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
                  >
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowLogin(true)}
                    className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-2xl font-semibold hover:from-emerald-600 hover:to-green-700 transition-all shadow-xl hover:shadow-2xl flex items-center gap-2"
                  >
                    Get Started Free
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                )}
                
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-white/80 dark:bg-stone-800/80 backdrop-blur-md text-stone-900 dark:text-white rounded-2xl font-semibold hover:bg-white dark:hover:bg-stone-800 transition-all border border-stone-200 dark:border-stone-700 shadow-lg hover:shadow-xl"
                >
                  Watch Demo
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-stone-600 dark:text-stone-400">Multi-language Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-stone-600 dark:text-stone-400">Voice Assistant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="text-sm text-stone-600 dark:text-stone-400">Free to Use</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Weather & Quick Stats Card */}
              <div className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-stone-700/20">
                <div className="space-y-6">
                  {/* Weather Section */}
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-4 flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-emerald-500" />
                      Today's Weather
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white"
                      >
                        <ThermometerSun className="w-8 h-8 mb-2" />
                        <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
                        <div className="text-sm opacity-90">Temperature</div>
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-4 text-white"
                      >
                        <Droplets className="w-8 h-8 mb-2" />
                        <div className="text-3xl font-bold">{weatherData.humidity}%</div>
                        <div className="text-sm opacity-90">Humidity</div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Crop Recommendations Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-stone-900 dark:text-white mb-3 flex items-center gap-2">
                      <Sprout className="w-5 h-5 text-emerald-500" />
                      Recommended Crops
                    </h3>
                    <div className="space-y-2">
                      {cropRecommendations.map((crop, idx) => (
                        <motion.div
                          key={crop.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + idx * 0.1 }}
                          className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                            <div>
                              <div className="font-medium text-stone-900 dark:text-white">{crop.name}</div>
                              <div className="text-xs text-stone-600 dark:text-stone-400">{crop.season} Season</div>
                            </div>
                          </div>
                          <div className="text-emerald-600 dark:text-emerald-400 font-semibold">{crop.suitability}%</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Decorative Elements */}
              <motion.div
                animate={floatingAnimation}
                className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full blur-2xl opacity-60"
              />
              <motion.div
                animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 1.5 } }}
                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full blur-2xl opacity-60"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Market Prices & Quick Actions */}
      <section className="relative py-12 bg-white/50 dark:bg-stone-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Market Prices */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-emerald-500" />
                Today's Market Prices
              </h2>
              <div className="space-y-3">
                {marketPrices.map((item, idx) => (
                  <motion.div
                    key={item.crop}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                    className="bg-white dark:bg-stone-800 rounded-2xl p-5 shadow-lg border border-stone-200 dark:border-stone-700 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                        {item.crop[0]}
                      </div>
                      <div>
                        <div className="font-semibold text-stone-900 dark:text-white">{item.crop}</div>
                        <div className="text-sm text-stone-600 dark:text-stone-400">Per Quintal</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-stone-900 dark:text-white">{item.price}</div>
                      <div className={`text-sm font-medium ${item.trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {item.change}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-stone-900 dark:text-white mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, idx) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-white shadow-lg hover:shadow-2xl transition-all`}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        {action.icon}
                      </div>
                      <span className="font-semibold">{action.label}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, type: 'spring' }}
                className="text-center"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.2 }}
                  className="text-4xl md:text-5xl font-bold text-white mb-2"
                >
                  {stat.value}
                </motion.div>
                <div className="text-emerald-100 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4">
              Powerful Features for Modern Farming
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400 max-w-2xl mx-auto">
              Everything you need to make informed farming decisions, all in one platform
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white/70 dark:bg-stone-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-white/20 dark:border-stone-700/20 group"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg`}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-stone-600 dark:text-stone-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 bg-gradient-to-br from-stone-100 to-emerald-50 dark:from-stone-900 dark:to-emerald-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-stone-900 dark:text-white mb-4">
              Farmer Success Stories
            </h2>
            <p className="text-xl text-stone-600 dark:text-stone-400">
              See how SAGRI is transforming lives across India
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="bg-white dark:bg-stone-800 rounded-3xl p-8 shadow-xl relative"
              >
                <Quote className="absolute top-6 right-6 w-12 h-12 text-emerald-500/20" />
                <div className="relative">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-stone-700 dark:text-stone-300 mb-6 leading-relaxed italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center text-3xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">{testimonial.name}</div>
                      <div className="text-sm text-stone-600 dark:text-stone-400">{testimonial.location}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-600 overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: 'linear' }}
          className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/10 rounded-full blur-3xl"
        />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            Ready to Transform Your Farming?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-emerald-100 mb-8"
          >
            Join thousands of farmers already using SAGRI to increase their yields and profits
          </motion.p>
          {!user && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, type: 'spring' }}
              whileHover={{ scale: 1.1, y: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowLogin(true)}
              className="px-10 py-5 bg-white text-emerald-600 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-2xl hover:shadow-3xl inline-flex items-center gap-3 text-lg"
            >
              Start Free Today
              <ArrowRight className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-stone-900 text-stone-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sprout className="w-7 h-7 text-white" />
                </div>
                <span className="font-bold text-white text-xl">SAGRI</span>
              </div>
              <p className="text-sm leading-relaxed">
                Empowering Indian farmers with AI-driven agricultural insights and smart farming solutions.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Features</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Disease Detection</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Price Forecasting</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Weather Intelligence</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Community</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Support</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Help Center</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Contact Us</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">FAQs</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Tutorials</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4 text-lg">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-emerald-400 transition-colors cursor-pointer">Cookie Policy</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-stone-800 pt-8 text-center">
            <p className="text-sm">&copy; 2026 SAGRI - Krishi Shayak. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <ModernAuth isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
}