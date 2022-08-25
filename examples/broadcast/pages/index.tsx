import {
  Backend,
  Broadcast,
  Config,
  DialectContextProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  ThemeProvider,
} from '@dialectlabs/react-ui';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { useEffect, useMemo, useState } from 'react';
import { Wallet } from '../components/Wallet';

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
  return (
    <div className="dialect">
      <div className="flex flex-col min-h-screen bg-black">
        <div className="flex flex-row justify-end p-2 items-center space-x-6">
          <Wallet />
        </div>
        <div className="w-full px-6 max-w-[600px] m-auto">
          <div className="overflow-auto h-full rounded-2xl shadow-2xl shadow-neutral-800 border border-neutral-600">
            <Broadcast />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const wallet = useWallet();
  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud],
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      encryptionKeysStore: 'session-storage',
    }),
    []
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
