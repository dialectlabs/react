import React, { useEffect, useState } from 'react';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
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
import { DialectContext } from '@dialectlabs/react-sdk';
import { Backend, DialectWalletAdapter } from '@dialectlabs/sdk';

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey || PublicKey.default, // TODO: should be fixed when sdk would allow publicKey as optional
  signMessage: wallet.signMessage,
  signTransaction: wallet.signTransaction,
  signAllTransactions: wallet.signAllTransactions,
  //@ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        //@ts-ignore
        const res = await wallet.wallet?.adapter?._wallet?.diffieHellman(
          pubKey
        );
        console.log(res);
        return res;
      }
    : undefined,
});

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

  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  return (
    <DialectContext
      wallet={dialectWalletAdapter}
      environment="local-development"
      backends={[Backend.Solana]}
      solana={{
        dialectProgramAddress: new PublicKey(
          '7SWnT1GN99ZphthSHUAzWdMhKGfuvCypvj1m2mvdvHqY'
        ),
      }}
    >
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
    </DialectContext>
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
