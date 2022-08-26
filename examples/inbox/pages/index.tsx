import {
  Backend,
  ChatNavigationHelpers,
  Config,
  DialectContextProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  Inbox as DialectInbox,
  ThemeProvider,
  useDialectUiId,
} from '@dialectlabs/react-ui';
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import { Wallet } from '../components/Wallet';

import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import { SNSIdentityResolver } from '@dialectlabs/identity-sns';
import { CardinalTwitterIdentityResolver } from '@dialectlabs/identity-cardinal';

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey!,
  connected:
    wallet.connected &&
    !wallet.connecting &&
    !wallet.disconnecting &&
    Boolean(wallet.publicKey),
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
      }
    : undefined,
});

function AuthedHome() {
  const { navigation } = useDialectUiId<ChatNavigationHelpers>('dialect-inbox');

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
          />
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud, Backend.Solana],
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      solana: {
        rpcUrl: connection.rpcEndpoint,
      },
      identity: {
        resolvers: [
          new DialectDappsIdentityResolver(),
          new SNSIdentityResolver(connection),
          new CardinalTwitterIdentityResolver(connection),
        ],
      },
    }),
    [connection]
  );

  return (
    <DialectContextProvider
      wallet={dialectWalletAdapter}
      config={dialectConfig}
    >
      <DialectUiManagementProvider>
        <ThemeProvider theme={'dark'}>
          <AuthedHome />
        </ThemeProvider>
      </DialectUiManagementProvider>
    </DialectContextProvider>
  );
}
