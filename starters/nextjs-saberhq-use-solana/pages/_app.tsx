import { AppProps } from 'next/app';
import { FC } from 'react';
import { SolanaProvider } from '@saberhq/use-solana';

require('@solana/wallet-adapter-react-ui/styles.css');
require('@dialectlabs/react-ui/index.css');
require('../styles/globals.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <SolanaProvider>
      <Component {...pageProps} />
    </SolanaProvider>
  );
};

export default App;
