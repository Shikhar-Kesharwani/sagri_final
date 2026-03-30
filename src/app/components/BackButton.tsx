import { useNavigate } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'motion/react';

interface BackButtonProps {
  label?: string;
  to?: string;
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

export function BackButton({ label = 'Back', to, className = '', variant = 'default' }: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else {
      navigate(-1);
    }
  };

  const variantStyles = {
    default: 'bg-white/80 dark:bg-stone-800/80 text-stone-900 dark:text-white hover:bg-white dark:hover:bg-stone-800',
    light: 'bg-white/90 text-stone-900 hover:bg-white',
    dark: 'bg-stone-900/90 text-white hover:bg-stone-900',
  };

  return (
    <motion.button
      onClick={handleClick}
      whileHover={{ scale: 1.05, x: -5 }}
      whileTap={{ scale: 0.95 }}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-sm
        border border-stone-200 dark:border-stone-700
        transition-all shadow-lg hover:shadow-xl
        ${variantStyles[variant]}
        ${className}
      `}
    >
      <ArrowLeft className="w-5 h-5" />
      <span className="font-medium">{label}</span>
    </motion.button>
  );
}
