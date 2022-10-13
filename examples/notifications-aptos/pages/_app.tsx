import '@dialectlabs/react-ui/index.css';
import type { AppProps } from 'next/app';
import 'tailwindcss/tailwind.css';
import { AptosWalletContext } from '../components/AptosWallet';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AptosWalletContext>
      <Component {...pageProps} />
    </AptosWalletContext>
  );
}
export default MyApp;
