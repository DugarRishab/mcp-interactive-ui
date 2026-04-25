import { createContext, useContext } from 'react';
import type { ThemeConfig } from './types';
import { lightTheme } from './presets';

export interface ThemeContextValue {
  theme: ThemeConfig;
  setTheme: (theme: ThemeConfig) => void;
  inheritFromParent: () => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: lightTheme,
  setTheme: () => {},
  inheritFromParent: () => {},
});

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
