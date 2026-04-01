import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';

export type Language = 'en' | 'hi' | 'pa' | 'mr' | 'ta';

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
    'marketplace_services': 'Marketplace & Services',
    'sell_crops': 'Sell Crops',
    'sell_crops_desc': 'List your produce & connect with buyers',
    'get_best_price': 'Get Best Price',
    'buy_seeds': 'Buy Seeds',
    'buy_seeds_desc': 'Certified quality seeds from trusted brands',
    'browse_seeds': 'Browse Seeds',
    'check_loans': 'Check Loans',
    'check_loans_desc': 'Compare agricultural loan schemes',
    'view_schemes': 'View Schemes',
    'rent_equipment': 'Rent Equipment',
    'rent_equipment_desc': 'Book tractors & farming machinery',
    'book_now': 'Book Now',
    'weather_forecast': 'Weather Forecast',
    'partly_cloudy': 'Partly Cloudy',
    'humidity': 'Humidity',
    'wind_speed_label': 'Wind Speed',
    'rain_chance': 'Rain Chance',
    'alerts': 'Alerts',
    'soil_health_analytics': 'Soil Health Analytics',
    'market_price_trends': 'Market Price Trends',
    'todays_tasks': "Today's Tasks",
    'pending': 'pending',
    'open_feature': 'Open',
    'greeting_morning': 'Good Morning',
    'greeting_afternoon': 'Good Afternoon',
    'greeting_evening': 'Good Evening',
    'farm_looking_great': 'Your farm is looking great today!',
    'land_size': 'Land Size',
    'active_crops': 'Active Crops',
    'yield_prediction': 'Yield Prediction',
    'health_score': 'Health Score',
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
    'marketplace_services': 'मार्केटप्लेस और सेवाएं',
    'sell_crops': 'फसल बेचें',
    'sell_crops_desc': 'अपनी उपज सूचीबद्ध करें और खरीदारों से जुड़ें',
    'get_best_price': 'सर्वोत्तम मूल्य पाएं',
    'buy_seeds': 'बीज खरीदें',
    'buy_seeds_desc': 'विश्वसनीय ब्रांडों से प्रमाणित बीज',
    'browse_seeds': 'बीज देखें',
    'check_loans': 'कृषि ऋण देखें',
    'check_loans_desc': 'कृषि ऋण योजनाओं की तुलना करें',
    'view_schemes': 'योजनाएं देखें',
    'rent_equipment': 'उपकरण किराए पर लें',
    'rent_equipment_desc': 'ट्रैक्टर और कृषि मशीनरी बुक करें',
    'book_now': 'अभी बुक करें',
    'weather_forecast': 'मौसम पूर्वानुमान',
    'partly_cloudy': 'आंशिक रूप से बादल',
    'humidity': 'आर्द्रता',
    'wind_speed_label': 'हवा की गति',
    'rain_chance': 'बारिश की संभावना',
    'alerts': 'अलर्ट',
    'soil_health_analytics': 'मिट्टी स्वास्थ्य विश्लेषण',
    'market_price_trends': 'बाजार मूल्य रुझान',
    'todays_tasks': 'आज के कार्य',
    'pending': 'बाकी',
    'open_feature': 'खोलें',
    'greeting_morning': 'सुप्रभात',
    'greeting_afternoon': 'नमस्ते',
    'greeting_evening': 'शुभ संध्या',
    'farm_looking_great': 'आपका खेत आज बहुत अच्छा लग रहा है!',
    'land_size': 'भूमि का आकार',
    'active_crops': 'सक्रिय फसलें',
    'yield_prediction': 'उपज पूर्वानुमान',
    'health_score': 'स्वास्थ्य स्कोर',
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
    'marketplace_services': 'ਮਾਰਕੀਟਪਲੇਸ ਅਤੇ ਸੇਵਾਵਾਂ',
    'sell_crops': 'ਫਸਲ ਵੇਚੋ',
    'sell_crops_desc': 'ਆਪਣੀ ਉਪਜ ਸੂਚੀਬੱਧ ਕਰੋ ਅਤੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੁੜੋ',
    'get_best_price': 'ਵਧੀਆ ਮੁੱਲ ਪਾਓ',
    'buy_seeds': 'ਬੀਜ ਖਰੀਦੋ',
    'buy_seeds_desc': 'ਭਰੋਸੇਯੋਗ ਬ੍ਰਾਂਡਾਂ ਤੋਂ ਪ੍ਰਮਾਣਿਤ ਬੀਜ',
    'browse_seeds': 'ਬੀਜ ਦੇਖੋ',
    'check_loans': 'ਕਰਜ਼ੇ ਦੇਖੋ',
    'check_loans_desc': 'ਖੇਤੀ ਕਰਜ਼ਾ ਯੋਜਨਾਵਾਂ ਦੀ ਤੁਲਨਾ ਕਰੋ',
    'view_schemes': 'ਯੋਜਨਾਵਾਂ ਦੇਖੋ',
    'rent_equipment': 'ਉਪਕਰਣ ਕਿਰਾਏ ਤੇ ਲਓ',
    'rent_equipment_desc': 'ਟਰੈਕਟਰ ਅਤੇ ਖੇਤੀ ਮਸ਼ੀਨਰੀ ਬੁੱਕ ਕਰੋ',
    'book_now': 'ਹੁਣੇ ਬੁੱਕ ਕਰੋ',
    'weather_forecast': 'ਮੌਸਮ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'partly_cloudy': 'ਅੰਸ਼ਕ ਤੌਰ ਤੇ ਬੱਦਲੀ',
    'humidity': 'ਨਮੀ',
    'wind_speed_label': 'ਹਵਾ ਦੀ ਗਤੀ',
    'rain_chance': 'ਮੀਂਹ ਦੀ ਸੰਭਾਵਨਾ',
    'alerts': 'ਅਲਰਟ',
    'soil_health_analytics': 'ਮਿੱਟੀ ਸਿਹਤ ਵਿਸ਼ਲੇਸ਼ਣ',
    'market_price_trends': 'ਬਾਜ਼ਾਰ ਕੀਮਤ ਰੁਝਾਨ',
    'todays_tasks': 'ਅੱਜ ਦੇ ਕੰਮ',
    'pending': 'ਬਾਕੀ',
    'open_feature': 'ਖੋਲ੍ਹੋ',
    'greeting_morning': 'ਸ਼ੁਭ ਸਵੇਰ',
    'greeting_afternoon': 'ਨਮਸਕਾਰ',
    'greeting_evening': 'ਸ਼ੁਭ ਸੰਧਿਆ',
    'farm_looking_great': 'ਤੁਹਾਡਾ ਖੇਤ ਅੱਜ ਬਹੁਤ ਵਧੀਆ ਲੱਗ ਰਿਹਾ ਹੈ!',
    'land_size': 'ਜ਼ਮੀਨ ਦਾ ਆਕਾਰ',
    'active_crops': 'ਸਰਗਰਮ ਫਸਲਾਂ',
    'yield_prediction': 'ਉਪਜ ਪੂਰਵ-ਅਨੁਮਾਨ',
    'health_score': 'ਸਿਹਤ ਸਕੋਰ',
  },
  mr: {
    // Common - Marathi
    'common.welcome': 'स्वागत आहे',
    'common.login': 'लॉगिन',
    'common.logout': 'लॉगआउट',
    'common.submit': 'सबमिट करा',
    'common.cancel': 'रद्द करा',
    'common.save': 'जतन करा',
    'common.delete': 'हटवा',
    'common.edit': 'संपादन करा',
    'common.loading': 'लोड होत आहे...',
    'common.error': 'त्रुटी',
    'common.success': 'यशस्वी',
    
    // Navigation
    'nav.home': 'होम',
    'nav.features': 'वैशिष्ट्ये',
    'nav.about': 'आमच्याबद्दल',
    'nav.contact': 'संपर्क',
    'nav.dashboard': 'डॅशबोर्ड',
    'nav.profile': 'प्रोफाइल',
    
    // Home Page
    'home.title': 'सागरी - कृषी सहाय्यक',
    'home.subtitle': 'तुमचा बुद्धिमान शेती सहाय्यक',
    'home.description': 'भारतीय शेतकऱ्यांना पीक रोग ओळख, उत्पन्न अंदाज आणि स्मार्ट शेती उपायांसाठी AI-संचालित साधनांसह सशक्त करणे.',
    'home.cta': 'सुरू करा',
    'home.learnMore': 'अधिक जाणून घ्या',
    
    // Features
    'features.diseaseDetection': 'रोग ओळख',
    'features.diseaseDesc': 'AI-संचालित पीक रोग ओळख',
    'features.yieldPrediction': 'उत्पन्न अंदाज',
    'features.yieldDesc': 'ML सह पीक उत्पन्नाचा अंदाज',
    'features.priceForecasting': 'किंमत अंदाज',
    'features.priceDesc': 'बाजार किंमत अंदाज',
    'features.recommendations': 'स्मार्ट शिफारसी',
    'features.recommendDesc': 'वैयक्तिक शेती सल्ला',
    
    // Dashboard
    'dashboard.totalPredictions': 'एकूण अंदाज',
    'dashboard.points': 'गुण',
    'dashboard.activeToday': 'आज सक्रिय',
    'dashboard.quickActions': 'जलद क्रिया',
    'dashboard.recentActivity': 'अलीकडील क्रियाकलाप',
    
    // Disease Detection
    'disease.title': 'पीक रोग ओळख',
    'disease.upload': 'विश्लेषणासाठी पीक प्रतिमा अपलोड करा',
    'disease.analyzing': 'प्रतिमा विश्लेषण करत आहे...',
    'disease.result': 'विश्लेषण परिणाम',
    'disease.confidence': 'विश्वास',
    'disease.treatment': 'शिफारस केलेले उपचार',
    
    // Voice Assistant
    'voice.listening': 'ऐकत आहे...',
    'voice.speak': 'आता बोला',
    'voice.assistant': 'व्हॉइस असिस्टंट',
    'voice.howCanIHelp': 'मी आज तुमची कशी मदत करू शकतो?',
    
    // Login
    'login.phone': 'मोबाइल नंबर',
    'login.enterPhone': '10 अंकी मोबाइल नंबर प्रविष्ट करा',
    'login.sendOtp': 'OTP पाठवा',
    'login.enterOtp': 'OTP प्रविष्ट करा',
    'login.verifyOtp': 'OTP सत्यापित करा',
    'login.selectRole': 'तुमची भूमिका निवडा',
    'login.farmer': 'शेतकरी',
    'login.admin': 'प्रशासक',
    'login.yourName': 'तुमचे नाव',
    'login.enterName': 'तुमचे नाव प्रविष्ट करा',
    'login.completeLogin': 'लॉगिन पूर्ण करा',
    
    // Community
    'community.title': 'शेतकरी समुदाय',
    'community.share': 'तुमचा अनुभव शेअर करा',
    'community.post': 'पोस्ट',
    'community.like': 'आवडले',
    'community.comment': 'टिप्पणी',
    
    // Market
    'market.prices': 'बाजार किंमती',
    'market.location': 'स्थान',
    'market.price': 'किंमत',
    'market.change': 'बदल',
    
    // Weather
    'weather.title': 'हवामान अंदाज',
    'weather.temperature': 'तापमान',
    'weather.humidity': 'आर्द्रता',
    'weather.wind': 'वारा वेग',
    'weather.forecast': 'अंदाज',
    
    // Farmer Dashboard
    'disease_detection': 'रोग ओळख',
    'upload_crop_photo': 'पीक फोटो अपलोड करा',
    'risk_prediction': 'जोखीम अंदाज',
    'check_crop_failure_risk': 'पीक अपयश जोखीम तपासा',
    'price_forecast': 'किंमत अंदाज',
    'future_price_trends': 'भविष्यातील किंमत ट्रेंड',
    'crop_advice': 'पीक सल्ला',
    'smart_recommendations': 'स्मार्ट शिफारसी',
    'crop_calendar': 'पीक दिनदर्शिका',
    'best_time_to_sow_harvest': 'पेरणी/कापणीचा सर्वोत्तम वेळ',
    'weather': 'हवामान',
    'live_weather_updates': 'थेट हवामान अपडेट',
    'market_price': 'बाजार किंमत',
    'compare_mandi_rates': 'मंडी दरांची तुलना करा',
    'community': 'समुदाय',
    'connect_with_farmers': 'शेतकऱ्यांशी संपर्क साधा',
    'expert_connect': 'तज्ञ संपर्क',
    'chat_with_experts': 'तज्ञांशी चॅट करा',
    'govt_schemes': 'सरकारी योजना',
    'subsidy_information': 'अनुदान माहिती',
    'soil_health': 'माती आरोग्य',
    'soil_test_reports': 'माती चाचणी अहवाल',
    'my_history': 'माझा इतिहास',
    'past_predictions': 'मागील अंदाज',
    'heavy_rain_expected': 'तुमच्या क्षेत्रात मुसळधार पाऊस अपेक्षित',
    'disease_outbreak_nearby_area': 'जवळच्या भागात रोग उद्रेक',
    'wheat_prices_rising': 'गहू किंमती वाढत आहेत',
    'wheat_disease_check': 'गहू रोग तपासणी',
    'healthy': 'निरोगी',
    'rice_price_forecast': 'तांदूळ किंमत अंदाज',
    'soil_health_report': 'माती आरोग्य अहवाल',
    'good_condition': 'चांगली स्थिती',
  },
  ta: {
    // Common - Tamil
    'common.welcome': 'வரவேற்கிறோம்',
    'common.login': 'உள்நுழைவு',
    'common.logout': 'வெளியேறு',
    'common.submit': 'சமர்ப்பிக்கவும்',
    'common.cancel': 'ரத்துசெய்',
    'common.save': 'சேமி',
    'common.delete': 'நீக்கு',
    'common.edit': 'திருத்து',
    'common.loading': 'ஏற்றுகிறது...',
    'common.error': 'பிழை',
    'common.success': 'வெற்றி',
    
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.features': 'அம்சங்கள்',
    'nav.about': 'எங்களை பற்றி',
    'nav.contact': 'தொடர்பு',
    'nav.dashboard': 'டாஷ்போர்டு',
    'nav.profile': 'சுயவிவரம்',
    
    // Home Page
    'home.title': 'சாக்ரி - கிருஷி சஹாயக்',
    'home.subtitle': 'உங்கள் புத்திசாலி விவசாய உதவியாளர்',
    'home.description': 'இந்திய விவசாயிகளுக்கு பயிர் நோய் கண்டறிதல், விளைச்சல் கணிப்பு மற்றும் ஸ்மார்ட் விவசாய தீர்வுகளுக்கான AI-இயங்கும் கருவிகளுடன் அதிகாரமளித்தல்.',
    'home.cta': 'தொடங்கு',
    'home.learnMore': 'மேலும் அறிக',
    
    // Features
    'features.diseaseDetection': 'நோய் கண்டறிதல்',
    'features.diseaseDesc': 'AI-இயங்கும் பயிர் நோய் அடையாளம்',
    'features.yieldPrediction': 'விளைச்சல் கணிப்பு',
    'features.yieldDesc': 'ML உடன் பயிர் விளைச்சல் கணிப்பு',
    'features.priceForecasting': 'விலை முன்னறிவிப்பு',
    'features.priceDesc': 'சந்தை விலை கணிப்புகள்',
    'features.recommendations': 'ஸ்மார்ட் பரிந்துரைகள்',
    'features.recommendDesc': 'தனிப்பயனாக்கப்பட்ட விவசாய ஆலோசனை',
    
    // Dashboard
    'dashboard.totalPredictions': 'மொத்த கணிப்புகள்',
    'dashboard.points': 'புள்ளிகள்',
    'dashboard.activeToday': 'இன்று செயலில்',
    'dashboard.quickActions': 'விரைவு செயல்கள்',
    'dashboard.recentActivity': 'சமீபத்திய செயல்பாடு',
    
    // Disease Detection
    'disease.title': 'பயிர் நோய் கண்டறிதல்',
    'disease.upload': 'பகுப்பாய்வுக்கான பயிர் படத்தை பதிவேற்றவும்',
    'disease.analyzing': 'படம் பகுப்பாய்வு செய்கிறது...',
    'disease.result': 'பகுப்பாய்வு முடிவு',
    'disease.confidence': 'நம்பிக்கை',
    'disease.treatment': 'பரிந்துரைக்கப்பட்ட சிகிச்சை',
    
    // Voice Assistant
    'voice.listening': 'கேட்கிறது...',
    'voice.speak': 'இப்போது பேசுங்கள்',
    'voice.assistant': 'குரல் உதவியாளர்',
    'voice.howCanIHelp': 'இன்று நான் உங்களுக்கு எப்படி உதவ முடியும்?',
    
    // Login
    'login.phone': 'மொபைல் எண்',
    'login.enterPhone': '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்',
    'login.sendOtp': 'OTP அனுப்பு',
    'login.enterOtp': 'OTP உள்ளிடவும்',
    'login.verifyOtp': 'OTP சரிபார்க்கவும்',
    'login.selectRole': 'உங்கள் பங்கை தேர்ந்தெடுக்கவும்',
    'login.farmer': 'விவசாயி',
    'login.admin': 'நிர்வாகி',
    'login.yourName': 'உங்கள் பெயர்',
    'login.enterName': 'உங்கள் பெயரை உள்ளிடவும்',
    'login.completeLogin': 'உள்நுழைவை முடிக்கவும்',
    
    // Community
    'community.title': 'விவசாயி சமூகம்',
    'community.share': 'உங்கள் அனுபவத்தை பகிரவும்',
    'community.post': 'இடுகை',
    'community.like': 'விருப்பம்',
    'community.comment': 'கருத்து',
    
    // Market
    'market.prices': 'சந்தை விலைகள்',
    'market.location': 'இடம்',
    'market.price': 'விலை',
    'market.change': 'மாற்றம்',
    
    // Weather
    'weather.title': 'வானிலை முன்னறிவிப்பு',
    'weather.temperature': 'வெப்பநிலை',
    'weather.humidity': 'ஈரப்பதம்',
    'weather.wind': 'காற்றின் வேகம்',
    'weather.forecast': 'முன்னறிவிப்பு',
    
    // Farmer Dashboard
    'disease_detection': 'நோய் கண்டறிதல்',
    'upload_crop_photo': 'பயிர் புகைப்படத்தை பதிவேற்றவும்',
    'risk_prediction': 'ஆபத்து கணிப்பு',
    'check_crop_failure_risk': 'பயிர் தோல்வி அபாயத்தை சரிபார்க்கவும்',
    'price_forecast': 'விலை முன்னறிவிப்பு',
    'future_price_trends': 'எதிர்கால விலை போக்குகள்',
    'crop_advice': 'பயிர் ஆலோசனை',
    'smart_recommendations': 'ஸ்மார்ட் பரிந்துரைகள்',
    'crop_calendar': 'பயிர் நாட்காட்டி',
    'best_time_to_sow_harvest': 'விதைப்பு/அறுவடைக்கான சிறந்த நேரம்',
    'weather': 'வானிலை',
    'live_weather_updates': 'நேரடி வானிலை புதுப்பிப்புகள்',
    'market_price': 'சந்தை விலை',
    'compare_mandi_rates': 'மண்டி விலைகளை ஒப்பிடுக',
    'community': 'சமூகம்',
    'connect_with_farmers': 'விவசாயிகளுடன் இணைக்கவும்',
    'expert_connect': 'நிபுணர் இணைப்பு',
    'chat_with_experts': 'நிபுணர்களுடன் அரட்டை',
    'govt_schemes': 'அரசு திட்டங்கள்',
    'subsidy_information': 'மானியம் தகவல்',
    'soil_health': 'மண் ஆரோக்கியம்',
    'soil_test_reports': 'மண் சோதனை அறிக்கைகள்',
    'my_history': 'எனது வரலாறு',
    'past_predictions': 'கடந்த கணிப்புகள்',
    'heavy_rain_expected': 'உங்கள் பகுதியில் பலத்த மழை எதிர்பார்க்கப்படுகிறது',
    'disease_outbreak_nearby_area': 'அருகிலுள்ள பகுதியில் நோய் பரவல்',
    'wheat_prices_rising': 'கோதுமை விலைகள் உயர்ந்து வருகின்றன',
    'wheat_disease_check': 'கோதுமை நோய் சோதனை',
    'healthy': 'ஆரோக்கியமான',
    'rice_price_forecast': 'அரிசி விலை முன்னறிவிப்பு',
    'soil_health_report': 'மண் ஆரோக்கிய அறிக்கை',
    'good_condition': 'நல்ல நிலை',
    // Dashboard section headers
    'marketplace_services': 'சந்தை & சேவைகள்',
    'sell_crops': 'பயிர்களை விற்கவும்',
    'sell_crops_desc': 'உங்கள் விளைபொருளை பட்டியலிட்டு வாங்குபவர்களுடன் இணையுங்கள்',
    'get_best_price': 'சிறந்த விலை பெறுங்கள்',
    'buy_seeds': 'விதைகள் வாங்கவும்',
    'buy_seeds_desc': 'நம்பகமான பிராண்டுகளிடமிருந்து சான்றளிக்கப்பட்ட விதைகள்',
    'browse_seeds': 'விதைகளை உலாவுக',
    'check_loans': 'கடன்களை சரிபார்க்கவும்',
    'check_loans_desc': 'விவசாய கடன் திட்டங்களை ஒப்பிடுக',
    'view_schemes': 'திட்டங்களை காண்க',
    'rent_equipment': 'உபகரணங்களை வாடகைக்கு எடுங்கள்',
    'rent_equipment_desc': 'டிராக்டர்கள் & விவசாய இயந்திரங்களை முன்பதிவு செய்யுங்கள்',
    'book_now': 'இப்போது பதிவு செய்யுங்கள்',
    'weather_forecast': 'வானிலை முன்னறிவிப்பு',
    'partly_cloudy': 'பகுதியளவு மேகமூட்டம்',
    'humidity': 'ஈரப்பதம்',
    'wind_speed_label': 'காற்றின் வேகம்',
    'rain_chance': 'மழை வாய்ப்பு',
    'alerts': 'எச்சரிக்கைகள்',
    'soil_health_analytics': 'மண் ஆரோக்கிய பகுப்பாய்வு',
    'market_price_trends': 'சந்தை விலை போக்குகள்',
    'todays_tasks': 'இன்றைய பணிகள்',
    'pending': 'நிலுவையில்',
    'open_feature': 'திற',
    'greeting_morning': 'காலை வணக்கம்',
    'greeting_afternoon': 'மதிய வணக்கம்',
    'greeting_evening': 'மாலை வணக்கம்',
    'farm_looking_great': 'உங்கள் தோட்டம் இன்று அருமையாக இருக்கிறது!',
    'land_size': 'நில அளவு',
    'active_crops': 'செயலில் உள்ள பயிர்கள்',
    'yield_prediction': 'விளைச்சல் கணிப்பு',
    'health_score': 'ஆரோக்கிய மதிப்பெண்',
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