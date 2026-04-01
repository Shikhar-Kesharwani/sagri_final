import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail,
  Lock,
  ArrowRight,
  Leaf,
  TrendingUp,
  Shield,
  Users,
  MapPin,
  Phone,
  Wheat,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import { useAuth, UserRole } from './AuthProvider';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router';
import { WelcomeOverview } from './WelcomeOverview';
import { Logo } from './Logo';
import { BackButton } from './BackButton';

interface EmailAuthProps {
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

export function EmailAuth({ isOpen, onClose }: EmailAuthProps) {
  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>('signin');
  const [step, setStep] = useState<'auth' | 'role' | 'details'>('auth');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>(null);
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [pincode, setPincode] = useState('');
  const [landSize, setLandSize] = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();

  if (!isOpen && !showWelcome) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        // Sign in - direct login
        await login(email, password);
        setShowWelcome(true);
      } else {
        // Sign up - continue to role selection
        if (!name) {
          setError('Please enter your name');
          return;
        }
        setStep('role');
      }
    } catch (error: any) {
      console.error('Auth failed:', error);
      setError(error.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep('details');
  };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !state) {
      setError('Please fill in all required fields');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await signup(
        email,
        password,
        name,
        role,
        phone,
        state,
        district,
        village,
        pincode,
        landSize,
        primaryCrop
      );
      setShowWelcome(true);
    } catch (error: any) {
      console.error('Signup failed:', error);
      setError(error.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeComplete = async () => {
    setShowWelcome(false);
    if (onClose) onClose();
    // Triple-safe role resolution:
    // 1. Use AuthProvider user (fetched from profiles DB)
    // 2. Fall back to Supabase session user_metadata (stored in JWT)
    // 3. Default to 'farmer' if nothing found
    let resolvedRole: string = user?.role || role || '';
    if (!resolvedRole) {
      const { data: { session } } = await supabase.auth.getSession();
      resolvedRole = session?.user?.user_metadata?.role || 'farmer';
    }
    navigate(resolvedRole === 'farmer' ? '/farmer' : '/admin');
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
                x: [Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000)],
                y: [Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000), Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000)],
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
      <div className="relative h-full flex items-center justify-center p-4 overflow-y-auto">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center my-8">
          
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
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 max-h-[90vh] overflow-y-auto">
              
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
                {/* Step 1: Email/Password Auth */}
                {step === 'auth' && mode !== 'forgot' && (
                  <motion.div
                    key={mode === 'signin' ? 'signin' : 'signup'}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {mode === 'signin' ? 'Welcome Back' : 'Get Started'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        {mode === 'signin' ? 'Sign in to your account' : 'Create your SAGRI account'}
                      </p>
                    </div>

                    <form onSubmit={handleAuthSubmit} className="space-y-6">
                      {mode === 'signup' && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your full name"
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className="w-full pl-12 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            required
                            minLength={8}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                          >
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {mode === 'signup' && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            Minimum 8 characters
                          </p>
                        )}
                      </div>

                      {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Please wait...' : mode === 'signin' ? 'Sign In' : 'Continue'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>

                      {mode === 'signin' && (
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setMode('forgot');
                              setError('');
                              setResetEmailSent(false);
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 text-sm hover:underline"
                          >
                            Forgot password?
                          </button>
                        </div>
                      )}

                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setMode(mode === 'signin' ? 'signup' : 'signin');
                            setError('');
                          }}
                          className="text-green-600 dark:text-green-400 hover:underline text-sm"
                        >
                          {mode === 'signin' ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* Forgot Password Screen */}
                {step === 'auth' && mode === 'forgot' && (
                  <motion.div
                    key="forgot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Reset Password
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Enter your email to receive password reset instructions
                      </p>
                    </div>

                    {!resetEmailSent ? (
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        setError('');
                        setLoading(true);

                        try {
                          // In production, this would call Supabase resetPasswordForEmail
                          // For now, we'll simulate the process
                          await new Promise(resolve => setTimeout(resolve, 1000));
                          setResetEmailSent(true);
                        } catch (error: any) {
                          console.error('Password reset failed:', error);
                          setError(error.message || 'Failed to send reset email. Please try again.');
                        } finally {
                          setLoading(false);
                        }
                      }} className="space-y-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Enter your email"
                              className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                              required
                            />
                          </div>
                        </div>

                        {error && (
                          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                            {error}
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? 'Sending...' : 'Send Reset Link'}
                          {!loading && <ArrowRight className="w-5 h-5" />}
                        </button>

                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => {
                              setMode('signin');
                              setError('');
                            }}
                            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                          >
                            ← Back to sign in
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="p-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                              <Mail className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              Check Your Email
                            </h3>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 mb-2">
                            We've sent password reset instructions to:
                          </p>
                          <p className="font-semibold text-gray-900 dark:text-white mb-4">
                            {email}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Please check your inbox and click the reset link. The link will expire in 1 hour.
                          </p>
                        </div>

                        <button
                          onClick={() => {
                            setMode('signin');
                            setResetEmailSent(false);
                            setError('');
                          }}
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                        >
                          Back to Sign In
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Step 2: Role Selection (signup only) */}
                {step === 'role' && (
                  <motion.div
                    key="role"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Choose Your Role
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        How do you want to use SAGRI?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <button
                        onClick={() => handleRoleSelect('farmer')}
                        className="w-full p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl hover:border-green-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Leaf className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">I'm a Farmer</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Get AI-powered insights for your crops
                            </p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                      </button>

                      <button
                        onClick={() => handleRoleSelect('admin')}
                        className="w-full p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl hover:border-blue-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Shield className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">I'm an Administrator</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              Monitor and manage platform analytics
                            </p>
                          </div>
                          <ArrowRight className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                      </button>
                    </div>

                    <button
                      onClick={() => setStep('auth')}
                      className="mt-6 w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                    >
                      ← Back
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Additional Details (signup only, farmers) */}
                {step === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {role === 'farmer' ? 'Farm Details' : 'Complete Your Profile'}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400">
                        Help us personalize your experience
                      </p>
                    </div>

                    <form onSubmit={handleDetailsSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number (Optional)
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                            placeholder="10-digit mobile number"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          State *
                        </label>
                        <select
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                          required
                        >
                          <option value="">Select your state</option>
                          {INDIAN_STATES.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>

                      {role === 'farmer' && (
                        <>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                District
                              </label>
                              <input
                                type="text"
                                value={district}
                                onChange={(e) => setDistrict(e.target.value)}
                                placeholder="District"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Village
                              </label>
                              <input
                                type="text"
                                value={village}
                                onChange={(e) => setVillage(e.target.value)}
                                placeholder="Village"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Pincode
                              </label>
                              <input
                                type="text"
                                value={pincode}
                                onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="6-digit pincode"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Land Size (Acres)
                              </label>
                              <input
                                type="text"
                                value={landSize}
                                onChange={(e) => setLandSize(e.target.value)}
                                placeholder="e.g., 5 acres"
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              Primary Crop
                            </label>
                            <select
                              value={primaryCrop}
                              onChange={(e) => setPrimaryCrop(e.target.value)}
                              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white"
                            >
                              <option value="">Select primary crop</option>
                              {CROP_TYPES.map((crop) => (
                                <option key={crop.id} value={crop.id}>{crop.name}</option>
                              ))}
                            </select>
                          </div>
                        </>
                      )}

                      {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                          {error}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Creating account...' : 'Complete Sign Up'}
                        {!loading && <ArrowRight className="w-5 h-5" />}
                      </button>

                      <button
                        type="button"
                        onClick={() => setStep('role')}
                        className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm"
                      >
                        ← Back
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}