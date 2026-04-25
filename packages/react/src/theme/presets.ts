import type { ThemeConfig } from './types';

export const lightTheme: ThemeConfig = {
  name: 'light',
  colors: {
    primary: 'hsl(222.2 47.4% 11.2%)',
    secondary: 'hsl(210 40% 96.1%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    muted: 'hsl(210 40% 96.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 47.4% 11.2%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 47.4% 11.2%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: 'hsl(222.2 47.4% 11.2%)',
    success: 'hsl(142.1 76.2% 36.3%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84.2% 60.2%)',
    info: 'hsl(221.2 83.2% 53.3%)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

export const darkTheme: ThemeConfig = {
  name: 'dark',
  colors: {
    primary: 'hsl(210 40% 98%)',
    secondary: 'hsl(217.2 32.6% 17.5%)',
    destructive: 'hsl(0 62.8% 30.6%)',
    muted: 'hsl(217.2 32.6% 17.5%)',
    background: 'hsl(222.2 84% 4.9%)',
    foreground: 'hsl(210 40% 98%)',
    card: 'hsl(222.2 84% 4.9%)',
    cardForeground: 'hsl(210 40% 98%)',
    border: 'hsl(217.2 32.6% 17.5%)',
    input: 'hsl(217.2 32.6% 17.5%)',
    ring: 'hsl(212.7 26.8% 83.9%)',
    success: 'hsl(142.1 70.6% 45.3%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 62.8% 30.6%)',
    info: 'hsl(221.2 83.2% 53.3%)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

export const minimalTheme: ThemeConfig = {
  name: 'minimal',
  colors: {
    primary: 'hsl(0 0% 20%)',
    secondary: 'hsl(0 0% 96%)',
    destructive: 'hsl(0 0% 40%)',
    muted: 'hsl(0 0% 96%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 20%)',
    border: 'hsl(0 0% 90%)',
    input: 'hsl(0 0% 90%)',
    ring: 'hsl(0 0% 20%)',
    success: 'hsl(0 0% 40%)',
    warning: 'hsl(0 0% 50%)',
    error: 'hsl(0 0% 40%)',
    info: 'hsl(0 0% 50%)',
  },
  borderRadius: {
    sm: '0',
    md: '0',
    lg: '0',
  },
};

export const highContrastTheme: ThemeConfig = {
  name: 'high-contrast',
  colors: {
    primary: 'hsl(0 0% 0%)',
    secondary: 'hsl(0 0% 90%)',
    destructive: 'hsl(0 100% 50%)',
    muted: 'hsl(0 0% 90%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(0 0% 0%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 0%)',
    border: 'hsl(0 0% 0%)',
    input: 'hsl(0 0% 0%)',
    ring: 'hsl(0 0% 0%)',
    success: 'hsl(120 100% 25%)',
    warning: 'hsl(60 100% 50%)',
    error: 'hsl(0 100% 50%)',
    info: 'hsl(240 100% 50%)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

export const colorblindTheme: ThemeConfig = {
  name: 'colorblind',
  colors: {
    primary: 'hsl(220 70% 40%)',
    secondary: 'hsl(220 20% 85%)',
    destructive: 'hsl(280 60% 40%)',
    muted: 'hsl(220 20% 85%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(220 50% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(220 50% 20%)',
    border: 'hsl(220 20% 85%)',
    input: 'hsl(220 20% 85%)',
    ring: 'hsl(220 70% 40%)',
    success: 'hsl(200 70% 40%)',
    warning: 'hsl(45 90% 50%)',
    error: 'hsl(280 60% 40%)',
    info: 'hsl(220 70% 40%)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.5rem',
    lg: '1rem',
  },
};

export const brandTheme = (primaryColor: string): ThemeConfig => ({
  name: 'brand',
  colors: {
    primary: primaryColor,
    secondary: 'hsl(210 40% 96.1%)',
    destructive: 'hsl(0 84.2% 60.2%)',
    muted: 'hsl(210 40% 96.1%)',
    background: 'hsl(0 0% 100%)',
    foreground: 'hsl(222.2 47.4% 11.2%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(222.2 47.4% 11.2%)',
    border: 'hsl(214.3 31.8% 91.4%)',
    input: 'hsl(214.3 31.8% 91.4%)',
    ring: primaryColor,
    success: 'hsl(142.1 76.2% 36.3%)',
    warning: 'hsl(38 92% 50%)',
    error: 'hsl(0 84.2% 60.2%)',
    info: 'hsl(221.2 83.2% 53.3%)',
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.5rem',
    lg: '1rem',
  },
});

export const presetThemes = {
  light: lightTheme,
  dark: darkTheme,
  minimal: minimalTheme,
  highContrast: highContrastTheme,
  colorblind: colorblindTheme,
};
