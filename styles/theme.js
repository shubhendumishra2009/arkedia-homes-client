/**
 * Arkedia Homes Theme Constants
 * 
 * This file contains theme constants that can be imported and used
 * throughout the application to maintain consistent styling.
 * 
 * Enhanced with additional design elements for a more cohesive and professional look.
 */

// Color palette
export const colors = {
  primary: {
    main: '#2E5077',
    light: '#4A78A9',
    dark: '#1A3A5F',
    contrastText: '#ffffff',
    gradient: 'linear-gradient(135deg, #2E5077 0%, #1A3A5F 100%)',
    hover: '#3A6088',
  },
  secondary: {
    main: '#E85F5C',
    light: '#FF8A87',
    dark: '#B23C39',
    contrastText: '#ffffff',
    gradient: 'linear-gradient(135deg, #E85F5C 0%, #B23C39 100%)',
    hover: '#F06D6A',
  },
  tertiary: {
    main: '#4ECDC4',
    light: '#7EEAE3',
    dark: '#2BA39B',
    contrastText: '#ffffff',
    gradient: 'linear-gradient(135deg, #4ECDC4 0%, #2BA39B 100%)',
    hover: '#5FD8D0',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F8F9FA',
    accent: '#F0F4F8',
  },
  text: {
    primary: '#2C3E50',
    secondary: '#5D6D7E',
    disabled: '#AEB6BF',
  },
  success: {
    main: '#4CAF50',
    light: '#81C784',
    dark: '#388E3C',
  },
  warning: {
    main: '#FF9800',
    light: '#FFB74D',
    dark: '#F57C00',
  },
  error: {
    main: '#F44336',
    light: '#E57373',
    dark: '#D32F2F',
  },
  grey: {
    50: '#F8F9FA',
    100: '#F1F3F5',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#868E96',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
};

// Spacing
export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '16px',
  lg: '24px',
  xl: '32px',
  xxl: '48px',
  xxxl: '64px',
};

// Shadows
export const shadows = {
  sm: '0px 2px 4px rgba(0,0,0,0.05)',
  md: '0px 4px 8px rgba(0,0,0,0.1)',
  lg: '0px 8px 16px rgba(0,0,0,0.1)',
  xl: '0px 12px 24px rgba(0,0,0,0.12)',
  xxl: '0px 16px 32px rgba(0,0,0,0.15)',
  hover: '0px 6px 12px rgba(0,0,0,0.08)',
  card: '0px 4px 12px rgba(0,0,0,0.05)',
  cardHover: '0px 8px 16px rgba(0,0,0,0.1)',
  button: '0px 4px 8px rgba(0,0,0,0.1)',
  buttonHover: '0px 6px 12px rgba(0,0,0,0.15)',
  dropdown: '0px 8px 20px rgba(0,0,0,0.1)',
};

// Border radius
export const borderRadius = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  circle: '50%',
};

// Typography
export const typography = {
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  fontWeights: {
    light: 300,
    regular: 400,
    medium: 500,
    semiBold: 600,
    bold: 700,
  },
  sizes: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.25rem',    // 20px
    xl: '1.5rem',     // 24px
    xxl: '2rem',      // 32px
    xxxl: '2.5rem',   // 40px
  },
};

// Transitions
export const transitions = {
  fast: '0.2s ease-in-out',
  medium: '0.3s ease-in-out',
  slow: '0.5s ease-in-out',
  bounce: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  elastic: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  slide: '0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

// Z-index
export const zIndex = {
  mobileStepper: 1000,
  speedDial: 1050,
  appBar: 1100,
  drawer: 1200,
  modal: 1300,
  snackbar: 1400,
  tooltip: 1500,
};

// Breakpoints
export const breakpoints = {
  xs: '0px',
  sm: '600px',
  md: '960px',
  lg: '1280px',
  xl: '1920px',
};

// Animations
export const animations = {
  fadeIn: 'fadeIn 0.5s ease-in-out',
  slideUp: 'slideUp 0.5s ease-out',
  slideDown: 'slideDown 0.5s ease-in',
  slideLeft: 'slideLeft 0.3s ease-in-out',
  slideRight: 'slideRight 0.3s ease-in-out',
  pulse: 'pulse 2s infinite',
  bounce: 'bounce 0.5s',
  spin: 'spin 1s linear infinite',
};

// Gradients
export const gradients = {
  primary: 'linear-gradient(135deg, #2E5077 0%, #1A3A5F 100%)',
  secondary: 'linear-gradient(135deg, #E85F5C 0%, #B23C39 100%)',
  tertiary: 'linear-gradient(135deg, #4ECDC4 0%, #2BA39B 100%)',
  blueToTeal: 'linear-gradient(135deg, #2E5077 0%, #4ECDC4 100%)',
  redToBlue: 'linear-gradient(135deg, #E85F5C 0%, #2E5077 100%)',
  greyScale: 'linear-gradient(135deg, #343A40 0%, #868E96 100%)',
};

// Export default theme object that combines all constants
const theme = {
  colors,
  spacing,
  shadows,
  borderRadius,
  typography,
  transitions,
  zIndex,
  breakpoints,
  animations,
  gradients,
};

export default theme;