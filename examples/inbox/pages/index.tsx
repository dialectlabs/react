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
    <div className="dialect">
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-row-reverse">
          <Wallet />
        </div>
        <div className="w-full lg:max-w-[1048px] px-6 h-[calc(100vh-8rem)] mt-8 mx-auto">
          <DialectInbox
            wrapperClassName="p-2 h-full overflow-hidden rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600"
            wallet={wallet}
          />
        </div>
      </div>
    </div>
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
