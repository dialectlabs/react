import 'tailwindcss/tailwind.css';
import '../styles/globals.css';
import '@dialectlabs/react-ui/index.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { WalletContext } from '../components/Wallet';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WalletContext>
      <Component {...pageProps} />
    </WalletContext>
  );
}
export default MyApp;
