import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

export default theme;