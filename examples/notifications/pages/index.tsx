import React, { useEffect, useMemo, useState } from 'react';
import { Backend } from '@dialectlabs/sdk';
import * as anchor from '@project-serum/anchor';
import {
  NotificationsButton,
  IncomingThemeVariables,
  defaultVariables,
  DialectUiManagementProvider,
  ThemeProvider,
} from '@dialectlabs/react-ui';
import { Wallet as WalletButton, WalletContext } from '../components/Wallet';
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react';
import Head from 'next/head';

import {
  Config,
  DialectContextProvider,
  DialectWalletAdapter,
} from '@dialectlabs/react-sdk';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'D2pyBevYb6dit1oCx6e8vCxFK9mBeYCRe8TTntk2Tm98'
);

export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-10 h-10 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700 bg-white text-black',
    modal: `${defaultVariables.dark.modal} sm:rounded-3xl shadow-xl shadow-neutral-900 sm:border border-[#ABABAB]/40`, // 0.4 opacity based on trial-and-error
  },
  animations: {
    popup: {
      enter: 'transition-all duration-300 origin-top-right',
      enterFrom: 'opacity-0 scale-75',
      enterTo: 'opacity-100 scale-100',
      leave: 'transition-all duration-100 origin-top-right',
      leaveFrom: 'opacity-100 scale-100',
      leaveTo: 'opacity-0 scale-75',
    },
  },
};

const walletToDialectWallet = (
  wallet: WalletContextState
): DialectWalletAdapter => ({
  publicKey: wallet.publicKey!,
  connected: wallet.connected && !wallet.disconnecting,
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

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
  // const wallet = useAnchorWallet();
  const wallet = useWallet();
  const [theme, setTheme] = useState<ThemeType>('dark');

  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const dialectConfig = useMemo(
    (): Config => ({
      backends: [Backend.DialectCloud, Backend.Solana],
      environment: 'local-development',
      solana: {
        rpcUrl: 'http://localhost:8080',
      },
    }),
    []
  );

  useEffect(() => {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setTheme(newColorScheme);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-black">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-row justify-end p-2 items-center space-x-2">
        <NotificationsButton
          dialectId="dialect-notifications"
          wallet={dialectWalletAdapter}
          config={dialectConfig}
          notifications={[
            { name: 'Welcome message', detail: 'On thread creation' },
          ]}
          pollingInterval={15000}
          channels={['web3', 'email', 'sms', 'telegram']}
          publicKey={DIALECT_PUBLIC_KEY}
          theme={theme}
        />
        <WalletButton />
      </div>
      <div className="h-full text-2xl flex flex-col justify-center">
        <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
          @dialectlabs/react
        </code>
        <code className="text-center text-neutral-400 dark:text-neutral-600">
          examples/
          <code className="text-neutral-900 dark:text-neutral-100">
            notifications
          </code>
        </code>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <DialectUiManagementProvider>
        <AuthedHome />
      </DialectUiManagementProvider>
    </WalletContext>
  );
}
