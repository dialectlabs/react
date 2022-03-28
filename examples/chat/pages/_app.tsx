import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import '@dialectlabs/react-ui/index.css';
import React from 'react';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
