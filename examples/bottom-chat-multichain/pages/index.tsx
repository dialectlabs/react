import React, { useCallback, useEffect, useState } from 'react';

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
  useConnection as useSolanaConnection,
  useWallet as useSolanaWallet,
} from '@solana/wallet-adapter-react';
import { AptosWalletButton } from '../components/AptosWallet';
import { SolanaWalletButton } from '../components/SolanaWallet';
import {
  aptosWalletToDialectWallet,
  solanaWalletToDialectWallet,
} from '../utils/wallet';
import { CivicIdentityResolver } from '@dialectlabs/identity-civic';
import {
  DialectEvmSdk,
  DialectEvmWalletAdapter,
  EvmConfigProps,
} from '@dialectlabs/react-sdk-blockchain-evm';
import { signMessage } from '@wagmi/core';
import { useAccount } from 'wagmi';
import { EvmWalletButton } from '../components/EvmWallet';

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
          <EvmWalletButton />
        </div>
        <div className="h-full text-2xl flex flex-col justify-center items-center">
          <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
            @dialectlabs/react
          </code>
          <div>
            <code className="shrink text-center text-transparent bg-clip-text bg-white mb-2 block">
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
  const { address: evmWallet, isConnected: evmWalletConnected } = useAccount();

  const [dialectSolanaWalletAdapter, setDialectSolanaWalletAdapter] =
    useState<DialectSolanaWalletAdapter | null>(null);
  const [dialectAptosWalletAdapter, setDialectAptosWalletAdapter] =
    useState<DialectAptosWalletAdapter | null>(null);

  const [dialectEvmWalletAdapter, setDialectEvmWalletAdapter] =
    useState<DialectEvmWalletAdapter | null>(null);

  useEffect(() => {
    if (!evmWalletConnected || !evmWallet) {
      setDialectEvmWalletAdapter(null);
    } else {
      console.log('ADSD');
      setDialectEvmWalletAdapter({
        address: evmWallet,
        sign: async (msg: string | Uint8Array) => {
          const res = await signMessage({ message: msg });
          return res as string;
        },
      });
    }
  }, [evmWallet, evmWalletConnected]);

  useEffect(() => {
    setDialectSolanaWalletAdapter(solanaWalletToDialectWallet(solanaWallet));
  }, [solanaWallet]);

  useEffect(() => {
    if (!aptosWallet.wallet) return;
    setDialectAptosWalletAdapter(
      aptosWalletToDialectWallet(aptosWallet.wallet.adapter)
    );
  }, [aptosWallet]);

  const DialectProviders: React.FC<{ children: React.ReactNode }> = useCallback(
    (props: { children: React.ReactNode }) => {
      const dialectConfig: ConfigProps = {
        environment: 'development',
        dialectCloud: {
          tokenStore: 'local-storage',
          tokenLifetimeMinutes: 60 * 24 * 7,
        },
        identity: {
          resolvers: [
            new DialectDappsIdentityResolver(),
            new SNSIdentityResolver(solanaConnection),
            new CardinalTwitterIdentityResolver(solanaConnection),
            new CivicIdentityResolver(solanaConnection),
          ],
        },
      };

      if (dialectSolanaWalletAdapter) {
        const solanaConfig: SolanaConfigProps = {
          wallet: dialectSolanaWalletAdapter,
        };

        return (
          <DialectSolanaSdk config={dialectConfig} solanaConfig={solanaConfig}>
            {props.children}
          </DialectSolanaSdk>
        );
      }
      if (dialectAptosWalletAdapter) {
        const aptosConfig: AptosConfigProps = {
          wallet: dialectAptosWalletAdapter,
        };

        return (
          <DialectAptosSdk config={dialectConfig} aptosConfig={aptosConfig}>
            {props.children}
          </DialectAptosSdk>
        );
      }
      if (dialectEvmWalletAdapter) {
        const evmConfig: EvmConfigProps = {
          wallet: dialectEvmWalletAdapter,
        };

        return (
          <DialectEvmSdk config={dialectConfig} evmConfig={evmConfig}>
            {props.children}
          </DialectEvmSdk>
        );
      }
      return <DialectNoBlockchainSdk>{props.children}</DialectNoBlockchainSdk>;
    },
    [
      solanaConnection,
      dialectAptosWalletAdapter,
      dialectSolanaWalletAdapter,
      dialectEvmWalletAdapter,
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
