import React, { createContext, useState, useContext, useEffect } from 'react';
import { useColorScheme as useDeviceColorScheme } from 'react-native';

interface ThemeContextType {
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const deviceScheme = useDeviceColorScheme();
  const [colorScheme, setColorSchemeState] = useState(deviceScheme || 'light');

  useEffect(() => {
    setColorSchemeState(deviceScheme || 'light');
  }, [deviceScheme]);

  const setColorScheme = (scheme: 'light' | 'dark') => {
    setColorSchemeState(scheme);
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, setColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
