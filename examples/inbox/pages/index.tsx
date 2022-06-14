import React, { useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import {
  Inbox as DialectInbox,
  DialectUiManagementProvider,
  useDialectUiId,
  ChatRouteName,
  ChatMainRouteName,
  ThemeProvider,
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
  const { open, navigation } = useDialectUiId('dialect-inbox');

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
          <button
            className="py-2 px-3 bg-black text-white rounded border border-white"
            onClick={() => {
              open();
              // TODO: navigate needs better typing or documentation, since routes are internal.
              navigation?.navigate?.(ChatRouteName.Main, {
                sub: {
                  name: ChatMainRouteName.CreateThread,
                  // TODO: There is a problem with typing sub route params, and this needs to be improved, unfortunately
                  params: { receiver: '@saydialect' } as any,
                },
              });
            }}
          >
            Message dialect
          </button>
          <Wallet />
        </div>
        <div className="w-full lg:max-w-[1048px] px-6 h-[calc(100vh-8rem)] mt-8 mx-auto">
          <DialectInbox
            dialectId="dialect-inbox"
            wrapperClassName="py-2 h-full overflow-hidden rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600"
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
