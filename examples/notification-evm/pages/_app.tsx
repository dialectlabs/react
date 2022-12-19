import '@dialectlabs/react-ui/index.css';
import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { EvmWalletContext } from '../components/EvmWallet';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <EvmWalletContext>
      <Component {...pageProps} />
    </EvmWalletContext>
  );
}
export default MyApp;
