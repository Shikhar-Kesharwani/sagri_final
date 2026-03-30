import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { Home, LayoutDashboard, TrendingUp, Users, Settings } from 'lucide-react';
import { useAuth } from './AuthProvider';

export function BottomNav() {
  const location = useLocation();
  const { user, loading } = useAuth();

  // Don't show bottom nav while loading or when user is not authenticated
  if (loading || !user) return null;

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: 'Home',
    },
    {
      path: user.role === 'farmer' ? '/farmer' : '/admin',
      icon: LayoutDashboard,
      label: 'Dashboard',
    },
    {
      path: '/market-price',
      icon: TrendingUp,
      label: 'Market',
    },
    {
      path: '/community',
      icon: Users,
      label: 'Community',
    },
  ];

  return (
    <motion.nav
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-t border-stone-200 dark:border-stone-700 px-4 pb-safe"
    >
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center gap-1 min-w-[60px]"
              >
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={`relative p-2 rounded-2xl transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-green-600 rounded-2xl -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </motion.div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-stone-600 dark:text-stone-400'
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </motion.nav>
  );
}