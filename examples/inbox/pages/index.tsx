import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Inbox as DialectInbox, ThemeProvider } from '@dialectlabs/react-ui';
import {
  ApiProvider,
  connected,
  DialectProvider,
  useApi,
} from '@dialectlabs/react';
import { Wallet, WalletContext } from '../components/Wallet';
import { WalletIdentityProvider } from '@cardinal/namespaces-components';

function AuthedHome() {
  const wallet = useWallet();
  const isWalletConnected = connected(wallet);

  const { setNetwork, setRpcUrl, setWallet } = useApi();

  useEffect(
    () => setWallet(connected(wallet) ? wallet : null),
    [setWallet, wallet, isWalletConnected]
  );
  useEffect(() => setNetwork('mainnet'), [setNetwork]);
  useEffect(
    () =>
      setRpcUrl(
        'https://solana-api.syndica.io/access-token/6sW38nSZ1Qm4WVRN4Vnbjb9EF2QudlpGZBToMtPyqoXqkIenDwJ5FVK1HdWSqqah/rpc'
      ),
    [setRpcUrl]
  );

  return (
    <div className="dialect">
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-row-reverse">
          <Wallet />
        </div>
        <DialectInbox wallet={wallet} />
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <ApiProvider>
        <DialectProvider>
          <WalletIdentityProvider>
            <ThemeProvider theme={'dark'}>
              <AuthedHome />
            </ThemeProvider>
          </WalletIdentityProvider>
        </DialectProvider>
      </ApiProvider>
    </WalletContext>
  );
}
