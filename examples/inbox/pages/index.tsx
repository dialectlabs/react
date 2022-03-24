import React, { useEffect } from 'react';
import { Wallet, WalletContext } from '../components/Wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { Inbox as DialectInbox } from '@dialectlabs/react-ui';
import {
  ApiProvider,
  connected,
  DialectProvider,
  useApi,
} from '@dialectlabs/react';
import { ThemeProvider } from '@dialectlabs/react-ui/components/common/ThemeProvider';

function AuthedHome() {
  const wallet = useWallet();
  const isWalletConnected = connected(wallet);

  const { setNetwork, setRpcUrl, setWallet } = useApi();

  useEffect(
    () => setWallet(connected(wallet) ? wallet : null),
    [setWallet, wallet, isWalletConnected]
  );
  useEffect(() => setNetwork('localnet'), [setNetwork]);
  useEffect(() => setRpcUrl(null), [setRpcUrl]);

  return (
    <>
      <div className="flex flex-col h-screen bg-black">
        <Wallet />
        <DialectInbox wallet={wallet} />
      </div>
    </>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <ApiProvider>
        <DialectProvider>
          <ThemeProvider theme={'dark'}>
            <AuthedHome />
          </ThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </WalletContext>
  );
}
