import {
  ConfigProps,
  defaultVariables,
  DialectThemeProvider,
  DialectUiManagementProvider,
  IncomingThemeVariables,
  NotificationsButton,
  NotificationsSingleFeed,
} from '@dialectlabs/react-ui';
import { useWallet } from '@manahippo/aptos-wallet-adapter';
import Head from 'next/head';
import { EvmWalletButton } from '../components/EvmWallet';
import { useEffect, useMemo, useState } from 'react';
import { signMessage } from '@wagmi/core';
import { useAccount } from 'wagmi';
import {
  DialectEvmSdk,
  DialectEvmWalletAdapter,
  EvmConfigProps,
} from '@dialectlabs/react-sdk-blockchain-evm';

const DAPP_EXAMPLE_ADDRESS = 'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h';

export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-10 h-10 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700 bg-white text-black',
    modal: `${defaultVariables.dark.modal} sm:border border-[#383838]/40 bg-[#141414]`, // 0.4 opacity based on trial-and-error
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

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
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
        <title>Notifications Button Example | Dialect</title>
      </Head>
      <div className="flex flex-row justify-end p-2 items-center space-x-2">
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <p className="text-white animate-pulse">Single dapp →</p>
          <NotificationsButton
            dialectId="dialect-notifications"
            dappAddress={DAPP_EXAMPLE_ADDRESS}
            notifications={[
              {
                name: 'Welcome Message',
                detail: 'Welcome message that is sent on first subscription',
              },
            ]}
            pollingInterval={15000}
            channels={['web3', 'email', 'sms', 'telegram']}
          />
        </div>
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <p className="text-white animate-pulse">Universal feed →</p>
          <NotificationsButton
            dialectId="dialect-singlefeed-notifications"
            dappAddress={DAPP_EXAMPLE_ADDRESS}
            pollingInterval={15000}
            Component={NotificationsSingleFeed}
          />
        </div>
        <EvmWalletButton />
      </div>
      <div className="h-full text-2xl flex flex-col justify-center">
        <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
          @dialectlabs/react
        </code>
        <div>
          <code className="shrink text-center text-transparent bg-clip-text bg-white mb-2 block">
            examples/notifications-evm
          </code>
        </div>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const wallet = useWallet();
  const [theme, setTheme] = useState<ThemeType>('dark');
  const { address: evmWallet, isConnected: evmWalletConnected } = useAccount();

  const [dialectEvmWalletAdapter, setDialectEvmWalletAdapter] =
    useState<DialectEvmWalletAdapter | null>(null);

  useEffect(() => {
    if (!evmWalletConnected || !evmWallet) {
      setDialectEvmWalletAdapter(null);
    } else {
      setDialectEvmWalletAdapter({
        address: evmWallet,
        sign: async (msg: string | Uint8Array) => {
          const res = await signMessage({ message: msg });
          return res as string;
        },
      });
    }
  }, [evmWallet, evmWalletConnected]);

  const dialectConfig = useMemo(
    (): ConfigProps => ({
      environment: 'local-development',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
    }),
    []
  );

  const evmConfig: EvmConfigProps = useMemo(
    () => ({
      wallet: dialectEvmWalletAdapter,
    }),
    [dialectEvmWalletAdapter]
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
    <DialectEvmSdk
      config={dialectConfig}
      evmConfig={evmConfig}
      gate={() =>
        new Promise((resolve) => setTimeout(() => resolve(true), 3000))
      }
    >
      <DialectThemeProvider theme={theme} variables={themeVariables}>
        <DialectUiManagementProvider>
          <AuthedHome />
        </DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectEvmSdk>
  );
}
