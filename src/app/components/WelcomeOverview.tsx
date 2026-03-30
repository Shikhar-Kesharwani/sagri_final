import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import {
  Leaf,
  TrendingUp,
  Shield,
  Cloud,
  Users,
  Calendar,
  ShoppingCart,
  FileText,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Award,
  Brain,
  Camera,
  X,
} from 'lucide-react';
import { Logo } from './Logo';

interface WelcomeOverviewProps {
  isOpen: boolean;
  onComplete: () => void;
  userName: string;
}

export function WelcomeOverview({ isOpen, onComplete, userName }: WelcomeOverviewProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: '🌿 AI Crop Disease Detection',
      description: 'Scan your crops instantly and get AI-powered disease diagnosis with treatment recommendations',
      gradient: 'from-rose-500 to-pink-600',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: '📈 Price Forecasting',
      description: 'Predict market prices for your crops up to 30 days ahead using advanced AI algorithms',
      gradient: 'from-blue-500 to-cyan-600',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: '🛡️ Crop Failure Risk Prediction',
      description: 'Get early warnings about potential crop failures based on weather, soil, and historical data',
      gradient: 'from-amber-500 to-orange-600',
    },
    {
      icon: <Leaf className="w-8 h-8" />,
      title: '🌾 Smart Crop Recommendations',
      description: 'Discover the best crops to grow based on your soil, climate, and market demand',
      gradient: 'from-emerald-500 to-green-600',
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: '🌦️ Weather Intelligence',
      description: 'Get hyperlocal weather forecasts, rainfall predictions, and farming alerts',
      gradient: 'from-sky-500 to-blue-600',
    },
    {
      icon: <ShoppingCart className="w-8 h-8" />,
      title: '🛒 Market Price Comparison',
      description: 'Compare real-time prices across multiple mandis and find the best deals',
      gradient: 'from-purple-500 to-indigo-600',
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: '👥 Expert Connect',
      description: 'Chat with agricultural experts and AI assistants for instant farming advice',
      gradient: 'from-teal-500 to-green-600',
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: '📋 Government Schemes',
      description: 'Discover and apply for subsidies, loans, and benefits designed for farmers',
      gradient: 'from-violet-500 to-purple-600',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      if (currentStep < features.length) {
        setCurrentStep(currentStep + 1);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [currentStep, isOpen, features.length]);

  const handleSkip = () => {
    setCurrentStep(features.length);
    setTimeout(onComplete, 500);
  };

  const handleComplete = () => {
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gradient-to-br from-green-900/95 via-emerald-900/95 to-teal-900/95 backdrop-blur-lg flex items-center justify-center z-[100] p-4"
      >
        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-white/80 hover:text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
        >
          Skip Tour
        </button>

        <div className="max-w-4xl w-full">
          {/* Logo and Welcome Section */}
          {currentStep === 0 && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="inline-block mb-6"
              >
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl mx-auto">
                  <Logo className="w-24 h-24 object-contain" />
                </div>
              </motion.div>

              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-6xl font-bold text-white mb-4"
              >
                Welcome to SAGRI
              </motion.h1>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-green-100 mb-2"
              >
                Krishi Shayak 🌾
              </motion.p>

              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-xl text-green-200 mb-8"
              >
                Hello, <span className="font-bold text-white">{userName}!</span>
              </motion.p>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
              >
                <Sparkles className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <p className="text-lg text-white mb-6">
                  Your intelligent farming assistant powered by AI
                </p>
                <p className="text-green-200">
                  Let us show you what's possible with SAGRI...
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-2 h-2 bg-white rounded-full"
                  />
                ))}
              </motion.div>
            </motion.div>
          )}

          {/* Feature Showcase */}
          {currentStep > 0 && currentStep <= features.length && (
            <motion.div
              key={currentStep}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <div className="mb-6">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className={`w-24 h-24 bg-gradient-to-br ${features[currentStep - 1].gradient} rounded-3xl flex items-center justify-center mx-auto shadow-2xl`}
                >
                  <div className="text-white">{features[currentStep - 1].icon}</div>
                </motion.div>
              </div>

              <h2 className="text-4xl font-bold text-white mb-4">
                {features[currentStep - 1].title}
              </h2>

              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                {features[currentStep - 1].description}
              </p>

              {/* Progress indicators */}
              <div className="flex justify-center gap-2 mb-8">
                {features.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      index < currentStep ? 'w-8 bg-white' : 'w-1.5 bg-white/30'
                    }`}
                  />
                ))}
              </div>

              <p className="text-sm text-green-200">
                {currentStep} of {features.length}
              </p>
            </motion.div>
          )}

          {/* Completion Screen */}
          {currentStep > features.length && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <CheckCircle className="w-24 h-24 text-green-400 mx-auto mb-6" />
              </motion.div>

              <h2 className="text-4xl font-bold text-white mb-4">You're All Set!</h2>

              <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
                Start exploring SAGRI and transform your farming experience with AI-powered insights
              </p>

              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">98% Accuracy</p>
                  <p className="text-xs text-green-200">Disease Detection</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">10K+ Farmers</p>
                  <p className="text-xs text-green-200">Active Community</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-sm text-white font-medium">30% More Profit</p>
                  <p className="text-xs text-green-200">Average Increase</p>
                </div>
              </div>

              <button
                onClick={handleComplete}
                className="px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-2xl flex items-center gap-2 mx-auto group"
              >
                Enter Dashboard
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}