import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Sparkles, AlertCircle, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from './AuthProvider';

// Language codes for Web Speech API
const LANGUAGE_CODES: Record<Language, string> = {
  en: 'en-IN',
  hi: 'hi-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  ta: 'ta-IN',
};

// Comprehensive command mapping for all routes and actions
interface CommandMap {
  keywords: string[];
  action: () => void;
  response: Record<Language, string>;
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isFloating, setIsFloating] = useState(true);
  const [error, setError] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'checking'>('checking');
  const recognitionRef = useRef<any>(null);
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  // Check browser support on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.');
      setPermissionStatus('denied');
    } else {
      setPermissionStatus('prompt');
    }
  }, []);

  // Initialize speech recognition when needed
  const initializeSpeechRecognition = () => {
    if (recognitionRef.current) return true;

    try {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      if (!SpeechRecognition) {
        throw new Error('Speech Recognition not supported');
      }

      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.maxAlternatives = 1;
      
      // Set language based on current language
      recognitionRef.current.lang = LANGUAGE_CODES[language];

      recognitionRef.current.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
        setError('');
        setPermissionStatus('granted');
      };

      recognitionRef.current.onresult = (event: any) => {
        const text = event.results[0][0].transcript;
        console.log('Recognized text:', text);
        setTranscript(text);
        handleCommand(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error, event);
        setIsListening(false);
        
        // Provide user-friendly error messages in all languages
        const errorMessages: Record<string, Record<Language, string>> = {
          'not-allowed': {
            en: 'Microphone permission denied. Please click "Allow" when prompted by your browser.',
            hi: 'माइक्रोफोन की अनुमति अस्वीकृत। कृपया ब्राउज़र द्वारा पूछे जाने पर "अनुमति दें" पर क्लिक करें।',
            pa: 'ਮਾਈਕ੍ਰੋਫੋਨ ਦੀ ਇਜਾਜ਼ਤ ਰੱਦ। ਕਿਰਪਾ ਕਰਕੇ ਬ੍ਰਾਊਜ਼ਰ ਦੁਆਰਾ ਪੁੱਛੇ ਜਾਣ \'ਤੇ "ਇਜਾਜ਼ਤ ਦਿਓ" \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
            mr: 'मायक्रोफोन परवानगी नाकारली. कृपया ब्राउझरद्वारे विचारल्यावर "परवानगी द्या" वर क्लिक करा.',
            ta: 'மைக்ரோஃபோன் அனுமதி மறுக்கப்பட்டது. உலாவியால் கேட்கப்படும்போது "அனுமதி" என்பதைக் கிளிக் செய்யவும்.',
          },
          'no-speech': {
            en: 'No speech detected. Please speak clearly and try again.',
            hi: 'कोई आवाज नहीं सुनाई दी। कृपया स्पष्ट बोलें और फिर से प्रयास करें।',
            pa: 'ਕੋਈ ਆਵਾਜ਼ ਨਹੀਂ ਸੁਣਾਈ ਦਿੱਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਸਪਸ਼ਟ ਬੋਲੋ ਅਤੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
            mr: 'कोणतेही भाषण आढळले नाही. कृपया स्पष्टपणे बोला आणि पुन्हा प्रयत्न करा.',
            ta: 'பேச்சு கண்டறியப்படவில்லை. தயவுசெய்து தெளிவாகப் பேசி மீண்டும் முயற்சிக்கவும்.',
          },
          'audio-capture': {
            en: 'Microphone not found or not working. Please check your microphone.',
            hi: 'माइक्रोफोन नहीं मिला या काम नहीं कर रहा। कृपया अपना माइक्रोफोन जांचें।',
            pa: 'ਮਾਈਕ੍ਰੋਫੋਨ ਨਹੀਂ ਮਿਲਿਆ ਜਾਂ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ। ਕਿਰਪਾ ਕਰਕੇ ਆਪਣਾ ਮਾਈਕ੍ਰੋਫੋਨ ਜਾਂਚੋ।',
            mr: 'मायक्रोफोन सापडला नाही किंवा काम करत नाही. कृपया तुमचा मायक्रोफोन तपासा.',
            ta: 'மைக்ரோஃபோன் கிடைக்கவில்லை அல்லது வேலை செய்யவில்லை. உங்கள் மைக்ரோஃபோனை சரிபார்க்கவும்.',
          },
          'network': {
            en: 'Network error. Speech recognition requires internet connection.',
            hi: 'नेटवर्क त्रुटि। आवाज पहचान के लिए इंटरनेट कनेक्शन आवश्यक है।',
            pa: 'ਨੈੱਟਵਰਕ ਗਲਤੀ। ਆਵਾਜ਼ ਪਛਾਣ ਲਈ ਇੰਟਰਨੈੱਟ ਕਨੈਕਸ਼ਨ ਦੀ ਲੋੜ ਹੈ।',
            mr: 'नेटवर्क त्रुटी. आवाज ओळखीसाठी इंटरनेट कनेक्शन आवश्यक आहे.',
            ta: 'நெட்வொர்க் பிழை. குரல் அங்கீகாரத்திற்கு இணைய இணைப்பு தேவை.',
          },
          'aborted': {
            en: 'Speech recognition was stopped.',
            hi: 'आवाज पहचान रोक दी गई।',
            pa: 'ਆਵਾਜ਼ ਪਛਾਣ ਰੋਕ ਦਿੱਤੀ ਗਈ।',
            mr: 'आवाज ओळख थांबवली गेली.',
            ta: 'குரல் அங்கீகாரம் நிறுத்தப்பட்டது.',
          },
        };

        const errorMsg = errorMessages[event.error];
        if (errorMsg) {
          setError(errorMsg[language]);
          if (event.error === 'not-allowed') {
            setPermissionStatus('denied');
          }
        } else {
          // Generic error message
          const genericError = {
            en: 'Voice recognition error. Please try again.',
            hi: 'आवाज पहचान त्रुटि। कृपया फिर से प्रयास करें।',
            pa: 'ਆਵਾਜ਼ ਪਛਾਣ ਗਲਤੀ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
            mr: 'आवाज ओळख त्रुटी. कृपया पुन्हा प्रयत्न करा.',
            ta: 'குரல் அங்கீகார பிழை. மீண்டும் முயற்சிக்கவும்.',
          };
          setError(genericError[language]);
        }
      };

      recognitionRef.current.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      return true;
    } catch (err) {
      console.error('Error initializing speech recognition:', err);
      setIsSupported(false);
      setError('Failed to initialize speech recognition.');
      return false;
    }
  };

  // Request microphone permission and start listening
  const startListening = async () => {
    if (!isSupported) {
      return;
    }

    try {
      // Clear previous state
      setTranscript('');
      setResponse('');
      setError('');
      
      // Initialize speech recognition if not already done
      if (!initializeSpeechRecognition()) {
        return;
      }

      // Update language before starting
      if (recognitionRef.current) {
        recognitionRef.current.lang = LANGUAGE_CODES[language];
      }

      // Start recognition - browser will prompt for permission if needed
      setIsListening(true);
      recognitionRef.current.start();
      
    } catch (err: any) {
      console.error('Error starting recognition:', err);
      setIsListening(false);
      
      if (err.message?.includes('already started') || err.message?.includes('recognition has already started')) {
        // Already listening, just update state
        setIsListening(true);
      } else {
        const startErrorMsg = {
          en: 'Could not start voice recognition. Click the microphone button to try again.',
          hi: 'आवाज पहचान शुरू नहीं हो सका। फिर से प्रयास करने के लिए माइक्रोफोन बटन पर क्लिक करें।',
          pa: 'ਆਵਾਜ਼ ਪਛਾਣ ਸ਼ੁਰੂ ਨਹੀਂ ਹੋ ਸਕੀ। ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰਨ ਲਈ ਮਾਈਕ੍ਰੋਫੋਨ ਬਟਨ \'ਤੇ ਕਲਿੱਕ ਕਰੋ।',
          mr: 'आवाज ओळख सुरू करू शकलो नाही. पुन्हा प्रयत्न करण्यासाठी मायक्रोफोन बटणावर क्लिक करा.',
          ta: 'குரல் அங்கீகாரத்தைத் தொடங்க முடியவில்லை. மீண்டும் முயற்சிக்க மைக்ரோஃபோன் பொத்தானைக் கிளிக் செய்யவும்.',
        };
        setError(startErrorMsg[language]);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.error('Error stopping recognition:', err);
      }
      setIsListening(false);
    }
  };

  const speak = (text: string) => {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = LANGUAGE_CODES[language];
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    
    // Handle speech synthesis errors
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  // Short-term memory for last mentioned crop
  const lastCropRef = useRef<string>('');

  const normalizeText = (text: string): string =>
    text
      .replace(/\bgahu\b|\bgehun\b|\bgahun\b|\bgaahu\b/g, 'gehu')
      .replace(/\bdawai\b|\bdawa\b/g, 'spray')
      .replace(/\bkeede\b|\bkide\b|\bkeed\b/g, 'keeda')
      .replace(/\bpaani\b/g, 'pani')
      .replace(/\bbaarish\b|\bbaaris\b/g, 'barish')
      .replace(/\bdhaan\b/g, 'dhan');

  const detectCrop = (text: string): string | null => {
    const cropMap: Record<string, string[]> = {
      'Wheat': ['gehu', 'wheat', 'gahu', '\u0a15\u0a23\u0a15', '\u0917\u0947\u0939\u0942\u0902'],
      'Rice': ['dhan', 'rice', 'paddy', 'chawal', '\u0927\u093e\u0928', '\u0a27\u0a3e\u0a28'],
      'Cotton': ['kapas', 'cotton', 'kappas', '\u0a15\u0a2a\u0a3e\u0a39', '\u0915\u092a\u093e\u0938'],
      'Maize': ['makka', 'maize', 'corn', '\u0a2e\u0a71\u0a15\u0a40', '\u092e\u0915\u094d\u0915\u093e'],
      'Sugarcane': ['ganna', 'sugarcane', '\u0a17\u0a70\u0a28\u0a3e', '\u0917\u0928\u094d\u0928\u093e'],
      'Mustard': ['sarson', 'mustard', '\u0a38\u0a30\u0a4d\u0a39\u0a4b\u0a02', '\u0938\u0930\u0938\u094b\u0902'],
    };
    for (const [crop, keywords] of Object.entries(cropMap)) {
      if (keywords.some(k => text.includes(k))) return crop;
    }
    return null;
  };

  const handleFarmingQuery = (rawText: string): string | null => {
    const text = normalizeText(rawText.toLowerCase());
    const detectedCrop = detectCrop(text);
    if (detectedCrop) lastCropRef.current = detectedCrop;
    const crop = detectedCrop || lastCropRef.current || 'fasal';

    const pestKw = ['keeda', 'pest', 'insect', 'kira', 'bimari', 'rog', 'disease', 'fungus', '\u0915\u0940\u0921\u093c\u0947', '\u0930\u094b\u0917'];
    if (pestKw.some(k => text.includes(k))) {
      const r: Record<Language, string> = {
        en: `${crop} has pest or disease symptoms. Spray Neem oil or visit your nearest Krishi Kendra.`,
        hi: `\u0906\u092a\u0915\u0940 ${crop} \u0915\u0940 \u092b\u0938\u0932 \u092e\u0947\u0902 \u0915\u0940\u0921\u093c\u0947 \u0932\u0917\u0947 \u0939\u0948\u0902\u0964 \u0928\u0940\u092e \u0924\u0947\u0932 \u0915\u093e \u091b\u093f\u0921\u093c\u0915\u093e\u0935 \u0915\u0930\u0947\u0902 \u092f\u093e \u0928\u091c\u0926\u0940\u0915\u0940 \u0915\u0943\u0937\u093f \u0915\u0947\u0902\u0926\u094d\u0930 \u0938\u0947 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u0947\u0902\u0964`,
        pa: `\u0a24\u0a41\u0a39\u0a3e\u0a21\u0a40 ${crop} \u0a26\u0a40 \u0a2b\u0a38\u0a32 \u0a35\u0a3f\u0a71\u0a1a \u0a15\u0a40\u0a5c\u0a47 \u0a32\u0a71\u0a17\u0a47 \u0a39\u0a28\u0964 \u0a28\u0a3f\u0a70\u0a2e \u0a26\u0a47 \u0a24\u0a47\u0a32 \u0a26\u0a3e \u0a1b\u0a3f\u0a5c\u0a15\u0a3e\u0a05 \u0a15\u0a30\u0a4b\u0964`,
        mr: `${crop} \u092a\u093f\u0915\u093e\u0935\u0930 \u0915\u0940\u0921 \u0906\u0939\u0947\u0964 \u0915\u0921\u0942\u0932\u093f\u0902\u092c\u093e\u091a\u0947 \u0924\u0947\u0932 \u092b\u0935\u093e\u0930\u093e \u0915\u093f\u0902\u0935\u093e \u0915\u0943\u0937\u0940 \u0915\u0947\u0902\u0926\u094d\u0930\u093e\u0936\u0940 \u0938\u0902\u092a\u0930\u094d\u0915 \u0915\u0930\u093e.`,
        ta: `${crop} \u0baa\u0baf\u0bbf\u0bb0\u0bbf\u0bb2\u0bcd \u0baa\u0bc2\u0b9a\u0bcd\u0b9a\u0bbf \u0ba4\u0bbe\u0b95\u0bcd\u0b95\u0bbf\u0baf\u0bc1\u0bb3\u0bcd\u0bb3\u0ba4\u0bc1. \u0bb5\u0bc7\u0baa\u0bcd\u0baa \u0b8e\u0ba3\u0bcd\u0ba3\u0bc6\u0baf\u0bcd \u0ba4\u0bc6\u0bb3\u0bbf\u0b95\u0bcd\u0b95\u0bb5\u0bc1\u0bae\u0bcd.`,
      };
      return r[language];
    }

    const waterKw = ['pani', 'irrigation', 'sinchai', 'sukha', 'sookha', '\u092a\u093e\u0928\u0940'];
    if (waterKw.some(k => text.includes(k))) {
      const r: Record<Language, string> = {
        en: `Your ${crop} needs water. Irrigate in the morning or evening immediately.`,
        hi: `\u0906\u092a\u0915\u0940 ${crop} \u0915\u094b \u092a\u093e\u0928\u0940 \u0915\u0940 \u091c\u0930\u0942\u0930\u0924 \u0939\u0948\u0964 \u0938\u0941\u092c\u0939 \u092f\u093e \u0936\u093e\u092e \u0924\u0941\u0930\u0902\u0924 \u0938\u093f\u0902\u091a\u093e\u0908 \u0915\u0930\u0947\u0902\u0964`,
        pa: `\u0a24\u0a41\u0a39\u0a3e\u0a21\u0a40 ${crop} \u0a28\u0a42\u0a70 \u0a2a\u0a3e\u0a23\u0a40 \u0a26\u0a40 \u0a32\u0a4b\u0a5c \u0a39\u0a48\u0964 \u0a38\u0a35\u0a47\u0a30\u0a47 \u0a1c\u0a3e\u0a02 \u0a38\u0a3c\u0a3e\u0a2e \u0a28\u0a42\u0a70 \u0a38\u0a3f\u0a70\u0a1a\u0a3e\u0a08 \u0a15\u0a30\u0a4b\u0964`,
        mr: `\u0924\u0941\u092e\u091a\u094d\u092f\u093e ${crop} \u0932\u093e \u092a\u093e\u0923\u094d\u092f\u093e\u091a\u0940 \u0917\u0930\u091c \u0906\u0939\u0947\u0964 \u0938\u0915\u093e\u0933\u0940 \u0915\u093f\u0902\u0935\u093e \u0938\u0902\u0927\u094d\u092f\u093e\u0915\u093e\u0933\u0940 \u0924\u093e\u092c\u0921\u0924\u094b\u092c \u092a\u093e\u0923\u0940 \u0926\u094d\u092f\u093e.`,
        ta: `\u0b89\u0b99\u0bcd\u0b95\u0bb3\u0bcd ${crop} \u0baa\u0baf\u0bbf\u0bb0\u0bc1\u0b95\u0bcd\u0b95\u0bc1 \u0ba4\u0ba3\u0bcd\u0ba3\u0bc0\u0bb0\u0bcd \u0ba4\u0bc7\u0bb5\u0bc8. \u0b95\u0bbe\u0bb2\u0bc8 \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0bae\u0bbe\u0bb2\u0bc8\u0baf\u0bbf\u0bb2\u0bcd \u0baa\u0bbe\u0b9a\u0ba9\u0bae\u0bcd \u0b9a\u0bc6\u0baf\u0bcd\u0baf\u0bb5\u0bc1\u0bae\u0bcd.`,
      };
      return r[language];
    }

    const marketKw = ['bhav', 'rate', 'mandi', 'price', 'keemat', 'bazar', 'daam', '\u092d\u093e\u0935', '\u092e\u0902\u0921\u0940'];
    if (marketKw.some(k => text.includes(k))) {
      navigate('/price-forecasting');
      const r: Record<Language, string> = {
        en: `Opening market prices for ${crop}. Check today's mandi rates before selling.`,
        hi: `${crop} \u0915\u0947 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935 \u0926\u0947\u062d \u0930\u0939\u0947 \u0939\u0948\u0902\u0964`,
        pa: `${crop} \u0a26\u0a47 \u0a2e\u0a70\u0a21\u0a40 \u0a2d\u0a3e\u0a05 \u0a26\u0a47\u0a16 \u0a30\u0a39\u0a47 \u0a39\u0a3e\u0a02\u0964`,
        mr: `${crop} \u091a\u0947 \u092e\u0902\u0921\u0940 \u092d\u093e\u0935 \u092a\u093e\u0939\u0924 \u0906\u0939\u0947.`,
        ta: `${crop} \u0b9a\u0ba8\u0bcd\u0ba4\u0bc8 \u0bb5\u0bbf\u0bb2\u0bc8\u0b95\u0bb3\u0bc8 \u0ba4\u0bbf\u0bb1\u0b95\u0bcd\u0b95\u0bbf\u0bb0\u0bc1\u0ba4\u0bc1.`,
      };
      return r[language];
    }

    const schemeKw = ['yojana', 'subsidy', 'sarkar', 'government', '\u092f\u094b\u091c\u0928\u093e', '\u0938\u092c\u094d\u0938\u093f\u0921\u0940'];
    if (schemeKw.some(k => text.includes(k))) {
      navigate('/schemes');
      const r: Record<Language, string> = {
        en: 'Opening government schemes. PM-Kisan Samman Nidhi and crop insurance are available.',
        hi: '\u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e\u090f\u0902 \u062e\u094b\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 PM-\u0915\u093f\u0938\u093e\u0928 \u0938\u092e\u094d\u092e\u093e\u0928 \u0928\u093f\u0927\u093f \u0914\u0930 \u092b\u0938\u0932 \u092c\u0940\u092e\u093e \u0906\u092a\u0915\u0947 \u0932\u093f\u090f \u0909\u092a\u0932\u092c\u094d\u0927 \u0939\u0948\u0902\u0964',
        pa: '\u0a38\u0a30\u0a15\u0a3e\u0a30\u0a40 \u0a2f\u0a4b\u0a1c\u0a28\u0a3e\u0a35\u0a3e\u0a02 \u0a16\u0a4b\u0a32\u0a4d\u0a39 \u0a30\u0a39\u0a47 \u0a39\u0a3e\u0a02\u0964',
        mr: '\u0938\u0930\u0915\u093e\u0930\u0940 \u092f\u094b\u091c\u0928\u093e \u0909\u0918\u0921\u0924 \u0906\u0939\u0947.',
        ta: '\u0a85\u0bb0\u0b9a\u0bc1 \u0ba4\u0bbf\u0b9f\u0bcd\u0b9f\u0b99\u0bcd\u0b95\u0bb3\u0bc8 \u0ba4\u0bbf\u0bb1\u0b95\u0bcd\u0b95\u0bbf\u0bb0\u0bc1\u0ba4\u0bc1.',
      };
      return r[language];
    }

    const fertKw = ['khad', 'fertilizer', 'urea', 'dap', 'khaad', '\u0916\u093e\u0926'];
    if (fertKw.some(k => text.includes(k))) {
      const r: Record<Language, string> = {
        en: `For ${crop}, use DAP at sowing and Urea in splits. Avoid overuse.`,
        hi: `${crop} \u0915\u0947 \u0932\u093f\u090f \u092c\u0941\u0906\u0908 \u092e\u0947\u0902 DAP \u0914\u0930 \u092c\u093e\u0926 \u092e\u0947\u0902 \u092f\u0942\u0930\u093f\u092f\u093e \u0915\u093f\u0936\u094d\u0924\u094b\u0902 \u092e\u0947\u0902 \u0921\u093e\u0932\u0947\u0902\u0964`,
        pa: `${crop} \u0a32\u0a08 \u0a2c\u0a3f\u0a1c\u0a3e\u0a08 \u0a35\u0a47\u0a32\u0a47 DAP \u0a05\u0a24\u0a47 \u0a2b\u0a3f\u0a30 \u0a2f\u0a42\u0a30\u0a40\u0a06 \u0a35\u0a30\u0a24\u0a4b\u0964`,
        mr: `${crop} \u0938\u093e\u0920\u0940 \u092a\u0947\u0930\u0923\u0940\u0924 DAP \u0906\u0923\u093f \u0928\u0902\u0924\u0930 \u092f\u0942\u0930\u093f\u092f\u093e \u0935\u093e\u092a\u0930\u093e.`,
        ta: `${crop} \u0b95\u0bcd\u0b95\u0bc1 \u0bb5\u0bbf\u0ba4\u0bc8\u0baa\u0bcd\u0baa\u0bbf\u0bb2\u0bcd DAP, \u0baa\u0bbf\u0bb1\u0b95\u0bc1 \u0baf\u0bc2\u0bb0\u0bbf\u0baf\u0bbe \u0b87\u0b9f\u0bb5\u0bc1\u0bae\u0bcd.`,
      };
      return r[language];
    }

    const equipKw = ['tractor', 'machine', 'yantra', 'rent', 'kiraya', '\u0924\u094d\u0930\u0948\u0915\u094d\u091f\u0930'];
    if (equipKw.some(k => text.includes(k))) {
      navigate('/book-equipment');
      const r: Record<Language, string> = {
        en: 'Opening equipment booking. Rent tractors and harvesters at best rates.',
        hi: '\u0909\u092a\u0915\u0930\u0923 \u092c\u0941\u0915\u093f\u0902\u0917 \u062e\u094b\u0932 \u0930\u0939\u0947 \u0939\u0948\u0902\u0964 \u0920\u0940\u0915 \u0926\u093e\u092e \u092a\u0930 \u091f\u094d\u0930\u0948\u0915\u094d\u091f\u0930 \u0932\u0947\u0902\u0964',
        pa: '\u0a09\u0a2a\u0a15\u0a30\u0a23 \u0a2c\u0a41\u0a71\u0a15\u0a3f\u0a70\u0a17 \u0a16\u0a4b\u0a32\u0a4d\u0a39 \u0a30\u0a39\u0a47 \u0a39\u0a3e\u0a02\u0964',
        mr: '\u0909\u092a\u0915\u0930\u0923 \u092c\u0941\u0915\u093f\u0902\u0917 \u0909\u0918\u0921\u0924 \u0906\u0939\u0947.',
        ta: '\u0b95\u0bb0\u0bc1\u0bb5\u0bbf \u0bae\u0bc1\u0ba9\u0bcd\u0baa\u0ba4\u0bbf\u0bb5\u0bc1 \u0ba4\u0bbf\u0bb1\u0b95\u0bcd\u0b95\u0bbf\u0bb0\u0bc1\u0ba4\u0bc1.',
      };
      return r[language];
    }

    if (detectedCrop) {
      const r: Record<Language, string> = {
        en: `You mentioned ${crop}. What is the problem? Say: pest, water, fertilizer, or market price.`,
        hi: `\u0906\u092a\u0928\u0947 ${crop} \u0915\u093e \u091c\u093c\u093f\u0915\u094d\u0930 \u0915\u093f\u092f\u093e\u0964 \u0915\u094d\u092f\u093e \u0938\u092e\u0938\u094d\u092f\u093e \u0939\u0948? \u0915\u0940\u0921\u093c\u093e, \u092a\u093e\u0928\u0940, \u062e\u093e\u0926 \u092f\u093e \u092d\u093e\u0935 \u092c\u094b\u0932\u0947\u0902\u0964`,
        pa: `\u0a24\u0a41\u0a38\u0a40\u0a02 ${crop} \u0a26\u0a3e \u0a1c\u0a3c\u0a3f\u0a15\u0a30 \u0a15\u0a40\u0a24\u0a3e\u0964 \u0a15\u0a40 \u0a38\u0a2e\u0a71\u0a38\u0a3f\u0a06 \u0a39\u0a48? \u0a15\u0a40\u0a5c\u0a3e, \u0a2a\u0a3e\u0a23\u0a40, \u0a16\u0a3e\u0a26 \u0a1c\u0a3e\u0a02 \u0a2d\u0a3e\u0a05 \u0a26\u0a71\u0a38\u0a4b\u0964`,
        mr: `\u0924\u0941\u092e\u094d\u0939\u0940 ${crop} \u091a\u093e \u0909\u0932\u094d\u0932\u0947\u0916 \u0915\u0947\u0932\u093e. \u0915\u093e\u092f \u0938\u092e\u0938\u094d\u092f\u093e \u0906\u0939\u0947? \u0915\u0940\u0921, \u092a\u093e\u0923\u0940, \u062e\u0924 \u0935\u093e \u092d\u093e\u0935 \u0938\u093e\u0902\u0917\u093e.`,
        ta: `\u0ba8\u0bc0\u0b99\u0bcd\u0b95\u0bb3\u0bcd ${crop} \u0baa\u0bb1\u0bcd\u0bb1\u0bbf \u0b95\u0bc1\u0bb1\u0bbf\u0baa\u0bcd\u0baa\u0bbf\u0b9f\u0bcd\u0b9f\u0bc0\u0bb0\u0bcd\u0b95\u0bb3\u0bcd. \u0b8f\u0ba9\u0bcd\u0ba9 \u0baa\u0bbf\u0bb0\u0b9a\u0bcd\u0b9a\u0bbf\u0ba9\u0bc8? \u0baa\u0bc2\u0b9a\u0bcd\u0b9a\u0bbf, \u0ba8\u0bc0\u0bb0\u0bcd, \u0b89\u0bb0\u0bae\u0bcd \u0b85\u0bb2\u0bcd\u0bb2\u0ba4\u0bc1 \u0bb5\u0bbf\u0bb2\u0bc8 \u0b9a\u0bca\u0bb2\u0bcd\u0bb2\u0bc1\u0b99\u0bcd\u0b95\u0bb3\u0bcd.`,
      };
      return r[language];
    }
    return null;
  };

  const handleCommand = (text: string) => {
    const lowerText = text.toLowerCase();
    
    // Define all command mappings
    const commands: CommandMap[] = [
      // Language switching
      {
        keywords: ['english', 'इंग्लिश', 'अंग्रेजी', 'ਅੰਗਰੇਜ਼ੀ', 'इंग्रजी', 'ஆங்கிலம்'],
        action: () => setLanguage('en'),
        response: {
          en: 'Switching to English',
          hi: 'अंग्रेजी में बदल रहे हैं',
          pa: 'ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬਦਲ ਰਹੇ ਹਾਂ',
          mr: 'इंग्रजीमध्ये बदलत आहे',
          ta: 'ஆங்கிலத்திற்கு மாறுகிறது',
        },
      },
      {
        keywords: ['hindi', 'हिन्दी', 'हिंदी', 'ਹਿੰਦੀ', 'हिंदी', 'இந்தி'],
        action: () => setLanguage('hi'),
        response: {
          en: 'Switching to Hindi',
          hi: 'हिंदी में बदल रहे हैं',
          pa: 'ਹਿੰਦੀ ਵਿੱਚ ਬਦਲ ਰਹੇ ਹਾਂ',
          mr: 'हिंदीमध्ये बदलत आहे',
          ta: 'இந்திக்கு மாறுகிறது',
        },
      },
      {
        keywords: ['punjabi', 'पंजाबी', 'ਪੰਜਾਬੀ', 'पंजाबी', 'பஞ்சாபி'],
        action: () => setLanguage('pa'),
        response: {
          en: 'Switching to Punjabi',
          hi: 'पंजाबी में बदल रहे हैं',
          pa: 'ਪੰਜਾਬੀ ਵਿੱਚ ਬਦਲ ਰਹੇ ਹਾਂ',
          mr: 'पंजाबीमध्ये बदलत आहे',
          ta: 'பஞ்சாபிக்கு மாறுகிறது',
        },
      },
      {
        keywords: ['marathi', 'मराठी', 'ਮਰਾਠੀ', 'मराठी', 'மராத்தி'],
        action: () => setLanguage('mr'),
        response: {
          en: 'Switching to Marathi',
          hi: 'मराठी में बदल रहे हैं',
          pa: 'ਮਰਾਠੀ ਵਿੱਚ ਬਦਲ ਰਹੇ ਹਾਂ',
          mr: 'मराठीमध्ये बदलत आहे',
          ta: 'மராத்திக்கு மாறுகிறது',
        },
      },
      {
        keywords: ['tamil', 'तमिल', 'ਤਮਿਲ', 'तमिळ', 'தமிழ்'],
        action: () => setLanguage('ta'),
        response: {
          en: 'Switching to Tamil',
          hi: 'तमिल में बदल रहे हैं',
          pa: 'ਤਮਿਲ ਵਿੱਚ ਬਦਲ ਰਹੇ ਹਾਂ',
          mr: 'तमिळमध्ये बदलत आहे',
          ta: 'தமிழுக்கு மாறுகிறது',
        },
      },
      
      // Navigation commands
      {
        keywords: ['home', 'होम', 'मुख्य', 'घर', 'ਘਰ', 'ਹੋਮ', 'घर', 'முகப்பு'],
        action: () => navigate('/'),
        response: {
          en: 'Going to home page',
          hi: 'होम पेज पर जा रहे हैं',
          pa: 'ਹੋਮ ਪੇਜ ਤੇ ਜਾ ਰਹੇ ਹਾਂ',
          mr: 'होम पेजवर जात आहे',
          ta: 'முகப்பு பக்கத்திற்கு செல்கிறது',
        },
      },
      {
        keywords: ['dashboard', 'डैशबोर्ड', 'ਡੈਸ਼ਬੋਰਡ', 'डॅशबोर्ड', 'டாஷ்போர்டு'],
        action: () => navigate('/farmer'),
        response: {
          en: 'Opening farmer dashboard',
          hi: 'किसान डैशबोर्ड खोल रहे हैं',
          pa: 'ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'शेतकरी डॅशबोर्ड उघडत आहे',
          ta: 'விவசாயி டாஷ்போர்டை திறக்கிறது',
        },
      },
      {
        keywords: ['login', 'लॉगिन', 'साइन इन', 'ਲਾਗਇਨ', 'लॉगिन', 'உள்நுழைவு'],
        action: () => navigate('/'),
        response: {
          en: 'Opening login page',
          hi: 'लॉगिन पेज खोल रहे हैं',
          pa: 'ਲਾਗਇਨ ਪੇਜ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'लॉगिन पेज उघडत आहे',
          ta: 'உள்நுழைவு பக்கத்தை திறக்கிறது',
        },
      },
      {
        keywords: ['logout', 'लॉगआउट', 'साइन आउट', 'ਲਾਗਆਉਟ', 'लॉगआउट', 'வெளியேறு'],
        action: () => {
          logout();
          navigate('/');
        },
        response: {
          en: 'Logging out',
          hi: 'लॉगआउट कर रहे हैं',
          pa: 'ਲਾਗਆਉਟ ਕਰ ਰਹੇ ਹਾਂ',
          mr: 'लॉगआउट करत आहे',
          ta: 'வெளியேறுகிறது',
        },
      },
      
      // Feature pages
      {
        keywords: ['disease', 'रोग', 'बीमारी', 'ਰੋਗ', 'बिमारी', 'रोग', 'நோய்'],
        action: () => navigate('/disease-detection'),
        response: {
          en: 'Opening disease detection',
          hi: 'रोग पहचान खोल रहे हैं',
          pa: 'ਰੋਗ ਪਛਾਣ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'रोग ओळख उघडत आहे',
          ta: 'நோய் கண்டறிதலை திறக்கிறது',
        },
      },
      {
        keywords: ['risk', 'जोखिम', 'खतरा', 'ਖਤਰਾ', 'जोखीम', 'ஆபத்து'],
        action: () => navigate('/risk-prediction'),
        response: {
          en: 'Opening risk prediction',
          hi: 'जोखिम पूर्वानुमान खोल रहे हैं',
          pa: 'ਖਤਰਾ ਪੂਰਵ-ਅਨੁਮਾਨ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'जोखीम अंदाज उघडत आहे',
          ta: 'ஆபத்து கணிப்பை திறக்கிறது',
        },
      },
      {
        keywords: ['price', 'मूल्य', 'कीमत', 'भाव', 'दाम', 'ਕੀਮਤ', 'किंमत', 'விலை'],
        action: () => navigate('/price-forecasting'),
        response: {
          en: 'Opening price forecasting',
          hi: 'मूल्य पूर्वानुमान खोल रहे हैं',
          pa: 'ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'किंमत अंदाज उघडत आहे',
          ta: 'விலை முன்னறிவிப்பை திறக்கிறது',
        },
      },
      {
        keywords: ['recommendation', 'सुझाव', 'सलाह', 'ਸਲਾਹ', 'शिफारस', 'பரிந்துரை', 'advice'],
        action: () => navigate('/crop-recommendation'),
        response: {
          en: 'Opening crop recommendations',
          hi: 'फसल सुझाव खोल रहे हैं',
          pa: 'ਫਸਲ ਸਿਫਾਰਸ਼ਾਂ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'पीक शिफारसी उघडत आहे',
          ta: 'பயிர் பரிந்துரைகளை திறக்கிறது',
        },
      },
      {
        keywords: ['calendar', 'कैलेंडर', 'ਕੈਲੈਂਡਰ', 'दिनदर्शिका', 'நாட்காட்டி'],
        action: () => navigate('/crop-calendar'),
        response: {
          en: 'Opening crop calendar',
          hi: 'फसल कैलेंडर खोल रहे हैं',
          pa: 'ਫਸਲ ਕੈਲੈਂਡਰ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'पीक दिनदर्शिका उघडत आहे',
          ta: 'பயிர் நாட்காட்டியை திறக்கிறது',
        },
      },
      {
        keywords: ['weather', 'मौसम', 'ਮੌਸਮ', 'हवामान', 'வானிலை'],
        action: () => navigate('/weather'),
        response: {
          en: 'Opening weather dashboard',
          hi: 'मौसम डैशबोर्ड खोल रहे हैं',
          pa: 'ਮੌਸਮ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'हवामान डॅशबोर्ड उघडत आहे',
          ta: 'வானிலை டாஷ்போர்டை திறக்கிறது',
        },
      },
      {
        keywords: ['market', 'बाजार', 'मंडी', 'ਬਾਜ਼ਾਰ', 'ਮੰਡੀ', 'बाजार', 'சந்தை'],
        action: () => navigate('/market-price'),
        response: {
          en: 'Opening market prices',
          hi: 'बाजार मूल्य खोल रहे हैं',
          pa: 'ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'बाजार किंमती उघडत आहे',
          ta: 'சந்தை விலைகளை திறக்கிறது',
        },
      },
      {
        keywords: ['community', 'समुदाय', 'ਭਾਈਚਾਰਾ', 'समुदाय', 'சமூகம்'],
        action: () => navigate('/community'),
        response: {
          en: 'Opening farmer community',
          hi: 'किसान समुदाय खोल रहे हैं',
          pa: 'ਕਿਸਾਨ ਭਾਈਚਾਰਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'शेतकरी समुदाय उघडत आहे',
          ta: 'விவசாயி சமூகத்தை திறக்கிறது',
        },
      },
      {
        keywords: ['expert', 'विशेषज्ञ', 'एक्सपर्ट', 'ਵਿਸ਼ੇਸ਼ਗਿਆ', 'तज्ञ', 'நிபுணர்'],
        action: () => navigate('/expert-connect'),
        response: {
          en: 'Opening expert connect',
          hi: 'विशेषज्ञ कनेक्ट खोल रहे हैं',
          pa: 'ਵਿਸ਼ੇਸ਼ਗਿਆ ਕਨੈਕਟ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'तज्ञ संपर्क उघडत आहे',
          ta: 'நிபுணர் இணைப்பை திறக்கிறது',
        },
      },
      {
        keywords: ['scheme', 'योजना', 'ਯੋਜਨਾ', 'योजना', 'திட்டம்', 'government'],
        action: () => navigate('/schemes'),
        response: {
          en: 'Opening government schemes',
          hi: 'सरकारी योजनाएं खोल रहे हैं',
          pa: 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'सरकारी योजना उघडत आहे',
          ta: 'அரசு திட்டங்களை திறக்கிறது',
        },
      },
      {
        keywords: ['soil', 'मिट्टी', 'ਮਿੱਟੀ', 'माती', 'மண்'],
        action: () => navigate('/soil-health'),
        response: {
          en: 'Opening soil health',
          hi: 'मिट्टी स्वास्थ्य खोल रहे हैं',
          pa: 'ਮਿੱਟੀ ਸਿਹਤ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'माती आरोग्य उघडत आहे',
          ta: 'மண் ஆரோக்கியத்தை திறக்கிறது',
        },
      },
      {
        keywords: ['history', 'इतिहास', 'ਇਤਿਹਾਸ', 'इतिहास', 'வரலாறு'],
        action: () => navigate('/history'),
        response: {
          en: 'Opening prediction history',
          hi: 'भविष्यवाणी इतिहास खोल रहे हैं',
          pa: 'ਭਵਿੱਖਬਾਣੀ ਇਤਿਹਾਸ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'अंदाज इतिहास उघडत आहे',
          ta: 'கணிப்பு வரலாற்றை திறக்கிறது',
        },
      },
      {
        keywords: ['sell', 'बेचना', 'विक्री', 'ਵੇਚਣਾ', 'विक्री', 'விற்க'],
        action: () => navigate('/sell-crops'),
        response: {
          en: 'Opening sell crops',
          hi: 'फसल बेचना खोल रहे हैं',
          pa: 'ਫਸਲ ਵੇਚਣਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'पीक विक्री उघडत आहे',
          ta: 'பயிர்களை விற்பதை திறக்கிறது',
        },
      },
      {
        keywords: ['buy', 'खरीदना', 'seeds', 'बीज', 'ਬੀਜ', 'बीयाणे', 'விதைகள்'],
        action: () => navigate('/buy-seeds'),
        response: {
          en: 'Opening buy seeds',
          hi: 'बीज खरीदना खोल रहे हैं',
          pa: 'ਬੀਜ ਖਰੀਦਣਾ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'बीयाणे खरेदी उघडत आहे',
          ta: 'விதைகளை வாங்குவதை திறக்கிறது',
        },
      },
      {
        keywords: ['loan', 'ऋण', 'कर्ज', 'ਕਰਜ਼ਾ', 'कर्ज', 'கடன்'],
        action: () => navigate('/check-loans'),
        response: {
          en: 'Opening loan information',
          hi: 'ऋण जानकारी खोल रहे हैं',
          pa: 'ਕਰਜ਼ਾ ਜਾਣਕਾਰੀ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'कर्ज माहिती उघडत आहे',
          ta: 'கடன் தகவலை திறக்கிறது',
        },
      },
      {
        keywords: ['equipment', 'उपकरण', 'यंत्र', 'ਉਪਕਰਣ', 'उपकरणे', 'கருவிகள்'],
        action: () => navigate('/book-equipment'),
        response: {
          en: 'Opening equipment booking',
          hi: 'उपकरण बुकिंग खोल रहे हैं',
          pa: 'ਉਪਕਰਣ ਬੁੱਕਿੰਗ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'उपकरणे बुकिंग उघडत आहे',
          ta: 'கருவி முன்பதிவை திறக்கிறது',
        },
      },
      {
        keywords: ['admin', 'एडमिन', 'प्रशासक', 'ਐਡਮਿਨ', 'प्रशासक', 'நிர்வாகி'],
        action: () => navigate('/admin'),
        response: {
          en: 'Opening admin dashboard',
          hi: 'एडमिन डैशबोर्ड खोल रहे हैं',
          pa: 'ਐਡਮਿਨ ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹ ਰਹੇ ਹਾਂ',
          mr: 'प्रशासक डॅशबोर्ड उघडत आहे',
          ta: 'நிர்வாக டாஷ்போர்டை திறக்கிறது',
        },
      },
      
      // Action commands
      {
        keywords: ['close', 'बंद', 'band', 'ਬੰਦ', 'बंद', 'மூடு'],
        action: () => setIsOpen(false),
        response: {
          en: 'Closing voice assistant',
          hi: 'वॉयस असिस्टेंट बंद कर रहे हैं',
          pa: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ ਬੰਦ ਕਰ ਰਹੇ ਹਾਂ',
          mr: 'व्हॉइस असिस्टंट बंद करत आहे',
          ta: 'குரல் உதவியாளரை மூடுகிறது',
        },
      },
      {
        keywords: ['help', 'मदद', 'सहायता', 'ਮਦਦ', 'मदत', 'உதவி'],
        action: () => {},
        response: {
          en: 'You can say commands like: open dashboard, check weather, market prices, disease detection, or switch language',
          hi: 'आप कह सकते हैं: डैशबोर्ड खोलें, मौसम जांचें, बाजार मूल्य, रोग पहचान, या भाषा बदलें',
          pa: 'ਤੁਸੀਂ ਕਹਿ ਸਕਦੇ ਹੋ: ਡੈਸ਼ਬੋਰਡ ਖੋਲ੍ਹੋ, ਮੌਸਮ ਜਾਂਚੋ, ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ, ਰੋਗ ਪਛਾਣ, ਜਾਂ ਭਾਸ਼ਾ ਬਦਲੋ',
          mr: 'तुम्ही म्हणू शकता: डॅशबोर्ड उघडा, हवामान तपासा, बाजार किंमती, रोग ओळख, किंवा भाषा बदला',
          ta: 'நீங்கள் சொல்லலாம்: டாஷ்போர்டு திற, வானிலை சரிபார், சந்தை விலைகள், நோய் கண்டறிதல், அல்லது மொழி மாற்று',
        },
      },
      {
        keywords: ['back', 'पीछे', 'वापस', 'ਵਾਪਸ', 'मागे', 'பின்னால்'],
        action: () => window.history.back(),
        response: {
          en: 'Going back',
          hi: 'वापस जा रहे हैं',
          pa: 'ਵਾਪਸ ਜਾ ਰਹੇ ਹਾਂ',
          mr: 'मागे जात आहे',
          ta: 'பின்னால் செல்கிறது',
        },
      },
    ];

    // Find matching command
    let matchedCommand: CommandMap | null = null;
    for (const command of commands) {
      if (command.keywords.some(keyword => lowerText.includes(keyword))) {
        matchedCommand = command;
        break;
      }
    }

    if (matchedCommand) {
      const responseText = matchedCommand.response[language];
      setResponse(responseText);
      speak(responseText);
      matchedCommand.action();
      
      // Auto-close after navigation (except for help and close commands)
      if (!matchedCommand.keywords.includes('help') && !matchedCommand.keywords.includes('close')) {
        setTimeout(() => setIsOpen(false), 2000);
      }
    } else {
      // Try farming NLU engine before giving up
      const farmingResponse = handleFarmingQuery(lowerText);
      if (farmingResponse) {
        setResponse(farmingResponse);
        speak(farmingResponse);
      } else {
        // Smart clarifying question — never say "I don't understand"
        const clarify: Record<Language, string> = {
          en: 'Are you asking about your crop? Say: pest problem, water issue, market price, or government scheme.',
          hi: 'क्या आप फसल के बारे में पूछ रहे हैं? कीड़ा, पानी, मंडी भाव या सरकारी योजना बोलें।',
          pa: 'ਕੀ ਤੁਸੀਂ ਫਸਲ ਬਾਰੇ ਪੁੱਛ ਰਹੇ ਹੋ? ਕੀੜਾ, ਪਾਣੀ, ਮੰਡੀ ਭਾਅ ਜਾਂ ਸਰਕਾਰੀ ਯੋਜਨਾ ਦੱਸੋ।',
          mr: 'तुम्ही पिकाबद्दल विचारत आहात का? कीड, पाणी, मंडी भाव किंवा सरकारी योजना सांगा.',
          ta: 'நீங்கள் பயிர் பற்றி கேட்கிறீர்களா? பூச்சி, நீர், சந்தை விலை அல்லது அரசு திட்டம் சொல்லுங்கள்.',
        };
        setResponse(clarify[language]);
        speak(clarify[language]);
      }
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
            aria-label="Open Voice Assistant"
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
              className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-gradient-to-br from-purple-900 via-purple-800 to-pink-900 rounded-3xl shadow-2xl z-50 overflow-hidden max-h-[80vh] overflow-y-auto"
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
                  className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
                  aria-label="Close"
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

                {/* Permission Status */}
                {permissionStatus === 'granted' && !error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-500/20 backdrop-blur-xl rounded-2xl p-3 mb-4 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <p className="text-green-200 text-xs">
                      {language === 'en' && 'Microphone ready'}
                      {language === 'hi' && 'माइक्रोफोन तैयार है'}
                      {language === 'pa' && 'ਮਾਈਕ੍ਰੋਫੋਨ ਤਿਆਰ ਹੈ'}
                      {language === 'mr' && 'मायक्रोफोन तयार आहे'}
                      {language === 'ta' && 'மைக்ரோஃபோன் தயார்'}
                    </p>
                  </motion.div>
                )}

                {/* Microphone Button */}
                <div className="flex justify-center mb-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={isListening ? stopListening : startListening}
                    disabled={!isSupported}
                    className={`w-24 h-24 rounded-full flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500 shadow-[0_0_40px_rgba(239,68,68,0.8)]'
                        : isSupported
                        ? 'bg-white/20 backdrop-blur-xl hover:bg-white/30'
                        : 'bg-gray-500/20 cursor-not-allowed'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Start listening'}
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
                <div className="text-center mb-4 min-h-[24px]">
                  {isListening && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-white font-medium"
                    >
                      {t('voice.listening')}
                    </motion.p>
                  )}
                  {!isListening && !transcript && isSupported && (
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
                    <p className="text-sm text-purple-200 mb-1">
                      {language === 'en' && 'You said:'}
                      {language === 'hi' && 'आपने कहा:'}
                      {language === 'pa' && 'ਤੁਸੀਂ ਕਿਹਾ:'}
                      {language === 'mr' && 'तुम्ही म्हणालात:'}
                      {language === 'ta' && 'நீங்கள் சொன்னீர்கள்:'}
                    </p>
                    <p className="text-white font-medium">{transcript}</p>
                  </motion.div>
                )}

                {/* Response */}
                {response && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 flex items-start gap-3 mb-4"
                  >
                    <Volume2 className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
                    <p className="text-white">{response}</p>
                  </motion.div>
                )}

                {/* Voice Indicator */}
                {isListening && (
                  <div className="flex justify-center gap-1 mb-4">
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
                    className="bg-red-500/20 backdrop-blur-xl rounded-2xl p-4 mb-4"
                  >
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                      <p className="text-red-200 text-sm">{error}</p>
                    </div>
                  </motion.div>
                )}

                {/* Quick Tips */}
                {!transcript && !error && !isListening && (
                  <div className="text-center">
                    <p className="text-xs text-purple-300 mb-2">
                      {language === 'en' && 'Try saying:'}
                      {language === 'hi' && 'कहने की कोशिश करें:'}
                      {language === 'pa' && 'ਕਹਿਣ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ:'}
                      {language === 'mr' && 'म्हणण्याचा प्रयत्न करा:'}
                      {language === 'ta' && 'இதைச் சொல்ல முயற்சிக்கவும்:'}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {(language === 'en' ? ['dashboard', 'weather', 'market', 'help'] :
                        language === 'hi' ? ['डैशबोर्ड', 'मौसम', 'बाजार', 'मदद'] :
                        language === 'pa' ? ['ਡੈਸ਼ਬੋਰਡ', 'ਮੌਸਮ', 'ਬਾਜ਼ਾਰ', 'ਮਦਦ'] :
                        language === 'mr' ? ['डॅशबोर्ड', 'हवामान', 'बाजार', 'मदत'] :
                        ['டாஷ்போர்டு', 'வானிலை', 'சந்தை', 'உதவி']
                      ).map((cmd) => (
                        <span
                          key={cmd}
                          className="px-3 py-1.5 bg-white/10 backdrop-blur-xl rounded-lg text-xs text-white"
                        >
                          &quot;{cmd}&quot;
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
