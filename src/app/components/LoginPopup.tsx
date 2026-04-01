import { useState } from 'react';
import { X, Phone, User, MapPin, Wheat } from 'lucide-react';
import { useAuth, UserRole } from './AuthProvider';
import { useNavigate } from 'react-router';
import { useLanguage } from '../contexts/LanguageContext';
import { motion, AnimatePresence } from 'motion/react';
import { WelcomeOverview } from './WelcomeOverview';

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

// Indian states with agricultural importance
const INDIAN_STATES = [
  'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Gujarat', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh',
  'Telangana', 'West Bengal', 'Bihar', 'Odisha', 'Chhattisgarh',
  'Jharkhand', 'Assam', 'Kerala', 'Himachal Pradesh', 'Uttarakhand'
];

// Major crops in India
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

export function LoginPopup({ isOpen, onClose }: LoginPopupProps) {
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
  const { t } = useLanguage();

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
        // Show welcome overview instead of immediately navigating
        setShowWelcome(true);
      } catch (error: any) {
        console.error('Login failed:', error);
        setError(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    onClose();
    // Use actual user role from AuthProvider, not local form state (null on sign-in)
    const actualRole = user?.role || role;
    navigate(actualRole === 'farmer' ? '/farmer' : '/admin');
  };

  // Show welcome overview
  if (showWelcome) {
    return <WelcomeOverview isOpen={showWelcome} onComplete={handleWelcomeComplete} userName={name} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to SAGRI
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Your Intelligent Farming Assistant</p>
          </div>

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    maxLength={10}
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={phone.length !== 10}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Send OTP
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter OTP
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-2xl tracking-widest dark:bg-gray-700 dark:text-white"
                  maxLength={6}
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                  OTP sent to +91 {phone}
                </p>
              </div>
              <button
                type="submit"
                disabled={otp.length !== 6}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Verify OTP
              </button>
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-green-600 dark:text-green-400 text-sm hover:underline"
              >
                Change Mobile Number
              </button>
            </form>
          )}

          {step === 'role' && (
            <div className="space-y-4">
              <p className="text-center text-gray-700 dark:text-gray-300 mb-6">Select your role</p>
              <button
                onClick={() => handleRoleSelect('farmer')}
                className="w-full p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">Farmer</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Access farming tools and insights</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => handleRoleSelect('admin')}
                className="w-full p-6 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-left">
                    <h3 className="font-medium text-gray-900 dark:text-white">Admin</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">View analytics and manage platform</p>
                  </div>
                </div>
              </button>
            </div>
          )}

          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  State
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  District
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter your district"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
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
                  placeholder="Enter your village"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter your pincode"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  maxLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Land Size (in acres)
                </label>
                <input
                  type="text"
                  value={landSize}
                  onChange={(e) => setLandSize(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter your land size"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Primary Crop
                </label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select a crop</option>
                  {CROP_TYPES.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                disabled={!name.trim() || !state || !district || !village || !pincode || !landSize || !primaryCrop}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-medium hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Complete Login
              </button>
              {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}