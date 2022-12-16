import '@dialectlabs/react-ui/index.css';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'tailwindcss/tailwind.css';
import { AptosWalletContext } from '../components/AptosWallet';
import { EvmWalletContext } from '../components/EvmWallet';
import { SolanaWalletContext } from '../components/SolanaWallet';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <SolanaWalletContext>
        <AptosWalletContext>
          <EvmWalletContext>
            <Component {...pageProps} />
          </EvmWalletContext>
        </AptosWalletContext>
      </SolanaWalletContext>
    </>
  );
}
export default MyApp;
