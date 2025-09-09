
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';

interface LanguageContextType {
  locale: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const i18n = new I18n({ en, ta, hi });

i18n.enableFallback = true;

export const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(Localization.getLocales()[0]?.languageCode || 'en');

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLanguage = await AsyncStorage.getItem('language');
      if (savedLanguage) {
        i18n.locale = savedLanguage;
        setLocale(savedLanguage);
      } else {
        const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';
        i18n.locale = deviceLocale;
        setLocale(deviceLocale);
      }
    };
    loadLanguage();
  }, []);

  const setLanguage = async (lang: string) => {
    await AsyncStorage.setItem('language', lang);
    i18n.locale = lang;
    setLocale(lang);
  };

  const t = (key: string) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
