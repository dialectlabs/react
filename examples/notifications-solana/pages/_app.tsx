import 'tailwindcss/tailwind.css';
import '@dialectlabs/react-ui/index.css';
import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { SolanaWalletContext } from '../components/SolanaWallet';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <SolanaWalletContext>
      <Component {...pageProps} />
    </SolanaWalletContext>
  );
}
export default MyApp;
