import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { CardinalTwitterIdentityResolver } from '@dialectlabs/identity-cardinal';
import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import { SNSIdentityResolver } from '@dialectlabs/identity-sns';
import {
  AptosConfigProps,
  DialectAptosSdk,
  DialectAptosWalletAdapter,
} from '@dialectlabs/react-sdk-blockchain-aptos';
import {
  DialectSolanaSdk,
  DialectSolanaWalletAdapter,
  SolanaConfigProps,
} from '@dialectlabs/react-sdk-blockchain-solana';
import {
  BottomChat,
  ChatNavigationHelpers,
  ConfigProps,
  defaultVariables,
  DialectNoBlockchainSdk,
  DialectThemeProvider,
  DialectUiManagementProvider,
  IncomingThemeVariables,
  useDialectUiId,
} from '@dialectlabs/react-ui';
import { useWallet as useAptosWallet } from '@manahippo/aptos-wallet-adapter';
import {
  useWallet as useSolanaWallet,
  useConnection as useSolanaConnection,
} from '@solana/wallet-adapter-react';
import { AptosWalletButton } from '../components/AptosWallet';
import { SolanaWalletButton } from '../components/SolanaWallet';
import {
  aptosWalletToDialectWallet,
  solanaWalletToDialectWallet,
} from '../utils/wallet';

// TODO: Use useTheme instead of explicitly importing defaultVariables
export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-12 h-12 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700',
    slider:
      'sm:rounded-t-3xl shadow-xl shadow-neutral-900 sm:border-t sm:border-l sm:border-r border-neutral-800',
  },
  light: {
    bellButton:
      'w-12 h-12 shadow-md hover:shadow-lg shadow-neutral-300 hover:shadow-neutral-400 text-teal',
    slider:
      'sm:border-t sm:border-l sm:border-r border-border-light shadow-lg shadow-neutral-300 sm:rounded-t-3xl',
    colors: {
      textPrimary: 'text-dark',
    },
    button: `${defaultVariables.light.button} border-none bg-pink`,
    highlighted: `${defaultVariables.light.highlighted} bg-light border border-border-light`,
    input: `${defaultVariables.light.input} border-b-teal focus:ring-teal text-teal`,
    iconButton: `${defaultVariables.light.iconButton} hover:text-teal hover:opacity-100`,
    avatar: `${defaultVariables.light.avatar} bg-light`,
    messageBubble: `${defaultVariables.light.messageBubble} border-none bg-blue text-black`,
    sendButton: `${defaultVariables.light.sendButton} bg-teal`,
  },
};

function AuthedHome() {
  const { ui, open, close, navigation } = useDialectUiId<ChatNavigationHelpers>(
    'dialect-bottom-chat'
  );

  return (
    <>
      <div className="flex flex-col h-screen bg-white dark:bg-black">
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <SolanaWalletButton />
          <AptosWalletButton />
        </div>
        <div className="h-full text-2xl flex flex-col justify-center items-center">
          <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
            @dialectlabs/react
          </code>
          <div>
            <code className="shrink text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B852DC] to-[#59C29D] mb-2 block">
              examples/bottom-chat
            </code>
            <div className="text-sm space-x-2 flex justify-center">
              <button
                className="btn-primary"
                onClick={() => {
                  open();

                  navigation?.showCreateThread('@saydialect');
                }}
              >
                Chat with @saydialect
              </button>
              <button className="btn-primary" onClick={ui?.open ? close : open}>
                {ui?.open ? 'Close' : 'Open'}
              </button>
            </div>
          </div>
        </div>
        <BottomChat dialectId="dialect-bottom-chat" />
      </div>
    </>
  );
}

export default function Home(): JSX.Element {
  const { connection: solanaConnection } = useSolanaConnection();
  const solanaWallet = useSolanaWallet();
  const aptosWallet = useAptosWallet();

  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] =
    useState<DialectSolanaWalletAdapter | null>(null);
  const [dialectAptosWalletAdapter, setDialectAptosWalletAdapter] =
    useState<DialectAptosWalletAdapter | null>(null);

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(solanaWallet));
  }, [solanaWallet]);

  useEffect(() => {
    if (!aptosWallet.wallet) return;
    setDialectAptosWalletAdapter(
      aptosWalletToDialectWallet(aptosWallet.wallet.adapter)
    );
  }, [aptosWallet]);

  const dialectConfig = useMemo(
    (): ConfigProps => ({
      environment: 'development',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      identity: {
        resolvers: [
          new DialectDappsIdentityResolver(),
          new SNSIdentityResolver(solanaConnection),
          new CardinalTwitterIdentityResolver(solanaConnection),
        ],
      },
    }),
    [solanaConnection]
  );

  const solanaConfig: SolanaConfigProps = useMemo(
    () => ({
      wallet: dialectSolanaWalletAdapter,
    }),
    [dialectSolanaWalletAdapter]
  );

  const aptosConfig: AptosConfigProps = useMemo(
    () => ({
      wallet: dialectAptosWalletAdapter,
    }),
    [dialectAptosWalletAdapter]
  );

  const DialectProviders: React.FC<{ children: React.ReactNode }> = useCallback(
    (props: { children: React.ReactNode }) => {
      if (dialectSolanaWalletAdapter) {
        return (
          <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
            {props.children}
          </DialectSolanaSdk>
        );
      }
      if (dialectAptosWalletAdapter) {
        return (
          <DialectAptosSdk config={dialectConfig} aptosConfig={aptosConfig}>
            {props.children}
          </DialectAptosSdk>
        );
      }
      return <DialectNoBlockchainSdk>{props.children}</DialectNoBlockchainSdk>;
    },
    [
      aptosConfig,
      dialectAptosWalletAdapter,
      dialectConfig,
      dialectSolanaWalletAdapter,
      solanaConfig,
    ]
  );

  return (
    <DialectProviders>
      <DialectUiManagementProvider>
        <DialectThemeProvider theme="dark" variables={themeVariables}>
          <AuthedHome />
        </DialectThemeProvider>
      </DialectUiManagementProvider>
    </DialectProviders>
  );
}
