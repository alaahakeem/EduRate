import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import type { Language } from '../utils/translations';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['ar']) => string;
  dir: 'rtl' | 'ltr';
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ar');

  const dir = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  const t = (key: keyof typeof translations['ar']) => {
    return translations[language]?.[key] || translations['ar'][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      language: 'ar' as Language,
      setLanguage: () => {},
      t: (key: keyof typeof translations['ar']) => translations['ar'][key] || key,
      dir: 'rtl' as 'rtl' | 'ltr',
      toggleLanguage: () => {},
    };
  }
  return context;
};
