import { useState, useEffect, useCallback } from 'react';
import { ThemeContext } from './ThemeContext';
import type { ThemeProviderProps, ThemeConfig } from './types';
import { lightTheme } from './presets';

export function ThemeProvider({ theme, inheritFromParent = true, children }: ThemeProviderProps): JSX.Element {
  const [activeTheme, setActiveTheme] = useState<ThemeConfig>(theme || lightTheme);
  const [inheritedTheme, setInheritedTheme] = useState<ThemeConfig | null>(null);
  const [wrapperEl, setWrapperEl] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (inheritFromParent && typeof window !== 'undefined') {
      // Try to read CSS variables from parent shadcn project
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);

      // Check if --primary CSS variable exists (indicates shadcn project)
      const primary = computedStyle.getPropertyValue('--primary').trim();

      if (primary) {
        // Inherit from parent shadcn project
        const inherited: ThemeConfig = {
          name: 'inherited',
          colors: {
            primary: primary || lightTheme.colors.primary,
            secondary: computedStyle.getPropertyValue('--secondary').trim() || lightTheme.colors.secondary,
            destructive: computedStyle.getPropertyValue('--destructive').trim() || lightTheme.colors.destructive,
            muted: computedStyle.getPropertyValue('--muted').trim() || lightTheme.colors.muted,
            background: computedStyle.getPropertyValue('--background').trim() || lightTheme.colors.background,
            foreground: computedStyle.getPropertyValue('--foreground').trim() || lightTheme.colors.foreground,
            card: computedStyle.getPropertyValue('--card').trim() || lightTheme.colors.card,
            cardForeground: computedStyle.getPropertyValue('--card-foreground').trim() || lightTheme.colors.cardForeground,
            border: computedStyle.getPropertyValue('--border').trim() || lightTheme.colors.border,
            input: computedStyle.getPropertyValue('--input').trim() || lightTheme.colors.input,
            ring: computedStyle.getPropertyValue('--ring').trim() || lightTheme.colors.ring,
            success: computedStyle.getPropertyValue('--success').trim() || lightTheme.colors.success,
            warning: computedStyle.getPropertyValue('--warning').trim() || lightTheme.colors.warning,
            error: computedStyle.getPropertyValue('--error').trim() || lightTheme.colors.error,
            info: computedStyle.getPropertyValue('--info').trim() || lightTheme.colors.info,
          },
          borderRadius: {
            // shadcn convention: sm = radius - 4px, md = radius, lg = radius + 4px
            sm: 'calc(var(--radius) - 4px)',
            md: 'var(--radius)',
            lg: 'calc(var(--radius) + 4px)',
          },
        };
        setInheritedTheme(inherited);
      }
    }
  }, [inheritFromParent]);

  // Use explicit theme > inherited theme > default theme
  const currentTheme = theme || inheritedTheme || activeTheme;

  const handleSetTheme = useCallback((newTheme: ThemeConfig) => {
    setActiveTheme(newTheme);
    applyThemeToDOM(newTheme, wrapperEl);
  }, [wrapperEl]);

  const handleInheritFromParent = useCallback(() => {
    if (inheritedTheme) {
      setActiveTheme(inheritedTheme);
      applyThemeToDOM(inheritedTheme, wrapperEl);
    }
  }, [inheritedTheme, wrapperEl]);

  // Apply theme to DOM on mount and when theme changes
  // Skip when inheriting from parent without an explicit theme (no-op)
  useEffect(() => {
    if (!theme && inheritFromParent && inheritedTheme) {
      // Just use the inherited theme from context - parent's CSS vars apply automatically
      return;
    }
    applyThemeToDOM(currentTheme, wrapperEl);
  }, [currentTheme, wrapperEl, theme, inheritFromParent, inheritedTheme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: currentTheme,
        setTheme: handleSetTheme,
        inheritFromParent: handleInheritFromParent,
      }}
    >
      <div ref={setWrapperEl} className="mcp-theme-provider" data-theme={currentTheme.name}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

function applyThemeToDOM(theme: ThemeConfig, container: HTMLDivElement | null) {
  if (typeof window === 'undefined') return;
  if (!container) return;

  // Apply color variables to the wrapper div (scoped)
  Object.entries(theme.colors).forEach(([key, value]) => {
    const cssVarName = `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;
    container.style.setProperty(cssVarName, value);
  });

  // Apply border radius variables using shadcn convention
  // sm = calc(var(--radius) - 4px), md = var(--radius), lg = calc(var(--radius) + 4px)
  container.style.setProperty('--radius-sm', 'calc(var(--radius) - 4px)');
  container.style.setProperty('--radius-md', 'var(--radius)');
  container.style.setProperty('--radius-lg', 'calc(var(--radius) + 4px)');

  // Set data-theme attribute for CSS selectors
  container.setAttribute('data-theme', theme.name);
}
