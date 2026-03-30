import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from 'sonner';
import { SplashScreen } from './components/SplashScreen';
import { AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>
      {!showSplash && <RouterProvider router={router} />}
      <Toaster position="top-right" richColors />
    </>
  );
}

export default App;