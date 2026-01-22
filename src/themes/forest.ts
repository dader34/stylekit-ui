import { Theme } from '../types/theme';

/**
 * Forest Theme
 * Organic, earthy, and calming. Deep greens, warm browns,
 * natural textures, and a grounded aesthetic inspired by nature.
 */
export const forestTheme: Theme = {
  name: 'forest',
  displayName: 'Forest',
  colors: {
    primary: '#2D5A3D',
    primaryHover: '#234830',
    primaryActive: '#1A3624',
    secondary: '#8B6B4A',
    secondaryHover: '#755A3E',
    secondaryActive: '#604A33',
    accent: '#D4A574',
    accentHover: '#C49564',

    background: '#F7F4F0',
    backgroundAlt: '#EDE8E1',
    backgroundElevated: '#FDFCFA',
    backgroundOverlay: 'rgba(26, 54, 36, 0.6)',

    surface: '#FDFCFA',
    surfaceHover: '#F5F1EB',
    surfaceActive: '#EDE8E1',
    surfaceBorder: '#D8D0C5',

    text: '#1F2E21',
    textSecondary: '#3D4D3F',
    textMuted: '#7A8B7C',
    textOnPrimary: '#FDFCFA',
    textOnSecondary: '#FDFCFA',

    success: '#4A7C59',
    successBackground: '#E8F0EA',
    warning: '#B8860B',
    warningBackground: '#F8F2E4',
    error: '#A94442',
    errorBackground: '#F5EAEA',
    info: '#4A7C9B',
    infoBackground: '#E8EFF3',

    border: '#C5BBA8',
    borderHover: '#B5A998',
    focus: 'rgba(45, 90, 61, 0.35)',
    shadow: 'rgba(31, 46, 33, 0.08)',
  },
  typography: {
    fontFamily:
      '"Fraunces", "Libre Baskerville", "Georgia", "Times New Roman", serif',
    fontFamilyMono: '"Source Code Pro", "Consolas", monospace',
    fontFamilyDisplay: '"Fraunces", "Libre Baskerville", Georgia, serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.3125rem',
      '2xl': '1.625rem',
      '3xl': '2.125rem',
      '4xl': '2.875rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.6',
      relaxed: '1.8',
    },
    letterSpacing: {
      tight: '-0.01em',
      normal: '0',
      wide: '0.04em',
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
    sm: '0.25rem',
    base: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 1px 3px rgba(31, 46, 33, 0.06)',
    base: '0 2px 6px rgba(31, 46, 33, 0.08)',
    md: '0 4px 12px rgba(31, 46, 33, 0.1)',
    lg: '0 8px 24px rgba(31, 46, 33, 0.12)',
    xl: '0 16px 40px rgba(31, 46, 33, 0.14)',
    inner: 'inset 0 2px 4px rgba(31, 46, 33, 0.06)',
    glow: '0 0 20px rgba(45, 90, 61, 0.2)',
  },
  transitions: {
    fast: '150ms ease-out',
    base: '250ms ease-out',
    slow: '400ms ease-out',
    bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Forest-specific decorative effects
export const forestEffects = {
  leafPattern: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0C35 15 45 25 60 30C45 35 35 45 30 60C25 45 15 35 0 30C15 25 25 15 30 0Z' fill='%232D5A3D' fill-opacity='0.03'/%3E%3C/svg%3E")`,
  paperTexture: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='paper'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23paper)' opacity='0.025'/%3E%3C/svg%3E")`,
};
