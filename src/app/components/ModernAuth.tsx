import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import emailjs from '@emailjs/browser';
import {
  Mail, ArrowRight, CheckCircle, Sparkles, Leaf,
  TrendingUp, Shield, Users, ChevronRight, Wheat, Loader2,
  Lock, Eye, EyeOff, UserPlus, LogIn,
} from 'lucide-react';
import { useAuth, UserRole } from './AuthProvider';
import { useNavigate } from 'react-router';
import { WelcomeOverview } from './WelcomeOverview';
import { Logo } from './Logo';
import { supabase } from '../lib/supabase';
import { auth as firebaseAuth } from '../lib/firebase';
import { RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';

const EMAILJS_SERVICE_ID  = 'service_zlm6dfd';
const EMAILJS_TEMPLATE_ID = 'template_gkmqa1l';
const EMAILJS_PUBLIC_KEY  = 'buGEM--HOcsCraah1';
const BACKEND_URL         = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const INDIAN_STATES = [
  'Punjab','Haryana','Uttar Pradesh','Madhya Pradesh','Rajasthan',
  'Maharashtra','Gujarat','Karnataka','Tamil Nadu','Andhra Pradesh',
  'Telangana','West Bengal','Bihar','Odisha','Chhattisgarh',
  'Jharkhand','Assam','Kerala','Himachal Pradesh','Uttarakhand',
];
const CROP_TYPES = [
  { id: 'wheat', name: 'Wheat (गेहूं)' }, { id: 'rice', name: 'Rice (धान)' },
  { id: 'cotton', name: 'Cotton (कपास)' }, { id: 'sugarcane', name: 'Sugarcane (गन्ना)' },
  { id: 'maize', name: 'Maize (मक्का)' }, { id: 'pulses', name: 'Pulses (दालें)' },
  { id: 'soybean', name: 'Soybean (सोयाबीन)' }, { id: 'groundnut', name: 'Groundnut (मूंगफली)' },
  { id: 'bajra', name: 'Bajra (बाजरा)' }, { id: 'jowar', name: 'Jowar (ज्वार)' },
  { id: 'mustard', name: 'Mustard (सरसों)' }, { id: 'barley', name: 'Barley (जौ)' },
  { id: 'vegetables', name: 'Vegetables (सब्जियां)' }, { id: 'fruits', name: 'Fruits (फल)' },
];

type SignupStep = 'email' | 'otp' | 'setpassword' | 'role' | 'details';
interface ModernAuthProps { isOpen: boolean; onClose?: () => void; }

export function ModernAuth({ isOpen, onClose }: ModernAuthProps) {
  // ── All state ── (hooks must be at the very top, no exceptions)
  const [authTab,     setAuthTab]     = useState<'signup' | 'login' | 'forgot_password'>('signup');
  const [step,        setStep]        = useState<SignupStep>('email');
  const [authMethod,  setAuthMethod]  = useState<'email' | 'phone'>('phone');
  const [phone,       setPhone]       = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isMockPhone, setIsMockPhone] = useState(false);
  const [email,       setEmail]       = useState('');
  const [otp,         setOtp]         = useState('');
  const [password,    setPassword]    = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role,        setRole]        = useState<UserRole>(null);
  const [name,        setName]        = useState('');
  const [state,       setState]       = useState('');
  const [district,    setDistrict]    = useState('');
  const [village,     setVillage]     = useState('');
  const [pincode,     setPincode]     = useState('');
  const [landSize,    setLandSize]    = useState('');
  const [primaryCrop, setPrimaryCrop] = useState('');
  const [loginEmail,  setLoginEmail]  = useState('');
  const [loginPass,   setLoginPass]   = useState('');
  const [showLoginPass, setShowLoginPass] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [error,       setError]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [timer,       setTimer]       = useState(30);

  const { login, signup, user, resetPassword } = useAuth();
  const navigate = useNavigate();

  // ── ALL useEffects MUST be here, before any conditional return ──
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => setTimer(p => p - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Redirect returning user after login() sets user state
  useEffect(() => {
    if (user && isOpen && authTab === 'login') {
      navigate(user.role === 'admin' ? '/admin' : '/farmer');
    }
  }, [user, isOpen, authTab, navigate]);

  // ── Early returns AFTER all hooks ──
  if (!isOpen && !showWelcome) return null;

  if (showWelcome) {
    return (
      <WelcomeOverview
        isOpen={showWelcome}
        onComplete={() => {
          setShowWelcome(false);
          navigate(user?.role === 'admin' ? '/admin' : '/farmer');
        }}
        userName={name}
      />
    );
  }

  // ── Helper: switch tabs ──
  const switchTab = (tab: 'signup' | 'login' | 'forgot_password') => {
    setAuthTab(tab); setError('');
    setStep('email'); setOtp(''); setPassword(''); setConfirmPass('');
    setForgotEmail(''); setForgotSuccess(false);
  };

  // ══════════════════════════════════════════════════════════════════════
  // SIGNUP HANDLERS
  // ══════════════════════════════════════════════════════════════════════

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(firebaseAuth, 'recaptcha-container', { size: 'invisible' });
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setError('');
    try {
      if (authMethod === 'email') {
        if (!email.includes('@') || !email.includes('.')) { setError('Enter a valid email address'); setIsLoading(false); return; }
        const { data: existData } = await supabase.from('registered_emails').select('email').eq('email', email.toLowerCase()).maybeSingle();
        if (existData) { setError('⚠️ This email is already registered. Please use the Login tab to sign in.'); setIsLoading(false); return; }
        const res  = await fetch(`${BACKEND_URL}/api/send-email-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to generate OTP');
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: email, otp: data.otp }, EMAILJS_PUBLIC_KEY);
        setTimer(30); setStep('otp');
      } else {
        if (phone.length !== 10) { setError('Enter a valid 10-digit mobile number'); setIsLoading(false); return; }
        
        // ── PRESENTATION SIMULATION MODE ──
        // Bypasses Firebase entirely for ALL phone numbers so your presentation is 100% free & flawless
        setIsMockPhone(true);
        setTimer(30); 
        setStep('otp');
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.error("Firebase SMS Error:", err);
      setError(`RAW ERROR: ${err.code} - ${err.message}`);
      if (authMethod === 'phone' && (window as any).recaptchaVerifier) { (window as any).recaptchaVerifier.clear(); (window as any).recaptchaVerifier = undefined; }
    } finally { setIsLoading(false); }
  };

  const handleResendOtp = async () => {
    setOtp(''); setIsLoading(true); setError('');
    try {
      if (authMethod === 'email') {
        const res  = await fetch(`${BACKEND_URL}/api/send-email-otp`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Failed to resend OTP');
        await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { to_email: email, otp: data.otp }, EMAILJS_PUBLIC_KEY);
      } else {
        // ── PRESENTATION SIMULATION MODE ──
        setIsMockPhone(true);
      }
      setTimer(30);
    } catch (err: any) {
      setError(err.message || 'Could not resend OTP.');
      if (authMethod === 'phone' && (window as any).recaptchaVerifier) { (window as any).recaptchaVerifier.clear(); (window as any).recaptchaVerifier = undefined; }
    } finally { setIsLoading(false); }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setIsLoading(true); setError('');
    try {
      if (authMethod === 'email') {
        const res  = await fetch(`${BACKEND_URL}/api/verify-email-otp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ identifier: email, otp }) });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || 'Invalid OTP');
        setStep('setpassword');
      } else {
        // Handle Phone OTP Verification
        if (isMockPhone) {
          if (otp !== '123456') throw new Error('Invalid OTP. Use 123456 for the test number.');
        } else {
          if (!confirmationResult) throw new Error('Session expired. Please request OTP again.');
          await confirmationResult.confirm(otp);
        }

        // Once phone is verified, route based on tab
        if (authTab === 'login') {
          const pseudoEmail = `${phone}@sagri.app`;
          const pseudoPassword = `Sagri${phone}!!`;
          try {
            await login(pseudoEmail, pseudoPassword);
            // Successful login handles navigation via useEffect
          } catch (err: any) {
            throw new Error('Account not found. Please register as a New User first.');
          }
        } else {
          setStep('role'); // Continue signup
        }
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    if (password !== confirmPass) { setError('Passwords do not match'); return; }
    setError(''); setStep('role');
  };

  const handleRoleSelect = (selectedRole: UserRole) => { setRole(selectedRole); setStep('details'); };

  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !role || !state || !district || !village || !pincode || !landSize || !primaryCrop) return;
    setIsLoading(true); setError('');
    try {
      if (authMethod === 'email') {
        await signup(email, password, name, role, undefined, state, district, village, pincode, landSize, primaryCrop);
        await supabase.from('registered_emails').insert([{ email: email.toLowerCase() }]);
      } else {
        const pseudoEmail = `${phone}@sagri.app`;
        const pseudoPassword = `Sagri${phone}!!`;
        await signup(pseudoEmail, pseudoPassword, name, role, phone, state, district, village, pincode, landSize, primaryCrop);
        await supabase.from('registered_emails').insert([{ email: pseudoEmail.toLowerCase() }]);
      }
      setShowWelcome(true);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally { setIsLoading(false); }
  };

  // ══════════════════════════════════════════════════════════════════════
  // LOGIN & FORGOT PASSWORD HANDLERS
  // ══════════════════════════════════════════════════════════════════════
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPass) { setError('Please enter your email and password'); return; }
    setIsLoading(true); setError('');
    try {
      await login(loginEmail, loginPass);
      // user state update triggers the useEffect above which navigates
    } catch (err: any) {
      setError(err.message || 'Invalid email or password. Please try again.');
    } finally { setIsLoading(false); }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) { setError('Please enter your email'); return; }
    setIsLoading(true); setError('');
    try {
      if (resetPassword) {
        await resetPassword(forgotEmail);
        setForgotSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    } finally { setIsLoading(false); }
  };

  const signupSteps: SignupStep[] = ['email', 'otp', 'setpassword', 'role', 'details'];
  const currentStepIndex = signupSteps.indexOf(step);

  // ══════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full"
              animate={{ x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth], y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight] }}
              transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, ease: 'linear' }}
              style={{ left: Math.random() * 100 + '%', top: Math.random() * 100 + '%' }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-400/20 via-transparent to-transparent" />
      </div>

      <div className="relative h-full flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Branding */}
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="hidden lg:block text-white space-y-6">
            <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="w-24 h-24 mb-8"><Logo /></motion.div>
            <h1 className="text-5xl font-bold mb-4">SAGRI
              <span className="block text-2xl font-normal text-green-200 mt-2">Krishi Shayak 🌾</span>
            </h1>
            <p className="text-xl text-green-100 leading-relaxed">Your Intelligent Farming Assistant powered by AI</p>
            <div className="space-y-4 pt-8">
              {[
                { icon: <Leaf className="w-6 h-6" />, text: 'AI-Powered Crop Disease Detection' },
                { icon: <TrendingUp className="w-6 h-6" />, text: 'Smart Price Forecasting' },
                { icon: <Shield className="w-6 h-6" />, text: 'Risk Prediction & Alerts' },
                { icon: <Users className="w-6 h-6" />, text: 'Expert Connect 24/7' },
              ].map((f, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.1 }} className="flex items-center gap-3 text-green-100">
                  <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center backdrop-blur-sm">{f.icon}</div>
                  <span>{f.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Auth Card */}
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }} className="w-full">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">

              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-6">
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 mx-auto mb-4"><Logo /></motion.div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SAGRI</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Krishi Shayak</p>
              </div>

              {/* New User / Login Toggle */}
              <div className="flex rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 mb-8">
                <button type="button" onClick={() => switchTab('signup')}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${authTab === 'signup' ? 'bg-green-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <UserPlus className="w-4 h-4" /> New User
                </button>
                <button type="button" onClick={() => switchTab('login')}
                  className={`flex-1 py-3 flex items-center justify-center gap-2 text-sm font-semibold transition-all ${authTab === 'login' ? 'bg-green-500 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                  <LogIn className="w-4 h-4" /> Login
                </button>
              </div>

              <AnimatePresence mode="wait">

                {/* ── LOGIN ── */}
                {authTab === 'login' && step === 'email' && (
                  <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome Back!</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Login to your account</p>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                      <button type="button" onClick={() => setAuthMethod('phone')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>Phone Number</button>
                      <button type="button" onClick={() => setAuthMethod('email')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>Email Address</button>
                    </div>

                    <form onSubmit={authMethod === 'email' ? handleLogin : handleSendOtp} className="space-y-5">
                      {authMethod === 'email' ? (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                            <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input type="email" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} placeholder="Enter your registered email"
                                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Password</label>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                              <input type={showLoginPass ? 'text' : 'password'} value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Enter your password"
                                className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                              <button type="button" onClick={() => setShowLoginPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {showLoginPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                            <div className="flex justify-end mt-2">
                              <button type="button" onClick={() => switchTab('forgot_password')} className="text-sm text-green-600 hover:underline">Forgot Password?</button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500 dark:text-gray-400">+91</span>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210"
                              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                          </div>
                        </div>
                      )}
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <div id="recaptcha-container" className="flex justify-center mt-2"></div>
                      <motion.button type="submit" disabled={isLoading || (authMethod === 'email' ? (!loginEmail || !loginPass) : phone.length !== 10)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> {authMethod === 'email' ? 'Logging in...' : 'Sending OTP...'}</> : <>{authMethod === 'email' ? 'Login' : 'Send OTP'} <ArrowRight className="w-5 h-5" /></>}
                      </motion.button>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Don't have an account?{' '}
                        <button type="button" onClick={() => switchTab('signup')} className="text-green-600 font-semibold hover:underline">Register here</button>
                      </p>
                    </form>
                  </motion.div>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {authTab === 'forgot_password' && (
                  <motion.div key="forgot" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">We'll send a reset link to your email</p>
                    </div>
                    {forgotSuccess ? (
                      <div className="text-center space-y-6">
                        <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-xl">
                          Password reset link has been sent! Please check your email.
                        </div>
                        <button type="button" onClick={() => switchTab('login')}
                          className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-4 rounded-xl font-semibold transition-all">
                          Return to Login
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleForgotPassword} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="Enter your registered email"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                          </div>
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <motion.button type="submit" disabled={isLoading || !forgotEmail}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
                          {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending...</> : <>Send Reset Link <ArrowRight className="w-5 h-5" /></>}
                        </motion.button>
                        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                          Remembered your password?{' '}
                          <button type="button" onClick={() => switchTab('login')} className="text-green-600 font-semibold hover:underline">Login here</button>
                        </p>
                      </form>
                    )}
                  </motion.div>
                )}

                {/* ── SIGNUP: step email/phone ── */}
                {authTab === 'signup' && step === 'email' && (
                  <motion.div key="signup-email" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Join the SAGRI community</p>
                    </div>

                    <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl mb-6">
                      <button type="button" onClick={() => setAuthMethod('phone')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'phone' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>Phone Number</button>
                      <button type="button" onClick={() => setAuthMethod('email')} className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${authMethod === 'email' ? 'bg-white dark:bg-gray-700 shadow text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>Email Address</button>
                    </div>

                    <form onSubmit={handleSendOtp} className="space-y-5">
                      {authMethod === 'email' ? (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email address"
                              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Mobile Number</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-medium text-gray-500 dark:text-gray-400">+91</span>
                            <input type="tel" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="98765 43210"
                              className="w-full pl-14 pr-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white text-base transition-all" />
                          </div>
                        </div>
                      )}
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <div id="recaptcha-container" className="flex justify-center mt-2"></div>
                      <motion.button type="submit" disabled={isLoading || (authMethod === 'email' ? !email.includes('@') : phone.length !== 10)}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="w-5 h-5" /></>}
                      </motion.button>
                      <p className="text-center text-sm text-gray-500 dark:text-gray-400">
                        Already have an account?{' '}
                        <button type="button" onClick={() => switchTab('login')} className="text-green-600 font-semibold hover:underline">Login here</button>
                      </p>
                    </form>
                  </motion.div>
                )}

                {/* ── OTP VERIFICATION (Used for both Signup and Login) ── */}
                {(authTab === 'signup' || authTab === 'login') && step === 'otp' && (
                  <motion.div key="signup-otp" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Verify {authMethod === 'email' ? 'Email' : 'Mobile'}</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">OTP sent to <span className="font-semibold text-green-600">{authMethod === 'email' ? email : `+91 ${phone}`}</span></p>
                    </div>
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                      <input type="text" inputMode="numeric" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g,'').slice(0,6))}
                        placeholder="• • • • • •" autoFocus maxLength={6}
                        className="w-full px-4 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-center text-3xl tracking-widest dark:bg-gray-700 dark:text-white transition-all" />
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <motion.button type="submit" disabled={isLoading || otp.length !== 6}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : <>Verify OTP <CheckCircle className="w-5 h-5" /></>}
                      </motion.button>
                      <div className="text-center space-y-2">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {timer > 0 ? `Resend OTP in ${timer}s` : <button type="button" onClick={authMethod === 'email' ? handleResendOtp : handleSendOtp} className="text-green-600 font-semibold hover:underline">Resend OTP</button>}
                        </p>
                        <button type="button" onClick={() => { setStep('email'); setOtp(''); setError(''); }} className="text-gray-500 text-sm hover:underline">
                          ← Change {authMethod === 'email' ? 'Email Address' : 'Mobile Number'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {/* ── SIGNUP: step setpassword ── */}
                {authTab === 'signup' && step === 'setpassword' && (
                  <motion.div key="signup-password" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Set Password</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Create a password you'll use to login next time</p>
                    </div>
                    <form onSubmit={handleSetPassword} className="space-y-5">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters"
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all" />
                          <button type="button" onClick={() => setShowPass(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input type={showConfirm ? 'text' : 'password'} value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="Re-enter your password"
                            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all" />
                          <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                            {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <motion.button type="submit" disabled={password.length < 6 || password !== confirmPass}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2">
                        Continue <ArrowRight className="w-5 h-5" />
                      </motion.button>
                    </form>
                  </motion.div>
                )}

                {/* ── SIGNUP: step role ── */}
                {authTab === 'signup' && step === 'role' && (
                  <motion.div key="signup-role" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <div className="text-center mb-8">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                      </div>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Select Your Role</h2>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Choose how you'll use SAGRI</p>
                    </div>
                    <div className="space-y-4">
                      {[
                        { r: 'farmer' as UserRole, label: 'Farmer', desc: 'Access farming tools, AI insights, and expert guidance', icon: <Wheat className="w-7 h-7 text-white" />, grad: 'from-green-500 to-emerald-600' },
                        { r: 'admin'  as UserRole, label: 'Admin',  desc: 'View analytics, manage users, and monitor platform',     icon: <TrendingUp className="w-7 h-7 text-white" />, grad: 'from-blue-500 to-cyan-600' },
                      ].map(item => (
                        <motion.button key={String(item.r)} onClick={() => handleRoleSelect(item.r)}
                          whileHover={{ scale: 1.02, x: 5 }} whileTap={{ scale: 0.98 }}
                          className="w-full p-6 border-2 border-gray-200 dark:border-gray-600 rounded-2xl hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all group text-left">
                          <div className="flex items-center gap-4">
                            <div className={`w-14 h-14 bg-gradient-to-br ${item.grad} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>{item.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">{item.label}</h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                            </div>
                            <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-green-500 transition-colors" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* ── SIGNUP: step details ── */}
                {authTab === 'signup' && step === 'details' && (
                  <motion.div key="signup-details" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                    className="max-h-[65vh] overflow-y-auto pr-2">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Complete Your Profile</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Help us personalize your SAGRI experience</p>
                    </div>
                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      {[
                        { label: 'Your Name',          val: name,     set: setName,     ph: 'Enter your full name' },
                        { label: 'District',           val: district, set: setDistrict, ph: 'Enter your district' },
                        { label: 'Village',            val: village,  set: setVillage,  ph: 'Enter your village' },
                        { label: 'Pincode',            val: pincode,  set: (v: string) => setPincode(v.replace(/\D/g,'').slice(0,6)), ph: '6-digit pincode' },
                        { label: 'Land Size (acres)',  val: landSize, set: (v: string) => setLandSize(v.replace(/\D/g,'')), ph: 'Size in acres' },
                      ].map(f => (
                        <div key={f.label}>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{f.label}</label>
                          <input type="text" value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                            className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all" />
                        </div>
                      ))}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">State</label>
                        <select value={state} onChange={e => setState(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all">
                          <option value="">Select a state</option>
                          {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Primary Crop</label>
                        <select value={primaryCrop} onChange={e => setPrimaryCrop(e.target.value)}
                          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:text-white transition-all">
                          <option value="">Select a crop</option>
                          {CROP_TYPES.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                      <motion.button type="submit"
                        disabled={isLoading || !name.trim() || !state || !district || !village || !pincode || !landSize || !primaryCrop}
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
                        {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Registering...</> : <>Complete Registration <Sparkles className="w-5 h-5" /></>}
                      </motion.button>
                    </form>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Progress dots — signup only */}
              {authTab === 'signup' && (
                <div className="mt-6 flex items-center justify-center gap-2">
                  {signupSteps.map((s, i) => (
                    <div key={s} className={`h-1.5 rounded-full transition-all duration-300 ${currentStepIndex >= i ? 'w-8 bg-green-500' : 'w-2 bg-gray-300 dark:bg-gray-600'}`} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}