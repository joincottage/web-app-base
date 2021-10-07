import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { createTheme } from '@material-ui/core/styles';
import { red } from '@material-ui/core/colors';

// Create a theme instance.
const theme = createTheme({
  palette: {
    primary: {
      light: 'rgb(31,87,184)',
      main: 'rgb(31,87,184)',
      dark: 'rgb(31,87,184)'
    },
    secondary: {
      light: 'rgb(31,87,184)',
      main: 'rgb(31,87,184)',
      dark: 'rgb(31,87,184)'
    },
  },
  typography: {
    fontFamily: '"Poppins", sans serif'
  }
});

export default theme;
