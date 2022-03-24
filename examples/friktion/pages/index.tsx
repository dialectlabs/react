import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import * as anchor from '@project-serum/anchor';
import {
  NotificationsButton,
  IncomingThemeVariables,
} from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';
import BellIcon from './icons/Bell';
import SettingsIcon from './icons/Gear';
import BackIcon from './icons/BackArrow';

const FRIKTION_PUBLIC_KEY = new anchor.web3.PublicKey(
  'HGuoH5EgezVA9M6kh5ie15xrLPuJBo9SDWfMjr778CHE'
);

export const themeVariables: IncomingThemeVariables = {
  light: {
    bellButton: 'dt-w-[42px] dt-h-[42px] rounded focus:outline-none',
    popupWrapper: 'absolute z-50 top-12 dt-w-[29rem] dt-h-[37rem]',
    popup: 'rounded-lg',
    notificationBubble: '-mx-2 rounded-2xl py-3 px-3 mb-2',
    notificationTimestamp: 'text-right',
    notificationsDivider: 'hidden',
  },
  dark: {
    bellButton:
      'dt-w-[42px] dt-h-[42px] rounded focus:outline-none dt-bg-[#272A36]',
    popupWrapper: 'absolute z-50 top-12 dt-w-[29rem] dt-h-[37rem]',
    popup: 'rounded-lg',
    colors: {
      bg: 'dt-bg-[#08070E]',
    },
    notificationBubble: 'dt-bg-[#121219] -mx-2 rounded-2xl py-3 px-3 mb-2',
    notificationTimestamp: 'text-right',
    notificationsDivider: 'hidden',
  },
};

function AuthedHome() {
  const wallet = useWallet();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return (
    <>
      <Head>
        <title>Friktion Example</title>
      </Head>
      <div className={`flex flex-col h-screen bg-${theme}`}>
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <NotificationsButton
            wallet={wallet}
            network={'devnet'}
            publicKey={FRIKTION_PUBLIC_KEY}
            theme={theme}
            variables={themeVariables}
          />
          <WalletButton />
        </div>
        <div className="h-full flex flex-col justify-center">
          <div className="text-center font-sans font-bold">
            <h1 className="text-4xl">Friktion Example</h1>
            <div>
              <button onClick={toggleTheme}>
                Toggle theme (current: {theme})
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <AuthedHome />
    </WalletContext>
  );
}
