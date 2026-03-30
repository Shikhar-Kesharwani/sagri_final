import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router';

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isFloating, setIsFloating] = useState(true);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if Web Speech API is supported
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    // Initialize Web Speech API only when user interacts (not on mount)
    // This prevents the "not-allowed" error on page load
    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      
      // Set language based on current language
      const langCode = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
      recognitionRef.current.lang = langCode;

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        handleCommand(text);
        setIsListening(false);
        setError('');
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        // Provide user-friendly error messages
        if (event.error === 'not-allowed') {
          setError(language === 'hi' 
            ? 'माइक्रोफोन की अनुमति की आवश्यकता है। कृपया ब्राउज़र सेटिंग्स में माइक्रोफोन की अनुमति दें।'
            : language === 'pa'
            ? 'ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਸੈਟਿੰਗਾਂ ਵਿੱਚ ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਦਿਓ।'
            : 'Microphone permission denied. Please allow microphone access in your browser settings.');
        } else if (event.error === 'no-speech') {
          setError(language === 'hi' 
            ? 'कोई आवाज नहीं सुनाई दी। कृपया फिर से प्रयास करें।'
            : language === 'pa'
            ? 'ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਸੁਣਾਈ ਦਿੱਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
            : 'No speech detected. Please try again.');
        } else if (event.error === 'audio-capture') {
          setError(language === 'hi' 
            ? 'माइक्रोफोन नहीं मिला। कृपया जांचें कि माइक्रोफोन कनेक्ट है।'
            : language === 'pa'
            ? 'ਮਾਈਕ੍ਰੋਫੋਨ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਜਾਂਚ ਕਰੋ ਕਿ ਮਾਈਕ੍ਰੋਫੋਨ ਕਨੈਕਟ ਹੈ।'
            : 'Microphone not found. Please check if your microphone is connected.');
        } else if (event.error === 'network') {
          setError(language === 'hi' 
            ? 'नेटवर्क त्रुटि। कृपया अपना इंटरनेट कनेक्शन जांचें।'
            : language === 'pa'
            ? 'ਨੈੱਟਵਰਕ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਜਾਂਚੋ।'
            : 'Network error. Please check your internet connection.');
        } else {
          // Silently ignore other errors to prevent console spam
          // Only show errors when user is actively using the feature
          if (isListening) {
            setError(language === 'hi' 
              ? 'आवाज पहचान त्रुटि। कृपया फिर से प्रयास करें।'
              : language === 'pa'
              ? 'ਆਵਾਜ਼ ਪਛਾਣ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
              : 'Voice recognition error. Please try again.');
          }
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition.');
    }
  }, [language, isListening]);

  const startListening = async () => {
    if (!isSupported) {
      return;
    }

    if (!recognitionRef.current) {
      setError('Speech recognition not available.');
      return;
    }

    try {
      setTranscript('');
      setResponse('');
      setError('');
      setIsListening(true);
      await recognitionRef.current.start();
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
      
      if (err.message?.includes('already started')) {
        // Already listening, just reset state
        setIsListening(true);
      } else {
        setError(language === 'hi' 
          ? 'आवाज पहचान शुरू नहीं हो सका। कृपया फिर से प्रयास करें।'
          : language === 'pa'
          ? 'ਆਵਾਜ਼ ਪਛਾਣ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
          : 'Could not start voice recognition. Please try again.');
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const langCode = language === 'hi' ? 'hi-IN' : language === 'pa' ? 'pa-IN' : 'en-IN';
    utterance.lang = langCode;
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    let responseText = '';
    let action = null;

    // Navigation commands
    if (lowerText.includes('home') || lowerText.includes('होम') || lowerText.includes('ਹੋਮ')) {
      responseText = language === 'hi' ? 'होम पर जा रहे हैं' : language === 'pa' ? 'ਹੋਮ ਤੇ ਜਾ ਰਹੇ ਹਾਂ' : 'Going to home';
      action = () => navigate('/');
    } else if (lowerText.includes('dashboard') || lowerText.includes('डैशबोर्ड') || lowerText.includes('ਡੈਸ਼ਬੋਰਡ')) {
      responseText = language === 'hi' ? 'डैशबोर्ड खोल रहे हैं' : language === 'pa' ? 'ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening dashboard';
      action = () => navigate('/farmer');
    } else if (lowerText.includes('disease') || lowerText.includes('रोग') || lowerText.includes('ਰੋਗ')) {
      responseText = language === 'hi' ? 'रोग पहचान खोल रहे हैं' : language === 'pa' ? 'ਰੋਗ ਪਛਾਣ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening disease detection';
      action = () => navigate('/farmer/disease-detection');
    } else if (lowerText.includes('yield') || lowerText.includes('उपज') || lowerText.includes('ਉਪਜ')) {
      responseText = language === 'hi' ? 'उपज भविष्यवाणी खोल रहे हैं' : language === 'pa' ? 'ਉਪਜ ਭਵਿੱਖਬਾਣੀ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening yield prediction';
      action = () => navigate('/farmer/yield-prediction');
    } else if (lowerText.includes('price') || lowerText.includes('मूल्य') || lowerText.includes('ਕੀਮਤ')) {
      responseText = language === 'hi' ? 'मूल्य पूर्वानुमान खोल रहे हैं' : language === 'pa' ? 'ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening price forecasting';
      action = () => navigate('/farmer/price-forecasting');
    } else if (lowerText.includes('weather') || lowerText.includes('मौसम') || lowerText.includes('ਮੌਸਮ')) {
      responseText = language === 'hi' ? 'मौसम डैशबोर्ड खोल रहे हैं' : language === 'pa' ? 'ਮੌਸਮ ਡੈਸ਼ਬੋरਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening weather dashboard';
      action = () => navigate('/farmer/weather');
    } else if (lowerText.includes('market') || lowerText.includes('बाजार') || lowerText.includes('ਬਾਜ਼ਾਰ')) {
      responseText = language === 'hi' ? 'बाजार मूल्य खोल रहे हैं' : language === 'pa' ? 'ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening market prices';
      action = () => navigate('/farmer/market-prices');
    } else if (lowerText.includes('community') || lowerText.includes('समुदाय') || lowerText.includes('ਭਾਈਚਾਰਾ')) {
      responseText = language === 'hi' ? 'समुदाय खोल रहे हैं' : language === 'pa' ? 'ਭਾਈਚਾਰਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ' : 'Opening community';
      action = () => navigate('/farmer/community');
    } else {
      responseText = language === 'hi' 
        ? 'मुझे समझ नहीं आया। कृपया फिर से कोशिश करें।' 
        : language === 'pa' 
        ? 'ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।'
        : 'I didn\'t understand. Please try again.';
    }

    setResponse(responseText);
    speak(responseText);

    if (action) {
      setTimeout(() => {
        action();
        setIsOpen(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {isFloating && !isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-40 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full shadow-2xl flex items-center justify-center group"
          >
            <motion.div
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(168, 85, 247, 0.7)', '0 0 0 20px rgba(168, 85, 247, 0)'] 
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full"
            />
            <Sparkles className="w-7 h-7 text-white" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 border-2 border-white/30 rounded-full border-t-transparent"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Voice Assistant Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl z-50 overflow-hidden"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 opacity-30">
                <motion.div
                  animate={{ 
                    backgroundPosition: ['0% 0%', '100% 100%'],
                  }}
                  transition={{ duration: 10, repeat: Infinity, repeatType: 'reverse' }}
                  className="absolute inset-0 bg-gradient-to-br from-purple-400 via-pink-500 to-purple-600"
                  style={{ backgroundSize: '200% 200%' }}
                />
              </div>

              {/* Content */}
              <div className="relative p-6">
                <button
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-white/10 backdrop-blur-xl rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Sparkles className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-white mb-2">{t('voice.assistant')}</h3>
                  <p className="text-purple-200 text-sm">{t('voice.howCanIHelp')}</p>
                </div>

                {/* Microphone Button */}
                <div className="flex justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)]'
                        : 'bg-white/20 backdrop-blur-xl hover:bg-white/30'
                    }`}
                  >
                    {isListening ? (
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <MicOff className="w-12 h-12 text-white" />
                      </motion.div>
                    ) : (
                      <Mic className="w-12 h-12 text-white" />
                    )}
                  </motion.button>
                </div>

                {/* Status Text */}
                <div className="text-center mb-4">
                  {isListening && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white font-medium"
                    >
                      {t('voice.listening')}
                    </motion.p>
                  )}
                  {!isListening && !transcript && (
                    <p className="text-purple-200">{t('voice.speak')}</p>
                  )}
                </div>

                {/* Transcript */}
                {transcript && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 mb-4"
                  >
                    <p className="text-sm text-purple-200 mb-1">You said:</p>
                    <p className="text-white font-medium">{transcript}</p>
                  </motion.div>
                )}

                {/* Response */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3"
                  >
                    <Volume2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="text-white">{response}</p>
                  </motion.div>
                )}

                {/* Voice Indicator */}
                {isListening && (
                  <div className="flex justify-center gap-1 mt-4">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 24, 8] }}
                        transition={{ 
                          duration: 0.5, 
                          repeat: Infinity,
                          delay: i * 0.1 
                        }}
                        className="w-1 bg-white rounded-full"
                      />
                    ))}
                  </div>
                )}

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/10 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-500">{error}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}