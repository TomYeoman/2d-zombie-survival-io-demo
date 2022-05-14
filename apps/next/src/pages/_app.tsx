/* eslint-disable @next/next/no-sync-scripts */
import React from 'react';
import Head from 'next/head';
import Layout from '@components/layout'
import { MoralisProvider } from 'react-moralis';
import { ParallaxProvider } from 'react-scroll-parallax';
import { AppProps } from 'next/app';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../../styles/theme';
import createEmotionCache from '../lib/utils/createEmotionCache';
const clientSideEmotionCache = createEmotionCache();
import '@stripe/stripe-js';
interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}
const APP_ID = process.env.NEXT_PUBLIC_MORALIS_APPLICATION_ID as string;
const SERVER_URL = process.env.NEXT_PUBLIC_MORALIS_SERVER_URL as string;

function MyApp(props: MyAppProps) {
  const isServerInfo = APP_ID && SERVER_URL ? true : false;
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  return isServerInfo ? (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>My page</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <script
          src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA3XOn42g_kW2DDuVgwsZ-Q2jdrRbAvzY"
          type="text/javascript"
          key="maps"
        />
      </Head>
      <MoralisProvider appId={APP_ID} serverUrl={SERVER_URL}>
        <ThemeProvider theme={theme}>
          <ParallaxProvider>
            <Layout>
              <CssBaseline />
              <Component isServerInfo {...pageProps} />
            </Layout>
          </ParallaxProvider>
        </ThemeProvider>
      </MoralisProvider>
    </CacheProvider>
  ) : (
    <div>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>My page</title>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
          <script
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBA3XOn42g_kW2DDuVgwsZ-Q2jdrRbAvzY"
            type="text/javascript"
            key="maps"
          />
        </Head>
        <ThemeProvider theme={theme}>
          <ParallaxProvider>
            <Layout>
              <CssBaseline />
              <Component {...pageProps} />
            </Layout>
          </ParallaxProvider>
        </ThemeProvider>
      </CacheProvider>
    </div>
  );
}

export default MyApp;