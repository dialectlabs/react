import { DialectContextProvider } from '@dialectlabs/react-sdk';
import {
  ChatNavigationHelpers,
  DialectUiManagementProvider,
  Inbox as DialectInbox,
  ThemeProvider,
  useDialectUiId,
} from '@dialectlabs/react-ui';
import { Backend, DialectWalletAdapter } from '@dialectlabs/sdk';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useEffect, useState } from 'react';
import { Wallet } from '../components/Wallet';

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey || PublicKey.default,
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        //@ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
      }
    : undefined,
});

function AuthedHome() {
  const wallet = useWallet();
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
            wallet={wallet}
          />
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

  return (
    <DialectContextProvider
      wallet={dialectWalletAdapter}
      environment="local-development"
      backends={[Backend.Solana]}
    >
      <DialectUiManagementProvider>
        <ThemeProvider theme={'dark'}>
          <AuthedHome />
        </ThemeProvider>
      </DialectUiManagementProvider>
    </DialectContextProvider>
  );
}
