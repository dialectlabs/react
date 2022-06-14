import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Inbox as DialectInbox,
  DialectUiManagementProvider,
  useDialectUiId,
  ChatRouteName,
  ChatMainRouteName,
  ThemeProvider,
  ChatNavigationHelpers,
} from '@dialectlabs/react-ui';
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
  const { navigation } = useDialectUiId<ChatNavigationHelpers>('dialect-inbox');

  useEffect(
    () => setWallet(connected(wallet) ? wallet : null),
    [setWallet, wallet, isWalletConnected]
  );
  useEffect(() => setNetwork('localnet'), [setNetwork]);
  useEffect(() => setRpcUrl(null), [setRpcUrl]);

  return (
    <div className="dialect">
      <div className="flex flex-col h-screen bg-black">
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <button
            className="btn-primary"
            onClick={() => {
              navigation?.showCreateThread('@saydialect');
            }}
          >
            Message @saydialect
          </button>
          <Wallet />
        </div>
        <div className="w-full lg:max-w-[1048px] px-6 h-[calc(100vh-8rem)] mt-8 mx-auto">
          <DialectInbox
            dialectId="dialect-inbox"
            wrapperClassName="h-full overflow-hidden rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600"
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
          <DialectUiManagementProvider>
            <ThemeProvider theme={'dark'}>
              <AuthedHome />
            </ThemeProvider>
          </DialectUiManagementProvider>
        </DialectProvider>
      </ApiProvider>
    </WalletContext>
  );
}
