import { Theme } from '../types/theme';

/**
 * Glass Theme - "Desert Mirage"
 *
 * Warm glassmorphism inspired by heat mirages shimmering over golden dunes.
 * A radical departure from cold blue glass aesthetics — this theme embraces
 * amber, rose, and terracotta tones that feel like liquid sunset trapped
 * behind frosted crystal. The warm palette creates an inviting, luxurious
 * atmosphere while maintaining that signature glass translucency.
 *
 * Key aesthetic: Heat shimmer + golden hour + crystalline luxury
 */
export const glassTheme: Theme = {
  name: 'glass',
  displayName: 'Glass',
  colors: {
    // Molten amber primary — like liquid gold behind glass
    primary: '#F59E0B',
    primaryHover: '#D97706',
    primaryActive: '#B45309',
    // Dusty rose secondary — desert flower at twilight
    secondary: '#E879A9',
    secondaryHover: '#DB2777',
    secondaryActive: '#BE185D',
    // Burnt sienna accent — terracotta warmth
    accent: '#EA580C',
    accentHover: '#C2410C',

    // Warm gradient: peach cream through rose quartz to dusty mauve
    background: 'linear-gradient(145deg, #FEF3E2 0%, #FECDD3 35%, #E9D5FF 70%, #DDD6FE 100%)',
    backgroundAlt: 'rgba(255, 255, 255, 0.45)',
    backgroundElevated: 'rgba(255, 255, 255, 0.6)',
    backgroundOverlay: 'rgba(120, 53, 15, 0.5)',

    // Warm frosted glass — like sand-dusted crystal
    surface: 'rgba(255, 255, 255, 0.55)',
    surfaceHover: 'rgba(255, 255, 255, 0.7)',
    surfaceActive: 'rgba(255, 255, 255, 0.8)',
    surfaceBorder: 'rgba(180, 83, 9, 0.2)',

    // Rich warm text colors for optimal contrast
    text: '#78350F',
    textSecondary: '#92400E',
    textMuted: '#B45309',
    textOnPrimary: '#FFFBEB',
    textOnSecondary: '#FFF1F2',

    // Status colors harmonized with warm palette
    success: '#059669',
    successBackground: 'rgba(5, 150, 105, 0.15)',
    warning: '#CA8A04',
    warningBackground: 'rgba(202, 138, 4, 0.18)',
    error: '#DC2626',
    errorBackground: 'rgba(220, 38, 38, 0.12)',
    info: '#7C3AED',
    infoBackground: 'rgba(124, 58, 237, 0.12)',

    border: 'rgba(180, 83, 9, 0.15)',
    borderHover: 'rgba(180, 83, 9, 0.3)',
    focus: 'rgba(245, 158, 11, 0.5)',
    shadow: 'rgba(120, 53, 15, 0.15)',
  },
  typography: {
    // Elegant serif-influenced display with clean body text
    fontFamily:
      '"Outfit", "Sora", "DM Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    fontFamilyMono: '"IBM Plex Mono", "JetBrains Mono", monospace',
    fontFamilyDisplay: '"Fraunces", "Playfair Display", Georgia, serif',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.3rem',
      '2xl': '1.625rem',
      '3xl': '2rem',
      '4xl': '2.5rem',
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
      normal: '1.55',
      relaxed: '1.7',
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '-0.01em',
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
    sm: '0.5rem',
    base: '0.875rem',
    md: '1.125rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '2.5rem',
    full: '9999px',
  },
  shadows: {
    none: 'none',
    sm: '0 2px 8px rgba(120, 53, 15, 0.08), 0 1px 3px rgba(180, 83, 9, 0.06)',
    base: '0 4px 16px rgba(120, 53, 15, 0.1), 0 2px 6px rgba(180, 83, 9, 0.08)',
    md: '0 8px 30px rgba(120, 53, 15, 0.12), 0 4px 12px rgba(180, 83, 9, 0.08)',
    lg: '0 16px 50px rgba(120, 53, 15, 0.14), 0 8px 20px rgba(180, 83, 9, 0.1)',
    xl: '0 24px 70px rgba(120, 53, 15, 0.18), 0 12px 30px rgba(180, 83, 9, 0.12)',
    inner: 'inset 0 2px 8px rgba(120, 53, 15, 0.08)',
    glow: '0 0 50px rgba(245, 158, 11, 0.35), 0 0 20px rgba(234, 88, 12, 0.2)',
  },
  transitions: {
    fast: '120ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '220ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '380ms cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: '500ms cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// Special glass-specific effects for the Desert Mirage theme
export const glassEffects = {
  // Warm blur that mimics heat shimmer
  backdrop: 'blur(24px) saturate(180%) brightness(1.05)',
  backdropHeavy: 'blur(40px) saturate(200%) brightness(1.08)',
  // Gradient border mimicking light refraction
  borderGradient:
    'linear-gradient(135deg, rgba(245, 158, 11, 0.4), rgba(232, 121, 169, 0.25), rgba(255, 255, 255, 0.3))',
  // Warm ambient glow
  mirageGlow: '0 0 80px rgba(245, 158, 11, 0.25), 0 0 40px rgba(234, 88, 12, 0.15)',
  // Subtle shimmer overlay effect
  shimmerOverlay: 'linear-gradient(110deg, transparent 25%, rgba(255, 255, 255, 0.3) 50%, transparent 75%)',
};
