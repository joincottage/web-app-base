import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme } from '@mui/material/styles';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      light: 'rgb(31,87,184)',
      main: 'rgb(31,87,184)',
      dark: 'rgb(31,87,184)',
    },
    secondary: {
      light: 'rgb(222,233,252)',
      main: 'rgb(222,233,252)',
      dark: 'rgb(222,233,252)',
    },
  },
  typography: {
    fontFamily: '"Avenir Next LT Pro Regular", sans serif',
  },
  components: {
    // Name of the component
    MuiTypography: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          margin: 'initial',
        },
      },
    },
  },
});

export default theme;
