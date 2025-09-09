import React, { createContext, useState, useContext } from 'react';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';

import en from '../locales/en.json';
import ta from '../locales/ta.json';
import hi from '../locales/hi.json';

i18n.translations = { en, ta, hi };
i18n.locale = Localization.locale;
i18n.fallbacks = true;

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [locale, setLocale] = useState(Localization.locale);

  const setLanguage = (lang) => {
    i18n.locale = lang;
    setLocale(lang);
  };

  const t = (key) => i18n.t(key);

  return (
    <LanguageContext.Provider value={{ locale, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
