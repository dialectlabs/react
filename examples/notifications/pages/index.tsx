import {
  Backend,
  Config,
  defaultVariables,
  DialectContextProvider,
  DialectThemeProvider,
  DialectUiManagementProvider,
  DialectWalletAdapter,
  IncomingThemeVariables,
  NotificationsButton,
  NotificationsSingleFeed,
} from '@dialectlabs/react-ui';
import { DialectDappsIdentityResolver } from '@dialectlabs/identity-dialect-dapps';
import * as anchor from '@project-serum/anchor';
import {
  useConnection,
  useWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import Head from 'next/head';
import { useEffect, useMemo, useState } from 'react';
import { Wallet as WalletButton } from '../components/Wallet';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h'
);

export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'w-10 h-10 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700 bg-white text-black',
    modal: `${defaultVariables.dark.modal} sm:rounded-3xl sm:border border-[#383838]/40 bg-[#141414]`, // 0.4 opacity based on trial-and-error
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

// TODO: move this to react-sdk and export
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
        <NotificationsButton
          dialectId="dialect-singlefeed-notifications"
          pollingInterval={15000}
          Component={NotificationsSingleFeed}
        />
        <NotificationsButton
          dialectId="dialect-notifications"
          notifications={[
            {
              name: 'Example notification',
              detail:
                'This is an example notification that is never sent. More examples coming soon',
            },
          ]}
          pollingInterval={15000}
          channels={['web3', 'email', 'sms', 'telegram']}
        />
        <WalletButton />
      </div>
      <div className="h-full text-2xl flex flex-col justify-center">
        <code className="text-center text-neutral-400 dark:text-neutral-100">
          🌚 Dev Dapp
        </code>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  const { connection } = useConnection();
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
      environment: 'production',
      dialectCloud: {
        tokenStore: 'local-storage',
      },
      solana: {
        rpcUrl: connection.rpcEndpoint,
      },
      identity: {
        resolvers: [new DialectDappsIdentityResolver()],
      },
    }),
    [connection]
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
    <DialectContextProvider
      wallet={dialectWalletAdapter}
      config={dialectConfig}
      dapp={DIALECT_PUBLIC_KEY}
      gate={() =>
        new Promise((resolve) => setTimeout(() => resolve(true), 3000))
      }
    >
      <DialectThemeProvider theme={theme} variables={themeVariables}>
        <DialectUiManagementProvider>
          <AuthedHome />
        </DialectUiManagementProvider>
      </DialectThemeProvider>
    </DialectContextProvider>
  );
}
