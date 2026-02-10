
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'hi' | 'bn' | 'gu' | 'mr' | 'ta' | 'te' | 'pa';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    nav_profile: 'PROFILE',
    nav_language: 'LANGUAGE',
    nav_projects: 'MY PROJECTS',
    nav_about: 'ABOUT US',
    nav_logout: 'LOGOUT',
    nav_signin: 'SIGN IN',
    hero_title: 'Build Your Dream House with Confidence',
    hero_subtitle: 'Submit your construction plans and get accurate, professional cost estimates from verified structural and civil engineers in hours, not weeks.',
    hero_cta: 'Start Planning Now',
    hero_learn: 'Learn More'
  },
  hi: {
    nav_profile: 'प्रोफ़ाइल',
    nav_language: 'भाषा',
    nav_projects: 'मेरे प्रोजेक्ट्स',
    nav_about: 'हमारे बारे में',
    nav_logout: 'लॉगआउट',
    nav_signin: 'साइन इन',
    hero_title: 'भरोसे के साथ अपना सपनों का घर बनाएं',
    hero_subtitle: 'अपनी निर्माण योजनाएं जमा करें और प्रमाणित इंजीनियरों से कुछ ही घंटों में सटीक लागत अनुमान प्राप्त करें।',
    hero_cta: 'अभी योजना शुरू करें',
    hero_learn: 'अधिक जानें'
  },
  bn: {
    nav_profile: 'প্রোফাইল',
    nav_language: 'ভাষা',
    nav_projects: 'আমার প্রকল্প',
    nav_about: 'আমাদের সম্পর্কে',
    nav_logout: 'লগআউট',
    nav_signin: 'সাইন ইন',
    hero_title: 'বিশ্বাসের সাথে আপনার স্বপ্নের বাড়ি তৈরি করুন',
    hero_subtitle: 'আপনার নির্মাণ পরিকল্পনা জমা দিন এবং কয়েক ঘন্টার মধ্যে যাচাইকৃত ইঞ্জিনিয়ারদের কাছ থেকে সঠিক ব্যয় অনুমান পান।',
    hero_cta: 'এখনই পরিকল্পনা শুরু করুন',
    hero_learn: 'আরও জানুন'
  },
  gu: {
    nav_profile: 'પ્રોફાઇલ',
    nav_language: 'ભાષા',
    nav_projects: 'મારા પ્રોજેક્ટ્સ',
    nav_about: 'અમારા વિશે',
    nav_logout: 'લોગઆઉટ',
    nav_signin: 'સાઇન ઇન',
    hero_title: 'આત્મવિશ્વાસ સાથે તમારું સપનાનું ઘર બનાવો',
    hero_subtitle: 'તમારી બાંધકામ યોજનાઓ સબમિટ કરો અને કલાકોમાં વેરિફાઇડ એન્જિનિયરો પાસેથી સચોટ ખર્ચ અંદાજ મેળવો.',
    hero_cta: 'હમણાં પ્લાનિંગ શરૂ કરો',
    hero_learn: 'વધુ જાણો'
  },
  mr: {
    nav_profile: 'प्रोफाइल',
    nav_language: 'भाषा',
    nav_projects: 'माझे प्रकल्प',
    nav_about: 'आमच्याबद्दल',
    nav_logout: 'लॉगआउट',
    nav_signin: 'साइन इन',
    hero_title: 'आत्मविश्वासाने तुमचे स्वप्नातील घर बनवा',
    hero_subtitle: 'तुमच्या बांधकामाच्या योजना सबमिट करा आणि काही तासांत प्रमाणित अभियंत्यांकडून अचूक खर्चाचा अंदाज मिळवा.',
    hero_cta: 'आता नियोजन सुरू करा',
    hero_learn: 'अधिक जाणून घ्या'
  },
  ta: {
    nav_profile: 'சுயவிவரம்',
    nav_language: 'மொழி',
    nav_projects: 'எனது திட்டங்கள்',
    nav_about: 'எங்களைப் பற்றி',
    nav_logout: 'வெளியேறு',
    nav_signin: 'உள்நுழைக',
    hero_title: 'நம்பிக்கையுடன் உங்கள் கனவு இல்லத்தை உருவாக்குங்கள்',
    hero_subtitle: 'உங்கள் கட்டுமானத் திட்டங்களைச் சமர்ப்பித்து, சரிபார்க்கப்பட்ட பொறியாளர்களிடமிருந்து துல்லியமான செலவு மதிப்பீடுகளைப் பெறுங்கள்.',
    hero_cta: 'இப்போதே திட்டமிடத் தொடங்குங்கள்',
    hero_learn: 'மேலும் அறிய'
  },
  te: {
    nav_profile: 'ప్రొఫైల్',
    nav_language: 'భాష',
    nav_projects: 'నా ప్రాజెక్టులు',
    nav_about: 'మా గురించి',
    nav_logout: 'లాగ్అవుట్',
    nav_signin: 'సైన్ ఇన్',
    hero_title: 'నమ్మకంతో మీ కలల ఇంటిని నిర్మించుకోండి',
    hero_subtitle: 'మీ నిర్మాణ ప్రణాళికలను సమర్పించండి మరియు ధృవీకరించబడిన ఇంజనీర్ల నుండి ఖచ్చితమైన వ్యయ అంచనాలను పొందండి.',
    hero_cta: 'ఇప్పుడే ప్రణాళిక ప్రారంభించండి',
    hero_learn: 'మరింత తెలుసుకోండి'
  },
  pa: {
    nav_profile: 'ਪ੍ਰੋਫਾਈਲ',
    nav_language: 'ਭਾਸ਼ਾ',
    nav_projects: 'ਮੇਰੇ ਪ੍ਰੋਜੈਕਟ',
    nav_about: 'ਸਾਡੇ ਬਾਰੇ',
    nav_logout: 'ਲੌਗਆਉਟ',
    nav_signin: 'ਸਾਈਨ ਇਨ',
    hero_title: 'ਭਰੋਸੇ ਨਾਲ ਆਪਣਾ ਸੁਪਨਿਆਂ ਦਾ ਘਰ ਬਣਾਓ',
    hero_subtitle: 'ਆਪਣੀਆਂ ਉਸਾਰੀ ਯੋਜਨਾਵਾਂ ਜਮ੍ਹਾਂ ਕਰੋ ਅਤੇ ਪ੍ਰਮਾਣਿਤ ਇੰਜੀਨੀਅਰਾਂ ਤੋਂ ਕੁਝ ਹੀ ਘੰਟਿਆਂ ਵਿੱਚ ਸਹੀ ਲਾਗਤ ਦਾ ਅੰਦਾਜ਼ਾ ਪ੍ਰਾਪਤ ਕਰੋ।',
    hero_cta: 'ਹੁਣੇ ਯੋਜਨਾਬੰਦੀ ਸ਼ੁਰੂ ਕਰੋ',
    hero_learn: 'ਹੋਰ ਜਾਣੋ'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('app_lang') as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_lang', lang);
  };

  const t = (key: string) => {
    return translations[language][key] || translations['en'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
