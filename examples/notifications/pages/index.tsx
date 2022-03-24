import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';

import {
  NotificationsButton,
  IncomingThemeVariables,
} from '@dialectlabs/react-ui';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';
import { useWallet } from '@solana/wallet-adapter-react';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'D2pyBevYb6dit1oCx6e8vCxFK9mBeYCRe8TTntk2Tm98'
);

export const themeVariables: IncomingThemeVariables = {
  dark: {
    bellButton:
      'dt-w-10 dt-h-10 dt-shadow-xl dt-shadow-neutral-800 dt-border dt-border-neutral-600 hover:dt-shadow-neutral-700',
    modal:
      'dt-rounded-3xl dt-shadow-xl dt-shadow-neutral-900 dt-border dt-border-neutral-800',
  },
};

type ThemeType = 'light' | 'dark' | undefined;

function AuthedHome() {
  // const wallet = useAnchorWallet();
  const wallet = useWallet();
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

  return (
    <div className="dt-flex dt-flex-col dt-h-screen dt-bg-white dark:dt-bg-black">
      <div className="dt-flex dt-flex-row dt-justify-end dt-p-2 dt-items-center dt-space-x-2">
        <NotificationsButton
          wallet={wallet}
          network={'localnet'}
          publicKey={DIALECT_PUBLIC_KEY}
          theme={theme}
          variables={themeVariables}
          notifications={[
            { name: 'Welcome message on thread creation', detail: 'Event' },
            { name: 'Collateral health', detail: 'Below 130%' },
          ]}
        />
        <WalletButton />
      </div>
      <div className="dt-h-full dt-text-2xl dt-flex dt-flex-col dt-justify-center">
        <code className="dt-text-center dt-text-neutral-400 dark:text-neutral-600 dt-text-sm dt-mb-2">
          @dialectlabs/react
        </code>
        <code className="dt-text-center dt-text-neutral-400 dark:text-neutral-600">
          examples/
          <code className="dt-text-neutral-900 dark:text-neutral-100">
            basic
          </code>
        </code>
      </div>
    </div>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <AuthedHome />
    </WalletContext>
  );
}
