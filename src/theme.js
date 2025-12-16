import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#fffff7',
      paper: '132440',
      navbar: 'rgba(255, 255, 255, 0.5)',
      card: '#f5f5f5',
    },
    text: {
      primary: '#000000',
      link: '#a10000', // Link color for light mode
    },
  },
  shadows: {
    card: '0 4px 12px rgba(0, 0, 0, 0.1)',
    cardHover: '0 8px 20px rgba(0, 0, 0, 0.15)',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#000000',
      paper: '#0F0F0F',
      navbar: 'rgba(20, 20, 20, 0.5)',
      card: '#1a1a1a',
    },
    text: {
      primary: '#ffffff',
      link: '#ff6b6b', // Link color for dark mode (lighter red)
    },
  },
  shadows: {
    card: '0 4px 12px rgba(0, 0, 0, 0.3)',
    cardHover: '0 8px 20px rgba(0, 0, 0, 0.4)',
  },
});