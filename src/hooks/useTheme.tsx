import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
} from 'react';
import { Theme, ThemeName } from '../types/theme';
import { themes, getTheme } from '../themes';

interface ThemeContextValue {
  theme: Theme;
  themeName: ThemeName;
  setTheme: (name: ThemeName) => void;
  availableThemes: ThemeName[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function generateCSSVariables(theme: Theme): string {
  const lines: string[] = [];

  // Colors
  Object.entries(theme.colors).forEach(([key, value]) => {
    const kebabKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    lines.push(`--sk-color-${kebabKey}: ${value};`);
  });

  // Typography
  lines.push(`--sk-font-family: ${theme.typography.fontFamily};`);
  lines.push(`--sk-font-family-mono: ${theme.typography.fontFamilyMono};`);
  lines.push(`--sk-font-family-display: ${theme.typography.fontFamilyDisplay};`);

  Object.entries(theme.typography.fontSize).forEach(([key, value]) => {
    lines.push(`--sk-font-size-${key}: ${value};`);
  });

  Object.entries(theme.typography.fontWeight).forEach(([key, value]) => {
    lines.push(`--sk-font-weight-${key}: ${value};`);
  });

  Object.entries(theme.typography.lineHeight).forEach(([key, value]) => {
    lines.push(`--sk-line-height-${key}: ${value};`);
  });

  Object.entries(theme.typography.letterSpacing).forEach(([key, value]) => {
    lines.push(`--sk-letter-spacing-${key}: ${value};`);
  });

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    const safeKey = key.replace('.', '-');
    lines.push(`--sk-spacing-${safeKey}: ${value};`);
  });

  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    lines.push(`--sk-radius-${key}: ${value};`);
  });

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    lines.push(`--sk-shadow-${key}: ${value};`);
  });

  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    lines.push(`--sk-transition-${key}: ${value};`);
  });

  return lines.join('\n  ');
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'cupertino',
  storageKey = 'stylekit-theme',
}: ThemeProviderProps) {
  const [themeName, setThemeName] = useState<ThemeName>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(storageKey);
      if (stored && stored in themes) {
        return stored as ThemeName;
      }
    }
    return defaultTheme;
  });

  const theme = useMemo(() => getTheme(themeName), [themeName]);

  const setTheme = useCallback(
    (name: ThemeName) => {
      setThemeName(name);
      if (typeof window !== 'undefined') {
        localStorage.setItem(storageKey, name);
      }
    },
    [storageKey]
  );

  useEffect(() => {
    const cssVars = generateCSSVariables(theme);
    const styleId = 'stylekit-theme-vars';

    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    styleEl.textContent = `:root {\n  ${cssVars}\n}`;

    // Add theme name as data attribute for conditional styling
    document.documentElement.setAttribute('data-sk-theme', themeName);
  }, [theme, themeName]);

  const value = useMemo(
    () => ({
      theme,
      themeName,
      setTheme,
      availableThemes: Object.keys(themes) as ThemeName[],
    }),
    [theme, themeName, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export { ThemeContext };
