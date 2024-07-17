import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    appBar: {
      main: '090918', // Set the AppBar background for light mode
    },
    text: {
      primary: '#000000', // Set the text color for light mode
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    background: {
      default: '#09090A',
      paper: '#121212',
    },
    appBar: {
      main: '#333333', // Set the AppBar background for dark mode
    },
    text: {
      primary: '#ffffff', // Set the text color for dark mode
    },
  },
});
