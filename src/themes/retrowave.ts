import { Theme } from '../types/theme';

/**
 * Retrowave Theme
 * 80s-inspired synthwave aesthetics with neon colors,
 * chrome gradients, and electric vibes. Think Miami Vice meets Tron.
 */
export const retrowaveTheme: Theme = {
  name: 'retrowave',
  displayName: 'Retrowave',
  colors: {
    primary: '#FF00FF',
    primaryHover: '#E600E6',
    primaryActive: '#CC00CC',
    secondary: '#00FFFF',
    secondaryHover: '#00E6E6',
    secondaryActive: '#00CCCC',
    accent: '#FFFF00',
    accentHover: '#E6E600',

    background: '#0D0221',
    backgroundAlt: '#150533',
    backgroundElevated: '#1A0840',
    backgroundOverlay: 'rgba(13, 2, 33, 0.9)',

    surface: 'rgba(26, 8, 64, 0.8)',
    surfaceHover: 'rgba(38, 12, 96, 0.8)',
    surfaceActive: 'rgba(51, 16, 128, 0.8)',
    surfaceBorder: 'rgba(255, 0, 255, 0.3)',

    text: '#FFFFFF',
    textSecondary: '#E0D0FF',
    textMuted: '#A090C0',
    textOnPrimary: '#0D0221',
    textOnSecondary: '#0D0221',

    success: '#00FF88',
    successBackground: 'rgba(0, 255, 136, 0.15)',
    warning: '#FFAA00',
    warningBackground: 'rgba(255, 170, 0, 0.15)',
    error: '#FF3366',
    errorBackground: 'rgba(255, 51, 102, 0.15)',
    info: '#00AAFF',
    infoBackground: 'rgba(0, 170, 255, 0.15)',

    border: 'rgba(255, 0, 255, 0.4)',
    borderHover: 'rgba(255, 0, 255, 0.6)',
    focus: 'rgba(0, 255, 255, 0.5)',
    shadow: 'rgba(255, 0, 255, 0.3)',
  },
  typography: {
    fontFamily:
      '"Orbitron", "Audiowide", "Rajdhani", "Exo 2", sans-serif',
    fontFamilyMono: '"Share Tech Mono", "VT323", "Courier New", monospace',
    fontFamilyDisplay: '"Orbitron", "Audiowide", "Rajdhani", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
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
      tight: '1.15',
      normal: '1.4',
      relaxed: '1.6',
    },
    letterSpacing: {
      tight: '0',
      normal: '0.05em',
      wide: '0.15em',
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
    sm: '0.125rem',
    base: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.625rem',
    '2xl': '0.75rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 0 10px rgba(255, 0, 255, 0.3), 0 0 5px rgba(0, 255, 255, 0.2)',
    base: '0 0 20px rgba(255, 0, 255, 0.4), 0 0 10px rgba(0, 255, 255, 0.3)',
    md: '0 0 30px rgba(255, 0, 255, 0.5), 0 0 15px rgba(0, 255, 255, 0.4)',
    lg: '0 0 40px rgba(255, 0, 255, 0.6), 0 0 20px rgba(0, 255, 255, 0.5)',
    xl: '0 0 60px rgba(255, 0, 255, 0.7), 0 0 30px rgba(0, 255, 255, 0.6)',
    inner: 'inset 0 0 20px rgba(255, 0, 255, 0.2)',
    glow: '0 0 40px rgba(255, 0, 255, 0.8), 0 0 80px rgba(0, 255, 255, 0.4)',
  },
  transitions: {
    fast: '100ms ease-out',
    base: '200ms ease-out',
    slow: '400ms ease-out',
    bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Special retrowave-specific effects
export const retrowaveEffects = {
  scanlines: `repeating-linear-gradient(
    0deg,
    rgba(0, 0, 0, 0.1) 0px,
    rgba(0, 0, 0, 0.1) 1px,
    transparent 1px,
    transparent 2px
  )`,
  gridBackground: `linear-gradient(rgba(255, 0, 255, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)`,
  chromeGradient: 'linear-gradient(135deg, #FF00FF, #00FFFF, #FF00FF)',
};
