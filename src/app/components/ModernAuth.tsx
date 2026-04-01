import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Phone, 
  ArrowRight, 
  CheckCircle, 
  Sparkles,
  Leaf,
  TrendingUp,
  Shield,
  Users,
  ChevronRight,
  MapPin,
  Home,
  Wheat
} from 'lucide-react';
import { useAuth, UserRole } from './AuthProvider';
import { useNavigate } from 'react-router';
import { WelcomeOverview } from './WelcomeOverview';
import { Logo } from './Logo';

interface ModernAuthProps {
  isOpen: boolean;
  onClose?: () => void;
}

// Indian states
const INDIAN_STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Telangana', 'West Bengal', 'Bihar', 'Odisha', 'Chhattisgarh',
  'Jharkhand', 'Assam', 'Kerala', 'Himachal Pradesh', 'Uttarakhand'
];

// Crops
const CROP_TYPES = [
  { id: 'wheat', name: 'Wheat (गेहूं)' },
  { id: 'rice', name: 'Rice (धान)' },
  { id: 'cotton', name: 'Cotton (कपास)' },
  { id: 'sugarcane', name: 'Sugarcane (गन्ना)' },
  { id: 'maize', name: 'Maize (मक्का)' },
  { id: 'pulses', name: 'Pulses (दालें)' },
  { id: 'soybean', name: 'Soybean (सोयाबीन)' },
  { id: 'groundnut', name: 'Groundnut (मूंगफली)' },
  { id: 'bajra', name: 'Bajra (बाजरा)' },
  { id: 'jowar', name: 'Jowar (ज्वार)' },
  { id: 'mustard', name: 'Mustard (सरसों)' },
  { id: 'barley', name: 'Barley (जौ)' },
  { id: 'vegetables', name: 'Vegetables (सब्जियां)' },
  { id: 'fruits', name: 'Fruits (फल)' }
];

export function ModernAuth({ isOpen, onClose }: ModernAuthProps) {
  const [step, setStep] = useState<'phone' | 'otp' | 'role' | 'details'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [landSize, setLandSize] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen && !showWelcome) return null;

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length === 10) {
      setStep('otp');
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      setStep('role');
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && role && state && district && village && pincode && landSize && primaryCrop) {
      setError('');
      try {
        // Phone/OTP flow registers a new user — use signup, not login
        await signup(phone, '', name, role, phone, state, district, village, pincode, landSize, primaryCrop);
        setShowWelcome(true);
      } catch (error: any) {
        console.error('Login failed:', error);
        setError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    // Use actual user role from AuthProvider, not local form state (which is null on sign-in)
    const actualRole = user?.role || role;
    navigate(actualRole === 'farmer' ? '/farmer' : '/admin');
  };

  if (showWelcome) {
    return <WelcomeOverview isOpen={showWelcome} onComplete={handleWelcomeComplete} userName={name} />;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 20 + Math.random() * 10,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
              }}
            />
          ))}
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          
          {/* Left Side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:block text-white space-y-6"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="w-24 h-24 mb-8"
            >
              <Logo />
            </motion.div>

            <h1 className="text-5xl font-bold mb-4">
              SAGRI
              <span className="block text-2xl font-normal text-green-200 mt-2">
                Krishi Shayak 🌾
              </span>
            </h1>

            <p className="text-xl text-green-100 leading-relaxed">
              Your Intelligent Farming Assistant powered by AI
            </p>

            <div className="space-y-4 pt-8">
              {[
                { icon: <Leaf className="w-6 h-6" />, text: 'AI-Powered Crop Disease Detection' },
                { icon: <TrendingUp className="w-6 h-6" />, text: 'Smart Price Forecasting' },
                { icon: <Shield className="w-6 h-6" />, text: 'Risk Prediction & Alerts' },
                { icon: <Users className="w-6 h-6" />, text: 'Expert Connect 24/7' },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 + index * 0.1 }}
                  className="flex items-center gap-3 text-green-100"
                >
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    {feature.icon}
                  </div>
                  <span>{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Side - Auth Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
              
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="w-16 h-16 mx-auto mb-4"
                >
                  <Logo />
                </motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SAGRI</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Krishi Shayak</p>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Phone Number */}
                {step === 'phone' && (
                  <motion.div
                    key="phone"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Welcome to SAGRI
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Your Intelligent Farming Assistant
                      </p>
                    </div>

                    <form onSubmit={handlePhoneSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Mobile Number
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="Enter 10-digit mobile number"
                            className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-lg transition-all"
                            maxLength={10}
                          />
                        </div>
                      </div>

                      <motion.button
                        type="submit"
                        disabled={phone.length !== 10}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        Send OTP
                        <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* Step 2: OTP */}
                {step === 'otp' && (
                  <motion.div
                    key="otp"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Phone className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Enter OTP
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Sent to +91 {phone}
                      </p>
                    </div>

                    <form onSubmit={handleOtpSubmit} className="space-y-6">
                      <div>
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter 6-digit OTP"
                          className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-3xl tracking-widest dark:bg-gray-700 dark:text-white transition-all"
                          maxLength={6}
                        />
                      </div>

                      <motion.button
                        type="submit"
                        disabled={otp.length !== 6}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                      >
                        Verify OTP
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>

                      <button
                        type="button"
                        onClick={() => setStep('phone')}
                        className="w-full text-green-600 dark:text-green-400 text-sm hover:underline"
                      >
                        Change Mobile Number
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Step 3: Role Selection */}
                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Select Your Role
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Choose how you'll use SAGRI
                      </p>
                    </div>

                    <div className="space-y-4">
                      <motion.button
                        onClick={() => handleRoleSelect('farmer')}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Wheat className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                              Farmer
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Access farming tools, AI insights, and expert guidance
                            </p>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                      </motion.button>

                      <motion.button
                        onClick={() => handleRoleSelect('admin')}
                        whileHover={{ scale: 1.02, x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group text-left"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                            <TrendingUp className="w-7 h-7 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                              Admin
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              View analytics, manage users, and monitor platform
                            </p>
                          </div>
                          <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Details Form */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="max-h-[70vh] overflow-y-auto pr-2"
                  >
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        Complete Your Profile
                      </h2>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Help us personalize your experience
                      </p>
                    </div>

                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      {/* Name */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your name"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>

                      {/* State */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        >
                          <option value="">Select a state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {/* District */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          District
                        </label>
                        <input
                          type="text"
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          placeholder="Enter your district"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>

                      {/* Village */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Village
                        </label>
                        <input
                          type="text"
                          value={village}
                          onChange={(e) => setVillage(e.target.value)}
                          placeholder="Enter your village"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>

                      {/* Pincode */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                          placeholder="Enter your pincode"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                          maxLength={6}
                        />
                      </div>

                      {/* Land Size */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Land Size (in acres)
                        </label>
                        <input
                          type="text"
                          value={landSize}
                          onChange={(e) => setLandSize(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter your land size"
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        />
                      </div>

                      {/* Primary Crop */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Primary Crop
                        </label>
                        <select
                          value={primaryCrop}
                          onChange={(e) => setPrimaryCrop(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all"
                        >
                          <option value="">Select a crop</option>
                          {CROP_TYPES.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm text-center">{error}</p>
                      )}

                      <motion.button
                        type="submit"
                        disabled={!name.trim() || !state || !district || !village || !pincode || !landSize || !primaryCrop}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 mt-6"
                      >
                        Complete Registration
                        <Sparkles className="w-5 h-5" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Progress Indicator */}
            <div className="mt-6 flex items-center justify-center gap-2">
              {['phone', 'otp', 'role', 'details'].map((s, index) => (
                <div
                  key={s}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    ['phone', 'otp', 'role', 'details'].indexOf(step) >= index
                      ? 'w-8 bg-green-500'
                      : 'w-1 bg-white/30'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}