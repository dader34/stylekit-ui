import { Theme } from '../types/theme';

/**
 * Glass Theme
 * Glassmorphism design with frosted translucency, vibrant gradients,
 * and depth-creating blur effects. Modern and ethereal.
 */
export const glassTheme: Theme = {
  name: 'glass',
  displayName: 'Glass',
  colors: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryActive: '#4338CA',
    secondary: '#EC4899',
    secondaryHover: '#DB2777',
    secondaryActive: '#BE185D',
    accent: '#06B6D4',
    accentHover: '#0891B2',

    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAlt: 'rgba(255, 255, 255, 0.1)',
    backgroundElevated: 'rgba(255, 255, 255, 0.2)',
    backgroundOverlay: 'rgba(0, 0, 0, 0.6)',

    surface: 'rgba(255, 255, 255, 0.15)',
    surfaceHover: 'rgba(255, 255, 255, 0.22)',
    surfaceActive: 'rgba(255, 255, 255, 0.28)',
    surfaceBorder: 'rgba(255, 255, 255, 0.25)',

    text: '#FFFFFF',
    textSecondary: 'rgba(255, 255, 255, 0.85)',
    textMuted: 'rgba(255, 255, 255, 0.6)',
    textOnPrimary: '#FFFFFF',
    textOnSecondary: '#FFFFFF',

    success: '#34D399',
    successBackground: 'rgba(52, 211, 153, 0.2)',
    warning: '#FBBF24',
    warningBackground: 'rgba(251, 191, 36, 0.2)',
    error: '#F87171',
    errorBackground: 'rgba(248, 113, 113, 0.2)',
    info: '#60A5FA',
    infoBackground: 'rgba(96, 165, 250, 0.2)',

    border: 'rgba(255, 255, 255, 0.2)',
    borderHover: 'rgba(255, 255, 255, 0.35)',
    focus: 'rgba(99, 102, 241, 0.5)',
    shadow: 'rgba(0, 0, 0, 0.2)',
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "DM Sans", "Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyMono: '"JetBrains Mono", "Fira Code", monospace',
    fontFamilyDisplay: '"Plus Jakarta Sans", "DM Sans", sans-serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
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
      tight: '-0.02em',
      normal: '-0.01em',
      wide: '0.025em',
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
    sm: '0.375rem',
    base: '0.75rem',
    md: '1rem',
    lg: '1.25rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 2px 8px rgba(0, 0, 0, 0.1)',
    base: '0 4px 16px rgba(0, 0, 0, 0.15)',
    md: '0 8px 24px rgba(0, 0, 0, 0.18)',
    lg: '0 12px 40px rgba(0, 0, 0, 0.2)',
    xl: '0 20px 60px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 8px rgba(0, 0, 0, 0.1)',
    glow: '0 0 40px rgba(99, 102, 241, 0.4)',
  },
  transitions: {
    fast: '100ms ease-out',
    base: '200ms ease-out',
    slow: '350ms ease-out',
    bounce: '450ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Special glass-specific CSS properties to be applied
export const glassEffects = {
  backdrop: 'blur(20px) saturate(180%)',
  backdropHeavy: 'blur(40px) saturate(200%)',
  borderGradient:
    'linear-gradient(135deg, rgba(255,255,255,0.4), rgba(255,255,255,0.1))',
};
