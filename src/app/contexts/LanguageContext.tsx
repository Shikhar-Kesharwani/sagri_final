import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  en: {
    // Common
    'common.welcome': 'Welcome',
    'common.login': 'Login',
    'common.logout': 'Logout',
    'common.submit': 'Submit',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Navigation
    'nav.home': 'Home',
    'nav.features': 'Features',
    'nav.about': 'About Us',
    'nav.contact': 'Contact',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'Profile',
    
    // Home Page
    'home.title': 'SAGRI - Krishi Shayak',
    'home.subtitle': 'Your Intelligent Farming Assistant',
    'home.description': 'Empowering Indian farmers with AI-powered tools for crop disease detection, yield prediction, and smart farming solutions.',
    'home.cta': 'Get Started',
    'home.learnMore': 'Learn More',
    
    // Features
    'features.diseaseDetection': 'Disease Detection',
    'features.diseaseDesc': 'AI-powered crop disease identification',
    'features.yieldPrediction': 'Yield Prediction',
    'features.yieldDesc': 'Predict crop yield with ML',
    'features.priceForecasting': 'Price Forecasting',
    'features.priceDesc': 'Market price predictions',
    'features.recommendations': 'Smart Recommendations',
    'features.recommendDesc': 'Personalized farming advice',
    
    // Dashboard
    'dashboard.totalPredictions': 'Total Predictions',
    'dashboard.points': 'Points',
    'dashboard.activeToday': 'Active Today',
    'dashboard.quickActions': 'Quick Actions',
    'dashboard.recentActivity': 'Recent Activity',
    
    // Disease Detection
    'disease.title': 'Crop Disease Detection',
    'disease.upload': 'Upload crop image for analysis',
    'disease.analyzing': 'Analyzing image...',
    'disease.result': 'Analysis Result',
    'disease.confidence': 'Confidence',
    'disease.treatment': 'Recommended Treatment',
    
    // Voice Assistant
    'voice.listening': 'Listening...',
    'voice.speak': 'Speak Now',
    'voice.assistant': 'Voice Assistant',
    'voice.howCanIHelp': 'How can I help you today?',
    
    // Login
    'login.phone': 'Mobile Number',
    'login.enterPhone': 'Enter 10-digit mobile number',
    'login.sendOtp': 'Send OTP',
    'login.enterOtp': 'Enter OTP',
    'login.verifyOtp': 'Verify OTP',
    'login.selectRole': 'Select your role',
    'login.farmer': 'Farmer',
    'login.admin': 'Admin',
    'login.yourName': 'Your Name',
    'login.enterName': 'Enter your name',
    'login.completeLogin': 'Complete Login',
    
    // Community
    'community.title': 'Farmer Community',
    'community.share': 'Share your experience',
    'community.post': 'Post',
    'community.like': 'Like',
    'community.comment': 'Comment',
    
    // Market
    'market.prices': 'Market Prices',
    'market.location': 'Location',
    'market.price': 'Price',
    'market.change': 'Change',
    
    // Weather
    'weather.title': 'Weather Forecast',
    'weather.temperature': 'Temperature',
    'weather.humidity': 'Humidity',
    'weather.wind': 'Wind Speed',
    'weather.forecast': 'Forecast',
    
    // Farmer Dashboard
    'disease_detection': 'Disease Detection',
    'upload_crop_photo': 'Upload crop photo',
    'risk_prediction': 'Risk Prediction',
    'check_crop_failure_risk': 'Check crop failure risk',
    'price_forecast': 'Price Forecast',
    'future_price_trends': 'Future price trends',
    'crop_advice': 'Crop Advice',
    'smart_recommendations': 'Smart recommendations',
    'crop_calendar': 'Crop Calendar',
    'best_time_to_sow_harvest': 'Best time to sow/harvest',
    'weather': 'Weather',
    'live_weather_updates': 'Live weather updates',
    'market_price': 'Market Price',
    'compare_mandi_rates': 'Compare mandi rates',
    'community': 'Community',
    'connect_with_farmers': 'Connect with farmers',
    'expert_connect': 'Expert Connect',
    'chat_with_experts': 'Chat with experts',
    'govt_schemes': 'Govt Schemes',
    'subsidy_information': 'Subsidy information',
    'soil_health': 'Soil Health',
    'soil_test_reports': 'Soil test reports',
    'my_history': 'My History',
    'past_predictions': 'Past predictions',
    'heavy_rain_expected': 'Heavy rain expected in your area',
    'disease_outbreak_nearby_area': 'Disease outbreak in nearby area',
    'wheat_prices_rising': 'Wheat prices rising',
    'wheat_disease_check': 'Wheat Disease Check',
    'healthy': 'Healthy',
    'rice_price_forecast': 'Rice Price Forecast',
    'soil_health_report': 'Soil Health Report',
    'good_condition': 'Good Condition',
  },
  hi: {
    // Common - Hindi
    'common.welcome': 'स्वागत है',
    'common.login': 'लॉगिन',
    'common.logout': 'लॉगआउट',
    'common.submit': 'जमा करें',
    'common.cancel': 'रद्द करें',
    'common.save': 'सहेजें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफलता',
    
    // Navigation
    'nav.home': 'होम',
    'nav.features': 'सुविधाएं',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.dashboard': 'डैशबोर्ड',
    'nav.profile': 'प्रोफाइल',
    
    // Home Page
    'home.title': 'सागरी - कृषि सहायक',
    'home.subtitle': 'आपका बुद्धिमान कृषि सहायक',
    'home.description': 'भारतीय किसानों को फसल रोग पहचान, उपज भविष्यवाणी और स्मार्ट खेती समाधानों के लिए AI-संचालित उपकरणों से सशक्त बनाना।',
    'home.cta': 'शुरू करें',
    'home.learnMore': 'और जानें',
    
    // Features
    'features.diseaseDetection': 'रोग पहचान',
    'features.diseaseDesc': 'AI-संचालित फसल रोग पहचान',
    'features.yieldPrediction': 'उपज भविष्यवाणी',
    'features.yieldDesc': 'ML के साथ फसल उपज की भविष्यवाणी',
    'features.priceForecasting': 'मूल्य पूर्वानुमान',
    'features.priceDesc': 'बाजार मूल्य पूर्वानुमान',
    'features.recommendations': 'स्मार्ट सुझाव',
    'features.recommendDesc': 'व्यक्तिगत कृषि सलाह',
    
    // Dashboard
    'dashboard.totalPredictions': 'कुल भविष्यवाणियां',
    'dashboard.points': 'अंक',
    'dashboard.activeToday': 'आज सक्रिय',
    'dashboard.quickActions': 'त्वरित क्रियाएं',
    'dashboard.recentActivity': 'हाल की गतिविधि',
    
    // Disease Detection
    'disease.title': 'फसल रोग पहचान',
    'disease.upload': 'विश्लेषण के लिए फसल छवि अपलोड करें',
    'disease.analyzing': 'छवि का विश्लेषण...',
    'disease.result': 'विश्लेषण परिणाम',
    'disease.confidence': 'विश्वास',
    'disease.treatment': 'अनुशंसित उपचार',
    
    // Voice Assistant
    'voice.listening': 'सुन रहे हैं...',
    'voice.speak': 'अब बोलें',
    'voice.assistant': 'वॉयस असिस्टेंट',
    'voice.howCanIHelp': 'मैं आज आपकी कैसे मदद कर सकता हूं?',
    
    // Login
    'login.phone': 'मोबाइल नंबर',
    'login.enterPhone': '10 अंकों का मोबाइल नंबर दर्ज करें',
    'login.sendOtp': 'OTP भेजें',
    'login.enterOtp': 'OTP दर्ज करें',
    'login.verifyOtp': 'OTP सत्यापित करें',
    'login.selectRole': 'अपनी भूमिका चुनें',
    'login.farmer': 'किसान',
    'login.admin': 'एडमिन',
    'login.yourName': 'आपका नाम',
    'login.enterName': 'अपना नाम दर्ज करें',
    'login.completeLogin': 'लॉगिन पूरा करें',
    
    // Community
    'community.title': 'किसान समुदाय',
    'community.share': 'अपना अनुभव साझा करें',
    'community.post': 'पोस्ट',
    'community.like': 'पसंद',
    'community.comment': 'टिप्पणी',
    
    // Market
    'market.prices': 'बाजार मूल्य',
    'market.location': 'स्थान',
    'market.price': 'मूल्य',
    'market.change': 'परिवर्तन',
    
    // Weather
    'weather.title': 'मौसम पूर्वानुमान',
    'weather.temperature': 'तापमान',
    'weather.humidity': 'आर्द्रता',
    'weather.wind': 'हवा की गति',
    'weather.forecast': 'पूर्वानुमान',
    
    // Farmer Dashboard
    'disease_detection': 'रोग पहचान',
    'upload_crop_photo': 'फसल फोटो अपलोड करें',
    'risk_prediction': 'रिस्क पूर्वानुमान',
    'check_crop_failure_risk': 'फसल विफलता रिस्क जांचें',
    'price_forecast': 'मूल्य पूर्वानुमान',
    'future_price_trends': 'विशेष भविष्यवाणी ट्रेंड्स',
    'crop_advice': 'फसल सलाह',
    'smart_recommendations': 'स्मार्ट सुझाव',
    'crop_calendar': 'फसल कैलेंडर',
    'best_time_to_sow_harvest': 'बेस्ट टाइम सात/हर्वेस्ट',
    'weather': 'मौसम',
    'live_weather_updates': 'वास्तविक मौसम अपडेट्स',
    'market_price': 'बाजार मूल्य',
    'compare_mandi_rates': 'मंडी दर्जाओं की तुलना करें',
    'community': 'समुदाय',
    'connect_with_farmers': 'किसानों से जुड़ें',
    'expert_connect': 'विशेषज्ञ संबंध',
    'chat_with_experts': 'विशेषज्ञों से चैट करें',
    'govt_schemes': 'सरकारी योजनाएं',
    'subsidy_information': 'सब्सिडी माहिती',
    'soil_health': 'पृथक्षिति स्वास्थ्य',
    'soil_test_reports': 'पृथक्षिति परीक्षण रिपोर्ट्स',
    'my_history': 'मेरा इतिहास',
    'past_predictions': 'पिछली भविष्यवाणियां',
    'heavy_rain_expected': 'आपके क्षेत्र में भारी बारिश की अपेक्षा',
    'disease_outbreak_nearby_area': 'आसपास क्षेत्र में रोग आंदोलन',
    'wheat_prices_rising': 'गहना दाल की मूल्य बढ़ रही है',
    'wheat_disease_check': 'गहना दाल की रोग जांच',
    'healthy': 'स्वास्थ्यपूर्ण',
    'rice_price_forecast': 'चावल की मूल्य पूर्वानुमान',
    'soil_health_report': 'पृथक्षिति स्वास्थ्य रिपोर्ट',
    'good_condition': 'अच्छी स्थिति',
  },
  pa: {
    // Common - Punjabi
    'common.welcome': 'ਸਵਾਗਤ ਹੈ',
    'common.login': 'ਲਾਗਇਨ',
    'common.logout': 'ਲਾਗਆਉਟ',
    'common.submit': 'ਜਮ੍ਹਾਂ ਕਰੋ',
    'common.cancel': 'ਰੱਦ ਕਰੋ',
    'common.save': 'ਸੁਰੱਖਿਅਤ ਕਰੋ',
    'common.delete': 'ਮਿਟਾਓ',
    'common.edit': 'ਸੋਧੋ',
    'common.loading': 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    'common.error': 'ਗਲਤੀ',
    'common.success': 'ਸਫਲਤਾ',
    
    // Navigation
    'nav.home': 'ਹੋਮ',
    'nav.features': 'ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ',
    'nav.about': 'ਸਾਡੇ ਬਾਰੇ',
    'nav.contact': 'ਸੰਪਰਕ',
    'nav.dashboard': 'ਡੈਸ਼ਬੋਰਡ',
    'nav.profile': 'ਪ੍ਰੋਫਾਈਲ',
    
    // Home Page
    'home.title': 'ਸਾਗਰੀ - ਕ੍ਰਿਸ਼ੀ ਸਹਾਇਕ',
    'home.subtitle': 'ਤੁਹਾਡਾ ਬੁੱਧੀਮਾਨ ਖੇਤੀਬਾੜੀ ਸਹਾਇਕ',
    'home.description': 'ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਨੂੰ ਫਸਲ ਬਿਮਾਰੀ ਪਛਾਣ, ਉਪਜ ਭਵਿੱਖਬਾਣੀ ਅਤੇ ਸਮਾਰਟ ਖੇਤੀ ਹੱਲਾਂ ਲਈ AI-ਸੰਚਾਲਿਤ ਸਾਧਨਾਂ ਨਾਲ ਸ਼ਕਤੀ ਪ੍ਰਦਾਨ ਕਰਨਾ।',
    'home.cta': 'ਸ਼ੁਰੂ ਕਰੋ',
    'home.learnMore': 'ਹੋਰ ਜਾਣੋ',
    
    // Features
    'features.diseaseDetection': 'ਰੋਗ ਪਛਾਣ',
    'features.diseaseDesc': 'AI-ਸੰਚਾਲਿਤ ਫਸਲ ਰੋਗ ਪਛਾਣ',
    'features.yieldPrediction': 'ਉਪਜ ਭਵਿੱਖਬਾਣੀ',
    'features.yieldDesc': 'ML ਨਾਲ ਫਸਲ ਉਪਜ ਦੀ ਭਵਿੱਖਬਾਣੀ',
    'features.priceForecasting': 'ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'features.priceDesc': 'ਬਾਜ਼ਾਰ ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'features.recommendations': 'ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ',
    'features.recommendDesc': 'ਵਿਅਕਤੀਗਤ ਖੇਤੀਬਾੜੀ ਸਲਾਹ',
    
    // Dashboard
    'dashboard.totalPredictions': 'ਕੁੱਲ ਭਵਿੱਖਬਾਣੀਆਂ',
    'dashboard.points': 'ਅੰਕ',
    'dashboard.activeToday': 'ਅੱਜ ਸਰਗਰਮ',
    'dashboard.quickActions': 'ਤੇਜ਼ ਕਾਰਵਾਈਆਂ',
    'dashboard.recentActivity': 'ਹਾਲੀਆ ਗਤੀਵਿਧੀ',
    
    // Disease Detection
    'disease.title': 'ਫਸਲ ਰੋਗ ਪਛਾਣ',
    'disease.upload': 'ਵਿਸ਼ਲੇਸ਼ਣ ਲਈ ਫਸਲ ਚਿੱਤਰ ਅੱਪਲੋਡ ਕਰੋ',
    'disease.analyzing': 'ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ...',
    'disease.result': 'ਵਿਸ਼ਲੇਸ਼ਣ ਨਤੀਜਾ',
    'disease.confidence': 'ਵਿਸ਼ਵਾਸ',
    'disease.treatment': 'ਸਿਫਾਰਸ਼ ਕੀਤਾ ਇਲਾਜ',
    
    // Voice Assistant
    'voice.listening': 'ਸੁਣ ਰਿਹਾ ਹੈ...',
    'voice.speak': 'ਹੁਣ ਬੋਲੋ',
    'voice.assistant': 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ',
    'voice.howCanIHelp': 'ਮੈਂ ਅੱਜ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?',
    
    // Login
    'login.phone': 'ਮੋਬਾਈਲ ਨੰਬਰ',
    'login.enterPhone': '10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ ਦਾਖਲ ਕਰੋ',
    'login.sendOtp': 'OTP ਭੇਜੋ',
    'login.enterOtp': 'OTP ਦਾਖਲ ਕਰੋ',
    'login.verifyOtp': 'OTP ਪ੍ਰਮਾਣਿਤ ਕਰੋ',
    'login.selectRole': 'ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    'login.farmer': 'ਕਿਸਾਨ',
    'login.admin': 'ਐਡਮਿਨ',
    'login.yourName': 'ਤੁਹਾਡਾ ਨਾਮ',
    'login.enterName': 'ਆਪਣਾ ਨਾਮ ਦਾਖਲ ਕਰੋ',
    'login.completeLogin': 'ਲਾਗਇਨ ਪੂਰਾ ਕਰੋ',
    
    // Community
    'community.title': 'ਕਿਸਾਨ ਭਾਈਚਾਰਾ',
    'community.share': 'ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ',
    'community.post': 'ਪੋਸਟ',
    'community.like': 'ਪਸੰਦ',
    'community.comment': 'ਟਿੱਪਣੀ',
    
    // Market
    'market.prices': 'ਬਾਜ਼ਾਰ ਕੀਮਤਾਂ',
    'market.location': 'ਸਥਾਨ',
    'market.price': 'ਕੀਮਤ',
    'market.change': 'ਤਬਦੀਲੀ',
    
    // Weather
    'weather.title': 'ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'weather.temperature': 'ਤਾਪਮਾਨ',
    'weather.humidity': 'ਨਮੀ',
    'weather.wind': 'ਹਵਾ ਦੀ ਗਤੀ',
    'weather.forecast': 'ਪੂਰਵ-ਅਨੁਮਾਨ',
    
    // Farmer Dashboard
    'disease_detection': 'ਰੋਗ ਪਛਾਣ',
    'upload_crop_photo': 'ਫਸਲ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    'risk_prediction': 'ਰਿਸਕ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'check_crop_failure_risk': 'ਫਸਲ ਵਿਫਲਤਾ ਰਿਸਕ ਜਾਂਚੋ',
    'price_forecast': 'ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'future_price_trends': 'ਭਵਿੱਖਬਾਣੀ ਟਰੈਂਡਸ',
    'crop_advice': 'ਫਸਲ ਸਲਾਹ',
    'smart_recommendations': 'ਸਮਾਰਟ ਸਿਫਾਰਸ਼ਾਂ',
    'crop_calendar': 'ਫਸਲ ਕੈਲੈੰਡਰ',
    'best_time_to_sow_harvest': 'ਸਾਤ/ਹਰਵੇਸਟ ਲਈ ਬੇਸਟ ਟਾਇਮ',
    'weather': 'ਮੌਸਮ',
    'live_weather_updates': 'ਵਾਸਤਵਿਕ ਮੌਸਮ ਅਪਡੇਟਾਂ',
    'market_price': 'ਬਾਜ਼ਾਰ ਕੀਮਤ',
    'compare_mandi_rates': 'ਮੰਡੀ ਦਰਤੀਆਂ ਨੂੰ ਤੁਲਨਾ ਕਰੋ',
    'community': 'ਸਮਾਇਸ਼ਤਰ',
    'connect_with_farmers': 'ਕਿਸਾਨਾਂ ਨਾਲ ਜੁੜੋ',
    'expert_connect': 'ਵਿਸ਼ੇਸ਼ਜਨ ਸੰਬੰਧ',
    'chat_with_experts': 'ਵਿਸ਼ੇਸ਼ਜਨਾਂ ਨਾਲ ਚੈਟ ਕਰੋ',
    'govt_schemes': 'ਸਰਕਾਰੀ ਯੋਜਨਾਵਾਂ',
    'subsidy_information': 'ਸਬਸਿਡੀ ਮਾਹਿਤੀ',
    'soil_health': 'ਪ੍ਰਥਿਵੀ ਸਵਾਸਥਿਯਾ',
    'soil_test_reports': 'ਪ੍ਰਥਿਵੀ ਪਰਿਕਸਾ ਰਿਪੋਰਟਾਂ',
    'my_history': 'ਮੇਰਾ ਇਤਿਹਾਸ',
    'past_predictions': 'ਪਿਛਲੀਆਂ ਭਵਿੱਖਬਾਣੀਆਂ',
    'heavy_rain_expected': 'ਤੁਹਾਡੇ ਕ੍ਰਿਸ਼ੀ ਕ੍ਰਿਆਲਾਈ ਵਿਚ ਭਾਰੀ ਬਾਰਿਸ਼ ਦੀ ਅਪੇਕਸ਼ਾ',
    'disease_outbreak_nearby_area': 'ਨਿਕਲ ਵਿਚ ਰੋਗ ਆਂਦੋਲਨ',
    'wheat_prices_rising': 'ਗਹਨਾ ਦਾਲ ਦੀਆਂ ਕੀਮਤਾਂ ਬਾਢ਼ ਰਹੀਆਂ ਹਨ',
    'wheat_disease_check': 'ਗਹਨਾ ਦਾਲ ਰੋਗ ਜਾਂਚ',
    'healthy': 'ਸਵਾਸਥਿਯਾਲੂ',
    'rice_price_forecast': 'ਚਾਵਲ ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'soil_health_report': 'ਪ੍ਰਥਿਵੀ ਸਵਾਸਥਿਯਾ ਰਿਪੋਰਟ',
    'good_condition': 'ਅਚੰਨ ਸਥਿਤੀ',
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('sagri-language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = useCallback((lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('sagri-language', lang);
  }, []);

  const t = useCallback((key: string): string => {
    const translation = translations[language][key as keyof typeof translations['en']];
    if (translation) return translation;
    
    // If key not found, return the key itself instead of undefined
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Translation key not found: "${key}" for language: "${language}"`);
    }
    return key;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage: handleSetLanguage, t }),
    [language, handleSetLanguage, t]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}