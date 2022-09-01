import { useEffect, useMemo, useState } from 'react';

// TODO: retire this example?

import { CardinalTwitterIdentityResolver } from '@dialectlabs/identity-cardinal';
import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import { SNSIdentityResolver } from '@dialectlabs/identity-sns';
import {
  Backend,
  ChatButton,
  Config,
  defaultVariables,
  DialectContextProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  IncomingThemeVariables,
} from '@dialectlabs/react-ui';
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import Head from 'next/head';
import { Wallet as WalletButton } from '../components/Wallet';

// TODO: Use useTheme instead of explicitly importing defaultVariables
export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-12 h-12 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700',
    modal:
      'sm:rounded-3xl shadow-xl shadow-neutral-900 sm:border border-neutral-800',
  },
  light: {
    bellButton:
      'w-12 h-12 shadow-md hover:shadow-lg shadow-neutral-300 hover:shadow-neutral-400 text-teal',
    modal:
      'sm:border border-border-ligh shadow-lg shadow-neutral-300 sm:rounded-xl',
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

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
  return (
    <>
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

      <div className="flex flex-col h-screen bg-white dark:bg-black">
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <ChatButton dialectId="dialect-chat" />
          <WalletButton />
        </div>
        <div className="h-full text-2xl flex flex-col justify-center items-center">
          <code className="text-center text-neutral-400 dark:text-neutral-600 text-sm mb-2">
            @dialectlabs/react
          </code>
          <div>
            <code className="shrink text-center text-transparent bg-clip-text bg-gradient-to-r from-[#B852DC] to-[#59C29D]">
              examples/chat
            </code>
          </div>
        </div>
      </div>
    </>
  );
}

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
  // @ts-ignore
  diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
    ? async (pubKey) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
      }
    : undefined,
});

export default function Home(): JSX.Element {
  const { connection } = useConnection();
  const wallet = useWallet();
  const [dialectWalletAdapter, setDialectWalletAdapter] =
    useState<DialectWalletAdapter>(() => walletToDialectWallet(wallet));

  useEffect(() => {
    setDialectWalletAdapter(walletToDialectWallet(wallet));
  }, [wallet]);

  const [theme, setTheme] = useState<ThemeType>('dark');

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
      config={dialectConfig}
      wallet={dialectWalletAdapter}
    >
      <DialectUiManagementProvider>
        <DialectThemeProvider theme={theme} variables={themeVariables}>
          <AuthedHome />
        </DialectThemeProvider>
      </DialectUiManagementProvider>
    </DialectContextProvider>
  );
}
