import { createContext, useContext, useState, useEffect, ReactNode, useMemo } from "react";

export type Language = "en" | "hi" | "pa";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    "nav.story": "Season Story",
    "nav.dashboard": "Dashboard",
    "nav.tools": "Tools",
    "nav.today": "Today",
    "nav.market": "Mandi Market Rates",
    "nav.schemes": "Government Schemes",
    "nav.profile": "Your profile",
    "nav.login": "Login / Register",
    "nav.admin": "Admin Console",
    "common.points": "pts",
    "common.logout": "Logout",
    "tools.disease": "Plant Disease Vision",
    "tools.crop": "Crop Recommendation",
    "tools.price": "Mandi Price Forecaster",
    "tools.risk": "Crop Risk Radar",
    "tools.soil": "Soil Health & NPK",
    "tools.schemes": "Government Schemes",
    "tools.weather": "Live Weather Radar",
    "tools.marketRates": "Mandi Market Rates",
    "tools.calendar": "Crop Calendar & Sowing",
    "tools.expert": "Krishi Sahayak AI Advisory",
    "tools.community": "Farmer Community Forum",
    "tools.history": "Prediction Audit History",
    "market.sell": "Sell Produce",
    "market.sellDesc": "List your harvest & connect direct with millers",
    "market.seeds": "Buy Certified Seeds",
    "market.seedsDesc": "High-yield certified varieties with subsidy",
    "market.loans": "Kisan Credit & Loans",
    "market.loansDesc": "Calculate 4% subvented credit limits",
    "market.rent": "Rent Farm Machinery",
    "market.rentDesc": "Book tractors, harvesters & spray drones",
    "tasks.title": "Today's Farm Checklist",
    "tasks.pending": "tasks pending",
  },
  hi: {
    "nav.story": "सीजन स्टोरी",
    "nav.dashboard": "डैशबोर्ड",
    "nav.tools": "कृषि उपकरण",
    "nav.today": "आज की स्थिति",
    "nav.market": "मंडी भाव",
    "nav.schemes": "सरकारी योजनाएं",
    "nav.profile": "आपकी प्रोफाइल",
    "nav.login": "लॉगिन / पंजीकरण",
    "nav.admin": "एडमिन कंसोल",
    "common.points": "अंक",
    "common.logout": "लॉगआउट",
    "tools.disease": "फसल रोग पहचान (AI)",
    "tools.crop": "स्मार्ट फसल सुझाव",
    "tools.price": "मंडी भाव पूर्वानुमान",
    "tools.risk": "फसल जोखिम रडार",
    "tools.soil": "मिट्टी स्वास्थ्य और NPK",
    "tools.schemes": "सरकारी योजनाएं और सब्सिडी",
    "tools.weather": "मौसम और वर्षा पूर्वानुमान",
    "tools.marketRates": "मंडी भाव तुलना",
    "tools.calendar": "फसल कैलेंडर और बुवाई",
    "tools.expert": "कृषि सहायक AI विशेषज्ञ",
    "tools.community": "किसान समुदाय मंच",
    "tools.history": "पूर्वानुमान इतिहास",
    "market.sell": "फसल सीधे बेचें",
    "market.sellDesc": "अपनी उपज सूचीबद्ध करें और मिलर्स से जुड़ें",
    "market.seeds": "प्रमाणित बीज खरीदें",
    "market.seedsDesc": "उच्च उपज वाले प्रमाणित बीज सब्सिडी पर",
    "market.loans": "किसान क्रेडिट व ऋण",
    "market.loansDesc": "4% रियायती ब्याज दर पर ऋण सीमा जांचें",
    "market.rent": "कृषि उपकरण किराए पर लें",
    "market.rentDesc": "ट्रैक्टर, हार्वेस्टर व ड्रोन बुक करें",
    "tasks.title": "आज के कृषि कार्य",
    "tasks.pending": "कार्य बाकी",
  },
  pa: {
    "nav.story": "ਸੀਜ਼ਨ ਸਟੋਰੀ",
    "nav.dashboard": "ਡੈਸ਼ਬੋਰਡ",
    "nav.tools": "ਖੇਤੀ ਸੰਦ",
    "nav.today": "ਅੱਜ ਦੀ ਸਥਿਤੀ",
    "nav.market": "ਮੰਡੀ ਭਾਅ",
    "nav.schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ",
    "nav.profile": "ਤੁਹਾਡੀ ਪ੍ਰੋਫਾਈਲ",
    "nav.login": "ਲਾਗਇਨ / ਰਜਿਸਟਰ",
    "nav.admin": "ਐਡਮਿਨ ਕੰਸੋਲ",
    "common.points": "ਅੰਕ",
    "common.logout": "ਲਾਗਆਉਟ",
    "tools.disease": "ਫ਼ਸਲ ਰੋਗ ਪਛਾਣ (AI)",
    "tools.crop": "ਫ਼ਸਲ ਸਿਫ਼ਾਰਸ਼",
    "tools.price": "ਮੰਡੀ ਕੀਮਤ ਪੂਰਵ-ਅਨੁਮਾਨ",
    "tools.risk": "ਫ਼ਸਲ ਜੋਖਮ ਰਡਾਰ",
    "tools.soil": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ NPK",
    "tools.schemes": "ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਤੇ ਸਬਸਿਡੀਆਂ",
    "tools.weather": "ਮੌਸਮ ਤੇ ਮੀਂਹ ਦੀ ਜਾਣਕਾਰੀ",
    "tools.marketRates": "ਮੰਡੀ ਰੇਟ ਤੁਲਨਾ",
    "tools.calendar": "ਫ਼ਸਲ ਕੈਲੰਡਰ ਅਤੇ ਬਿਜਾਈ",
    "tools.expert": "ਕ੍ਰਿਸ਼ੀ ਸਹਾਇਕ AI ਸਲਾਹਕਾਰ",
    "tools.community": "ਕਿਸਾਨ ਭਾਈਚਾਰਾ",
    "tools.history": "ਪੂਰਵ-ਅਨੁਮਾਨ ਇਤਿਹਾਸ",
    "market.sell": "ਫ਼ਸਲ ਸਿੱਧੀ ਵੇਚੋ",
    "market.sellDesc": "ਆਪਣੀ ਉਪਜ ਸੂਚੀਬੱਧ ਕਰੋ ਤੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੁੜੋ",
    "market.seeds": "ਪ੍ਰਮਾਣਿਤ ਬੀਜ ਖਰੀਦੋ",
    "market.seedsDesc": "ਵੱਧ ਝਾੜ ਦੇਣ ਵਾਲੇ ਪ੍ਰਮਾਣਿਤ ਬੀਜ",
    "market.loans": "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਤੇ ਕਰਜ਼ੇ",
    "market.loansDesc": "4% ਵਿਆਜ ਵਾਲੇ ਖੇਤੀ ਕਰਜ਼ੇ ਦੀ ਸੀਮਾ",
    "market.rent": "ਮਸ਼ੀਨਰੀ ਕਿਰਾਏ ਤੇ ਲਵੋ",
    "market.rentDesc": "ਟਰੈਕਟਰ, ਹਾਰਵੈਸਟਰ ਅਤੇ ਡਰੋਨ ਬੁੱਕ ਕਰੋ",
    "tasks.title": "ਅੱਜ ਦੇ ਖੇਤੀ ਕੰਮ",
    "tasks.pending": "ਕੰਮ ਬਾਕੀ",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("sagri_language");
      if (saved === "en" || saved === "hi" || saved === "pa") return saved;
    } catch {}
    return "en";
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem("sagri_language", lang);
    } catch {}
  };

  const t = useMemo(
    () => (key: string): string => {
      return TRANSLATIONS[language]?.[key] ?? TRANSLATIONS.en[key] ?? key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: "en" as Language,
      setLanguage: () => {},
      t: (key: string) => TRANSLATIONS.en[key] ?? key,
    };
  }
  return context;
}
