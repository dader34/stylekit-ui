export interface ThemeColors {
  // Brand
  primary: string;
  primaryHover: string;
  primaryActive: string;
  secondary: string;
  secondaryHover: string;
  secondaryActive: string;
  accent: string;
  accentHover: string;

  // Backgrounds
  background: string;
  backgroundAlt: string;
  backgroundElevated: string;
  backgroundOverlay: string;

  // Surfaces
  surface: string;
  surfaceHover: string;
  surfaceActive: string;
  surfaceBorder: string;

  // Text
  text: string;
  textSecondary: string;
  textMuted: string;
  textOnPrimary: string;
  textOnSecondary: string;

  // Semantic
  success: string;
  successBackground: string;
  warning: string;
  warningBackground: string;
  error: string;
  errorBackground: string;
  info: string;
  infoBackground: string;

  // Misc
  border: string;
  borderHover: string;
  focus: string;
  shadow: string;
}

export interface ThemeTypography {
  fontFamily: string;
  fontFamilyMono: string;
  fontFamilyDisplay: string;

  // Font sizes
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };

  // Font weights
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };

  // Line heights
  lineHeight: {
    tight: string;
    normal: string;
    relaxed: string;
  };

  // Letter spacing
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface ThemeSpacing {
  px: string;
  0: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  4: string;
  5: string;
  6: string;
  8: string;
  10: string;
  12: string;
  16: string;
  20: string;
  24: string;
}

export interface ThemeBorderRadius {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  full: string;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  base: string;
  md: string;
  lg: string;
  xl: string;
  inner: string;
  glow: string;
}

export interface ThemeTransitions {
  fast: string;
  base: string;
  slow: string;
  bounce: string;
}

export interface Theme {
  name: string;
  displayName: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  spacing: ThemeSpacing;
  borderRadius: ThemeBorderRadius;
  shadows: ThemeShadows;
  transitions: ThemeTransitions;
}

export type ThemeName =
  | 'cupertino'
  | 'roseGold'
  | 'glass'
  | 'brutalist'
  | 'minimal'
  | 'retrowave'
  | 'darkLuxe'
  | 'forest';
