import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Navbar } from '../components/NavbarTW';
import '../styles/globals.css';
import { Footer } from '../components/Footer';
import { UserProvider } from '@auth0/nextjs-auth0';

export default function MyApp(props) {
  const { Component, pageProps } = props;

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);

  return (
    <UserProvider>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </UserProvider>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
