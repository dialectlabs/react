import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';

import {
  NotificationCenterButton,
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
      'w-10 h-10 shadow-xl shadow-neutral-800 border border-neutral-600 hover:shadow-neutral-700',
    popup: 'rounded-3xl shadow-xl shadow-neutral-900 border border-neutral-800',
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
      setTheme('dark');
    }
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        setTheme(newColorScheme);
      });
  }, []);

  return (
    <div className="flex flex-col h-screen bg-black">
      <div className="flex flex-row justify-end p-2 items-center space-x-2">
        <NotificationCenterButton
          wallet={wallet}
          network={'localnet'}
          publicKey={DIALECT_PUBLIC_KEY}
          theme={theme}
          variables={themeVariables}
        />
        <WalletButton />
      </div>
      <div className="h-full text-2xl flex flex-col justify-center">
        <code className="text-center text-neutral-600">
          examples/<code className="text-neutral-100">basic</code>
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