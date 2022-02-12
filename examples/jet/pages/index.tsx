import React, { useCallback, useState } from 'react';
import Head from 'next/head';
import * as anchor from '@project-serum/anchor';
import {
  NotificationCenterButton,
  IncomingThemeVariables,
} from '@dialectlabs/react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';
import BellIcon from './icons/Bell';
import SettingsIcon from './icons/Gear';
import BackIcon from './icons/BackArrow';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'FkZPdBJMUFQusgsC3Ts1aHRbdJQrjY18MzE7Ft7J4cb4'
);

export const themeVariables: IncomingThemeVariables = {
  light: {
    colors: {
      bg: 'bg-[#E5EBF4]',
      errorBg: 'bg-[#DC726D]',
      primary: 'text-[#444444]',
      secondary: 'text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'text-[#5895B9]',
      brand: 'text-[#E5EBF4]',
    },
    textStyles: {
      h1: 'font-poppins text-xl font-normal',
      body: 'font-sans text-sm leading-snug ',
      small: 'font-sans text-[13px] leading-snug',
      bigText: 'text-base font-medium leading-snug',
      header: 'font-poppins text-lg',
      buttonText: 'text-xs uppercase tracking-[1.5px] text-[#E6EBF3]',
      bigButtonText: 'text-xs uppercase tracking-[1.5px]',
      bigButtonSubtle: 'text-xs uppercase tracking-[1.5px]',
    },
    icons: {
      bell: BellIcon,
      back: BackIcon,
      settings: SettingsIcon,
    },
    bellButton: 'w-10 h-10 jet-shadow-light',
    header: 'px-6 py-4',
    popup: 'rounded-3xl jet-shadow',
    button: 'bg-gradient text-[#E6EBF3] hover:opacity-60',
    buttonLoading: 'bg-gradient min-h-[32px] opacity-20',
    bigButton: 'text-white hover:opacity-60',
    bigButtonLoading: 'text-white min-h-[32px] opacity-20',
    divider: 'h-[4px] rounded-lg bg-gradient-to-b from-[#C3CADE] to-[#F8F9FB]',
    highlighted: 'px-2 py-1 rounded-lg bg-white/30',
  },
  dark: {
    colors: {
      bg: 'bg-[#444444]',
      errorBg: 'bg-[#DC726D]',
      primary: 'text-white',
      secondary: 'text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'text-[#5895B9]',
      brand: 'text-[#E5EBF4]',
    },
    textStyles: {
      h1: 'font-poppins text-xl font-normal',
      body: 'font-sans text-sm leading-snug ',
      small: 'font-sans text-[13px] leading-snug',
      bigText: 'text-base font-medium leading-snug',
      header: 'font-poppins text-lg',
      buttonText: 'text-xs uppercase tracking-[1.5px] text-[#444]',
      bigButtonText: 'text-xs uppercase tracking-[1.5px]',
      bigButtonSubtle: 'text-xs uppercase tracking-[1.5px]',
    },
    icons: {
      bell: BellIcon,
      back: BackIcon,
      settings: SettingsIcon,
    },
    bellButton: 'w-10 h-10 jet-shadow-dark',
    header: 'px-6 py-4',
    popup: 'rounded-3xl jet-shadow',
    button: 'bg-gradient text-[#E6EBF3] hover:opacity-60',
    buttonLoading: 'bg-gradient min-h-[32px] opacity-20',
    bigButton: 'text-white hover:opacity-60',
    bigButtonLoading: 'text-white min-h-[32px] opacity-20',
    divider: 'h-[4px] rounded-lg bg-gradient-to-b from-[#3C3C3C] to-[#505050]',
    highlighted: 'px-2 py-1 rounded-lg bg-[#ABABAB]/10',
  },
};

function AuthedHome() {
  const wallet = useWallet();
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

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
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={`flex flex-col h-screen bg-${theme}`}>
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <NotificationCenterButton
            wallet={wallet}
            network={'devnet'}
            publicKey={DIALECT_PUBLIC_KEY}
            theme={theme}
            variables={themeVariables}
          />
          <WalletButton />
        </div>
        <div className="h-full flex flex-col justify-center">
          <div className="text-center font-poppins">
            <h1 className="text-4xl text-gradient">Jet Protocol</h1>
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
