export interface ThemeColors {
  primary: string;
  secondary: string;
  destructive: string;
  muted: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  border: string;
  input: string;
  ring: string;
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
}

export interface ThemeProviderProps {
  theme?: ThemeConfig;
  inheritFromParent?: boolean;
  children: React.ReactNode;
}
