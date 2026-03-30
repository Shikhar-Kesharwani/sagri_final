import { Link, useNavigate } from 'react-router';
import { Sprout, Moon, Sun, LogOut, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { useAuth } from './AuthProvider';
import { useLanguage } from '../contexts/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 dark:bg-stone-900/70 backdrop-blur-xl border-b border-stone-200/50 dark:border-stone-700/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 10 }}
              className="w-11 h-11 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg"
            >
              <Sprout className="w-6 h-6 text-white" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                SAGRI
              </h1>
              <p className="text-xs text-stone-600 dark:text-stone-400 -mt-0.5">
                Krishi Shayak
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {user && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700/30"
              >
                <span className="text-sm font-medium text-stone-700 dark:text-stone-300">{user.name}</span>
                {user.points !== undefined && (
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-600 text-white px-3 py-1 rounded-full font-semibold shadow-md">
                    {user.points} pts
                  </span>
                )}
              </motion.div>
            )}

            <div className="flex items-center gap-2">
              <LanguageSelector />

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                title="Toggle theme"
              >
                {theme === 'light' ? (
                  <Moon className="w-5 h-5 text-stone-600 dark:text-stone-400" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-400" />
                )}
              </motion.button>

              {user && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  {t('common.logout')}
                </motion.button>
              )}
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-stone-600 dark:text-stone-400" />
            ) : (
              <Menu className="w-6 h-6 text-stone-600 dark:text-stone-400" />
            )}
          </motion.button>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 border-t border-stone-200 dark:border-stone-700">
                <div className="space-y-3">
                  {user && (
                    <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-xl">
                      <p className="text-sm font-medium text-stone-700 dark:text-stone-300">{user.name}</p>
                      {user.points !== undefined && (
                        <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-semibold">
                          Points: {user.points}
                        </p>
                      )}
                    </div>
                  )}
                  
                  <LanguageSelector />

                  <button
                    onClick={toggleTheme}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                  >
                    {theme === 'light' ? (
                      <>
                        <Moon className="w-5 h-5" />
                        <span>Dark Mode</span>
                      </>
                    ) : (
                      <>
                        <Sun className="w-5 h-5 text-amber-400" />
                        <span>Light Mode</span>
                      </>
                    )}
                  </button>

                  {user && (
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('common.logout')}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}