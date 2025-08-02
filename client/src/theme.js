import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#003366', // --color-primary
      light: '#007ACC', // --color-secondary
      dark: '#001a33',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#F4B400', // --color-accent
      light: '#FFD54F',
      dark: '#F57F17',
      contrastText: '#000000',
    },
    success: {
      main: '#3BAF75', // --color-success
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    warning: {
      main: '#FFC107', // --color-warning
      light: '#FFD54F',
      dark: '#F57F17',
    },
    error: {
      main: '#DC3545', // --color-error
      light: '#EF5350',
      dark: '#C62828',
    },
    info: {
      main: '#17A2B8', // --color-info
      light: '#4FC3F7',
      dark: '#0277BD',
    },
    background: {
      default: '#FFFFFF', // --color-background
      paper: '#F2F2F2', // --color-background-alt
    },
    text: {
      primary: '#000000', // --color-text-primary
      secondary: '#4F4F4F', // --color-text-secondary
    },
    divider: 'rgba(0, 0, 0, 0.12)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    h1: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '36px',
      fontWeight: 600,
      lineHeight: 1.2,
      color: '#003366',
    },
    h2: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '30px',
      fontWeight: 600,
      lineHeight: 1.3,
      color: '#003366',
    },
    h3: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '24px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#003366',
    },
    h4: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#000000',
    },
    h5: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '18px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#000000',
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 1.4,
      color: '#000000',
    },
    body1: {
      fontSize: '16px',
      lineHeight: 1.6,
      color: '#000000',
    },
    body2: {
      fontSize: '14px',
      lineHeight: 1.5,
      color: '#4F4F4F',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      fontSize: '16px',
    },
    caption: {
      fontSize: '12px',
      color: '#4F4F4F',
    },
  },
  shape: {
    borderRadius: 8, // --border-radius-md
  },
  spacing: 8, // Base spacing unit
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 600,
          fontSize: '16px',
          textTransform: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
          },
        },
        contained: {
          '&.MuiButton-containedPrimary': {
            backgroundColor: '#003366',
            '&:hover': {
              backgroundColor: '#001a33',
            },
          },
          '&.MuiButton-containedSecondary': {
            backgroundColor: '#F4B400',
            color: '#000000',
            '&:hover': {
              backgroundColor: '#F57F17',
            },
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
          },
        },
        sizeSmall: {
          padding: '4px 12px',
          fontSize: '14px',
        },
        sizeLarge: {
          padding: '12px 24px',
          fontSize: '18px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12, // --border-radius-lg
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
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
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
        elevation2: {
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.15)',
        },
        elevation3: {
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16, // --border-radius-xl
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
            },
            '&:hover fieldset': {
              borderColor: '#003366',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#003366',
            },
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
        standardSuccess: {
          backgroundColor: '#3BAF75',
          color: '#FFFFFF',
        },
        standardError: {
          backgroundColor: '#DC3545',
          color: '#FFFFFF',
        },
        standardWarning: {
          backgroundColor: '#FFC107',
          color: '#000000',
        },
        standardInfo: {
          backgroundColor: '#17A2B8',
          color: '#FFFFFF',
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 8,
          },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          backgroundColor: '#003366',
          '&:hover': {
            backgroundColor: '#001a33',
          },
        },
        secondary: {
          backgroundColor: '#F4B400',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#F57F17',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid rgba(0, 0, 0, 0.12)',
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: '#4F4F4F',
          '&.Mui-selected': {
            color: '#003366',
          },
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default theme; 