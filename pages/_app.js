import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '@/styles/globals.css';
import Layout from '@/components/Layout';
import { AuthProvider } from '@/contexts/AuthContext';

// Google Tag Manager ID
const GTM_ID = 'GTM-NRJRBCB9';

// Add global CSS reset
const globalStyles = `
  html, body, #__next {
    margin: 0;
    padding: 0;
    width: 100%;
    min-height: 100%;
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
`;

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#2E5077', // Rich blue
      light: '#4A78A9',
      dark: '#1A3A5F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E85F5C', // Coral red
      light: '#FF8A87',
      dark: '#B23C39',
      contrastText: '#ffffff',
    },
    tertiary: {
      main: '#4ECDC4', // Teal
      light: '#7EEAE3',
      dark: '#2BA39B',
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
    divider: 'rgba(0, 0, 0, 0.08)',
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
      lineHeight: 1.4,
      letterSpacing: '0em',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
      lineHeight: 1.4,
      letterSpacing: '0.00735em',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
      lineHeight: 1.5,
      letterSpacing: '0em',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.6,
      letterSpacing: '0.0075em',
    },
    subtitle1: {
      fontSize: '1rem',
      lineHeight: 1.75,
      letterSpacing: '0.00938em',
    },
    subtitle2: {
      fontSize: '0.875rem',
      lineHeight: 1.57,
      letterSpacing: '0.00714em',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
      letterSpacing: '0.00938em',
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
      letterSpacing: '0.01071em',
    },
    button: {
      fontSize: '0.875rem',
      lineHeight: 1.75,
      letterSpacing: '0.02857em',
      fontWeight: 600,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 10,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.05)',
    '0px 4px 6px rgba(0,0,0,0.07)',
    '0px 6px 12px rgba(0,0,0,0.08)',
    '0px 8px 16px rgba(0,0,0,0.09)',
    '0px 10px 20px rgba(0,0,0,0.1)',
    '0px 12px 24px rgba(0,0,0,0.11)',
    '0px 14px 28px rgba(0,0,0,0.12)',
    '0px 16px 32px rgba(0,0,0,0.13)',
    '0px 18px 36px rgba(0,0,0,0.14)',
    '0px 20px 40px rgba(0,0,0,0.15)',
    '0px 22px 44px rgba(0,0,0,0.16)',
    '0px 24px 48px rgba(0,0,0,0.17)',
    '0px 26px 52px rgba(0,0,0,0.18)',
    '0px 28px 56px rgba(0,0,0,0.19)',
    '0px 30px 60px rgba(0,0,0,0.2)',
    '0px 32px 64px rgba(0,0,0,0.21)',
    '0px 34px 68px rgba(0,0,0,0.22)',
    '0px 36px 72px rgba(0,0,0,0.23)',
    '0px 38px 76px rgba(0,0,0,0.24)',
    '0px 40px 80px rgba(0,0,0,0.25)',
    '0px 42px 84px rgba(0,0,0,0.26)',
    '0px 44px 88px rgba(0,0,0,0.27)',
    '0px 46px 92px rgba(0,0,0,0.28)',
    '0px 48px 96px rgba(0,0,0,0.29)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarWidth: 'thin',
          '&::-webkit-scrollbar': {
            width: '8px',
            height: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#bdbdbd',
            borderRadius: '4px',
            '&:hover': {
              background: '#a0a0a0',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.Mui-disabled': {
            backgroundColor: '#E0E0E0',
            color: '#9E9E9E',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderWidth: '2px',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        elevation1: {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        },
        elevation2: {
          boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        },
        head: {
          fontWeight: 600,
          backgroundColor: '#F8F9FA',
        },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: 12,
      },
      elevation1: {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
      elevation2: {
        boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiDivider: {
    styleOverrides: {
      root: {
        borderColor: 'rgba(0, 0, 0, 0.08)',
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
      },
      head: {
        fontWeight: 600,
        backgroundColor: '#F8F9FA',
      },
    },
  },
});

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize GTM
    if (typeof window !== 'undefined') {
      // Initialize dataLayer if it doesn't exist
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
      });

      // Track page views on route change
      const handleRouteChange = (url) => {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'pageview',
            page: url,
          });
        }
      };

      // Track initial page load
      handleRouteChange(window.location.pathname);

      // Track subsequent page views
      router.events.on('routeChangeComplete', handleRouteChange);

      // Clean up event listener
      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
      };
    }
  }, [router.events]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Layout>
          <Component {...pageProps} />
          <ToastContainer position="bottom-right" />
        </Layout>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default MyApp;