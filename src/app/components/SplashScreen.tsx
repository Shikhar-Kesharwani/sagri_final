import { motion } from 'motion/react';
import { Sprout, Sparkles } from 'lucide-react';

export function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-700 flex items-center justify-center z-[100]"
    >
      {/* Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: -50,
              opacity: 0.3 
            }}
            animate={{ 
              y: window.innerHeight + 50,
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{ 
              duration: Math.random() * 3 + 3,
              repeat: Infinity,
              delay: Math.random() * 2 
            }}
            className="absolute"
          >
            <Sprout className="w-6 h-6 text-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Container */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 0.8 
          }}
          className="mb-8"
        >
          <div className="relative">
            {/* Outer Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 -m-8"
            >
              <div className="w-full h-full border-4 border-white/20 rounded-full border-t-white/60" />
            </motion.div>

            {/* Inner Glow */}
            <motion.div
              animate={{ 
                boxShadow: [
                  '0 0 20px rgba(255,255,255,0.3)',
                  '0 0 60px rgba(255,255,255,0.6)',
                  '0 0 20px rgba(255,255,255,0.3)',
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-32 h-32 bg-white rounded-full flex items-center justify-center"
            >
              <Sprout className="w-16 h-16 text-green-600" />
            </motion.div>

            {/* Sparkles */}
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: i * 90 
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2 
                }}
                className="absolute"
                style={{
                  top: i === 0 ? '-10px' : i === 1 ? '50%' : i === 2 ? 'calc(100% + 10px)' : '50%',
                  left: i === 1 ? '-10px' : i === 3 ? 'calc(100% + 10px)' : '50%',
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <Sparkles className="w-6 h-6 text-yellow-300" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h1 className="text-5xl font-bold text-white mb-3">
            <motion.span
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              SAGRI
            </motion.span>
          </h1>
          <p className="text-xl text-white/90 mb-6">Krishi Shayak</p>
          <p className="text-white/70 text-sm">Your Intelligent Farming Assistant</p>
        </motion.div>

        {/* Loading Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 w-64 h-1 bg-white/20 rounded-full overflow-hidden mx-auto"
        >
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            transition={{ 
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear' 
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
