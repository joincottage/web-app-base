import React, { useMemo, useReducer } from 'react';
import Head from 'next/head';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../theme';
import { Navbar } from '../components/Navbar';
import { UserProvider } from '@auth0/nextjs-auth0';
import { AppProps } from 'next/app';
import {
  AppAction,
  AppContext,
  AppDataContext,
  AppState,
  initialState,
} from '../contexts/AppContext';
import 'tailwindcss/tailwind.css';

function appReducer(state: AppState, action: AppAction) {
  switch (action.type) {
    case 'SET_SELECTED_CLIENT':
      return {
        ...state,
        client: action.payload.client,
      };
    default:
      // TODO: report unknown action types as an error
      throw new Error(`Unrecognized action: ${action.type}`);
  }
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props;
  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    }
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(appReducer, initialState);
  const contextValue = useMemo(() => {
    return { state, dispatch };
  }, [state, dispatch]) as AppContext;

  return (
    <UserProvider>
      <AppDataContext.Provider value={contextValue}>
        <Head>
          <title>Cottage</title>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width"
          />
        </Head>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Navbar />
          <Component {...pageProps} />
        </ThemeProvider>
      </AppDataContext.Provider>
    </UserProvider>
  );
}
