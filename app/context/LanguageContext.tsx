import React, { createContext, useState, useContext, ReactNode } from 'react';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';

import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';

interface LanguageContextType {
  locale: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const i18n = new I18n({ en, ta, hi });

const deviceLocale = Localization.getLocales()[0]?.languageCode || 'en';

i18n.locale = deviceLocale;
i18n.enableFallback = true;

export const LanguageContext = createContext<LanguageContextType>({} as LanguageContextType);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState(deviceLocale);

  const setLanguage = (lang: string) => {
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
