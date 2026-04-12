import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Lock, EyeOff, Eye, Loader2, ArrowRight } from 'lucide-react';
import { useAuth } from '../components/AuthProvider';
import { supabase } from '../lib/supabase';
import { Logo } from '../components/Logo';

export function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(true);

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Supabase will automatically pick up the access token from the URL hash
    // and establish a session when coming from a reset link.
    const checkSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        setIsSessionValid(false);
      }
    };
    
    // Give it a small delay to handle the hash parsing
    setTimeout(checkSession, 500);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPass) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      if (updatePassword) {
        await updatePassword(password);
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to securely update password. The link might be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div key={i} className="absolute w-2 h-2 bg-white/20 rounded-full"
            animate={{ 
              y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth]
            }}
            transition={{ duration: 30 + Math.random() * 20, repeat: Infinity, ease: 'linear' }}
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
          />
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 relative z-10 w-full">
        
        <div className="text-center mb-8">
          <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="w-16 h-16 mx-auto mb-4">
            <Logo />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Set New Password</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Please securely enter your new password below</p>
        </div>

        {!isSessionValid ? (
          <div className="text-center space-y-6">
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-xl text-sm font-medium">
              Invalid or expired reset link. Please generate a new one from the login screen.
            </div>
            <button type="button" onClick={() => navigate('/')} className="w-full text-green-600 hover:underline font-semibold">
              Return Home
            </button>
          </div>
        ) : isSuccess ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto text-green-600">
              <Lock className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Password Updated!</h3>
            <p className="text-gray-500 dark:text-gray-400">Redirecting to login...</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 6 characters" autoFocus
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

            {error && <p className="text-red-500 text-sm text-center font-medium bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900">{error}</p>}

            <motion.button type="submit" disabled={isLoading || password.length < 6 || password !== confirmPass}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2 mt-4">
              {isLoading ? <><Loader2 className="w-5 h-5 animate-spin" /> Updating...</> : <>Update Password <ArrowRight className="w-5 h-5" /></>}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
