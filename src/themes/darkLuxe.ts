import { Theme } from '../types/theme';

/**
 * Dark Luxe Theme
 * Premium dark mode with rich blacks, gold accents,
 * and sophisticated depth. Think luxury automotive interiors.
 */
export const darkLuxeTheme: Theme = {
  name: 'darkLuxe',
  displayName: 'Dark Luxe',
  colors: {
    primary: '#C9A962',
    primaryHover: '#D4B872',
    primaryActive: '#B89952',
    secondary: '#8B7355',
    secondaryHover: '#9B8365',
    secondaryActive: '#7B6345',
    accent: '#E8D5B5',
    accentHover: '#F0E0C5',

    background: '#0A0A0A',
    backgroundAlt: '#121212',
    backgroundElevated: '#1A1A1A',
    backgroundOverlay: 'rgba(0, 0, 0, 0.8)',

    surface: '#141414',
    surfaceHover: '#1C1C1C',
    surfaceActive: '#242424',
    surfaceBorder: '#2A2A2A',

    text: '#F5F5F5',
    textSecondary: '#B3B3B3',
    textMuted: '#666666',
    textOnPrimary: '#0A0A0A',
    textOnSecondary: '#F5F5F5',

    success: '#4ADE80',
    successBackground: 'rgba(74, 222, 128, 0.12)',
    warning: '#FBBF24',
    warningBackground: 'rgba(251, 191, 36, 0.12)',
    error: '#F87171',
    errorBackground: 'rgba(248, 113, 113, 0.12)',
    info: '#60A5FA',
    infoBackground: 'rgba(96, 165, 250, 0.12)',

    border: '#2A2A2A',
    borderHover: '#3A3A3A',
    focus: 'rgba(201, 169, 98, 0.4)',
    shadow: 'rgba(0, 0, 0, 0.5)',
  },
  typography: {
    fontFamily:
      '"Tenor Sans", "Didot", "Bodoni MT", "Playfair Display", Georgia, serif',
    fontFamilyMono: '"JetBrains Mono", "Fira Code", Monaco, monospace',
    fontFamilyDisplay:
      '"Tenor Sans", "Didot", "Bodoni MT", "Playfair Display", serif',
    fontSize: {
      xs: '0.6875rem',
      sm: '0.8125rem',
      base: '0.9375rem',
      lg: '1.0625rem',
      xl: '1.25rem',
      '2xl': '1.5625rem',
      '3xl': '2rem',
      '4xl': '2.75rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.2',
      normal: '1.5',
      relaxed: '1.65',
    },
    letterSpacing: {
      tight: '0',
      normal: '0.02em',
      wide: '0.12em',
    },
  },
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',
    1: '0.25rem',
    1.5: '0.375rem',
    2: '0.5rem',
    2.5: '0.625rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.1875rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.625rem',
    '2xl': '0.75rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(0, 0, 0, 0.4)',
    base: '0 2px 6px rgba(0, 0, 0, 0.5)',
    md: '0 4px 12px rgba(0, 0, 0, 0.5)',
    lg: '0 8px 24px rgba(0, 0, 0, 0.6)',
    xl: '0 16px 48px rgba(0, 0, 0, 0.7)',
    inner: 'inset 0 2px 6px rgba(0, 0, 0, 0.4)',
    glow: '0 0 30px rgba(201, 169, 98, 0.2)',
  },
  transitions: {
    fast: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '400ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Luxe-specific decorative effects
export const darkLuxeEffects = {
  goldGradient: 'linear-gradient(135deg, #C9A962 0%, #E8D5B5 50%, #C9A962 100%)',
  subtleNoise: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E")`,
};
