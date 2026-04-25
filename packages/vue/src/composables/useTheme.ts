import { ref, computed, provide, inject, type InjectionKey } from 'vue';

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

export interface ThemeContext {
  theme: ReturnType<typeof ref<ThemeConfig>>;
  setTheme: (theme: ThemeConfig) => void;
  inheritFromParent: () => void;
}

const ThemeKey: InjectionKey<ThemeContext> = Symbol('Theme');

export const defaultTheme: ThemeConfig = {
  name: 'default',
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

export function useThemeProvider(initialTheme: ThemeConfig = defaultTheme) {
  const theme = ref<ThemeConfig>(initialTheme);

  const setTheme = (newTheme: ThemeConfig) => {
    theme.value = newTheme;
    applyTheme(newTheme);
  };

  const inheritFromParent = () => {
    if (typeof window === 'undefined') return;
    
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check if --primary CSS variable exists (indicates shadcn project)
    const primary = computedStyle.getPropertyValue('--primary').trim();
    
    if (primary) {
      const inheritedTheme: ThemeConfig = {
        name: 'inherited',
        colors: {
          primary: computedStyle.getPropertyValue('--primary').trim() || defaultTheme.colors.primary,
          secondary: computedStyle.getPropertyValue('--secondary').trim() || defaultTheme.colors.secondary,
          destructive: computedStyle.getPropertyValue('--destructive').trim() || defaultTheme.colors.destructive,
          muted: computedStyle.getPropertyValue('--muted').trim() || defaultTheme.colors.muted,
          background: computedStyle.getPropertyValue('--background').trim() || defaultTheme.colors.background,
          foreground: computedStyle.getPropertyValue('--foreground').trim() || defaultTheme.colors.foreground,
          card: computedStyle.getPropertyValue('--card').trim() || defaultTheme.colors.card,
          cardForeground: computedStyle.getPropertyValue('--card-foreground').trim() || defaultTheme.colors.cardForeground,
          border: computedStyle.getPropertyValue('--border').trim() || defaultTheme.colors.border,
          input: computedStyle.getPropertyValue('--input').trim() || defaultTheme.colors.input,
          ring: computedStyle.getPropertyValue('--ring').trim() || defaultTheme.colors.ring,
          success: computedStyle.getPropertyValue('--success').trim() || defaultTheme.colors.success,
          warning: computedStyle.getPropertyValue('--warning').trim() || defaultTheme.colors.warning,
          error: computedStyle.getPropertyValue('--error').trim() || defaultTheme.colors.error,
          info: computedStyle.getPropertyValue('--info').trim() || defaultTheme.colors.info,
        },
        borderRadius: {
          sm: computedStyle.getPropertyValue('--radius').trim() || defaultTheme.borderRadius.sm,
          md: computedStyle.getPropertyValue('--radius').trim() || defaultTheme.borderRadius.md,
          lg: computedStyle.getPropertyValue('--radius').trim() || defaultTheme.borderRadius.lg,
        },
      };
      setTheme(inheritedTheme);
    }
  };

  const context: ThemeContext = {
    theme,
    setTheme,
    inheritFromParent,
  };

  provide(ThemeKey, context);

  // Apply initial theme
  applyTheme(theme.value);

  return context;
}

export function useTheme(): ThemeContext {
  const context = inject(ThemeKey);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function applyTheme(theme: ThemeConfig) {
  if (typeof window === 'undefined') return;
  
  const root = document.documentElement;
  
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
    root.style.setProperty(cssVar, value);
  });
  
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
}
