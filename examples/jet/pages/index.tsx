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

const JET_PUBLIC_KEY = new anchor.web3.PublicKey(
  'HGuoH5EgezVA9M6kh5ie15xrLPuJBo9SDWfMjr778CHE'
);

export const themeVariables: IncomingThemeVariables = {
  light: {
    colors: {
      bg: 'dt-bg-[#E5EBF4]',
      errorBg: 'dt-bg-[#DC726D]',
      primary: 'dt-text-[#444444]',
      secondary: 'dt-text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'dt-text-[#5895B9]',
      brand: 'dt-text-[#E5EBF4]',
      highlight: 'bg-white/30',
    },
    textStyles: {
      h1: 'dt-font-poppins dt-text-xl dt-font-normal',
      body: 'dt-font-sans dt-text-sm dt-leading-snug ',
      small: 'dt-font-sans dt-text-[13px] dt-leading-snug',
      bigText: 'dt-text-base dt-font-medium dt-leading-snug',
      header: 'dt-font-poppins dt-text-lg',
      buttonText:
        'dt-text-xs dt-uppercase dt-tracking-[1.5px] dt-text-[#E6EBF3]',
      bigButtonText: 'dt-text-xs dt-uppercase dt-tracking-[1.5px]',
      bigButtonSubtle: 'dt-text-xs dt-uppercase dt-tracking-[1.5px]',
    },
    icons: {
      bell: BellIcon,
      back: BackIcon,
      settings: SettingsIcon,
    },
    bellButton: 'dt-w-10 dt-h-10 jet-shadow-light',
    header: 'dt-px-6 dt-py-4',
    modal: 'dt-rounded-3xl jet-shadow',
    button: 'bg-gradient dt-text-[#E6EBF3] hover:dt-opacity-60',
    buttonLoading: 'bg-gradient dt-min-h-[32px] dt-opacity-20',
    bigButton: 'dt-text-white hover:dt-opacity-60',
    bigButtonLoading: 'dt-text-white dt-min-h-[32px] dt-opacity-20',
    divider:
      'dt-h-[4px] dt-rounded-lg dt-bg-gradient-to-b dt-from-[#C3CADE] dt-to-[#F8F9FB]',
    highlighted: 'dt-px-2 dt-py-1 dt-rounded-lg',
  },
  dark: {
    colors: {
      bg: 'dt-bg-[#444444]',
      errorBg: 'dt-bg-[#DC726D]',
      primary: 'dt-text-white',
      secondary: 'dt-text-[#E6EBF3]',
      accent: 'text-gradient',
      accentSolid: 'dt-text-[#5895B9]',
      brand: 'dt-text-[#E5EBF4]',
      highlight: 'dt-bg-[#ABABAB]/10',
    },
    textStyles: {
      h1: 'dt-font-poppins dt-text-xl dt-font-normal',
      body: 'dt-font-sans dt-text-sm dt-leading-snug ',
      small: 'dt-font-sans dt-text-[13px] dt-leading-snug',
      bigText: 'dt-text-base dt-font-medium dt-leading-snug',
      header: 'dt-font-poppins dt-text-lg',
      buttonText: 'dt-text-xs dt-uppercase dt-tracking-[1.5px] dt-text-[#444]',
      bigButtonText: 'dt-text-xs dt-uppercase dt-tracking-[1.5px]',
      bigButtonSubtle: 'dt-text-xs dt-uppercase dt-tracking-[1.5px]',
    },
    icons: {
      bell: BellIcon,
      back: BackIcon,
      settings: SettingsIcon,
    },
    bellButton: 'dt-w-10 dt-h-10 jet-shadow-dark',
    header: 'dt-px-6 dt-py-4',
    modal: 'dt-rounded-3xl jet-shadow',
    button: 'bg-gradient dt-text-[#E6EBF3] hover:dt-opacity-60',
    buttonLoading: 'bg-gradient dt-min-h-[32px] dt-opacity-20',
    bigButton: 'dt-text-white hover:dt-opacity-60',
    bigButtonLoading: 'dt-text-white dt-min-h-[32px] dt-opacity-20',
    divider:
      'dt-h-[4px] dt-rounded-lg dt-bg-gradient-to-b dt-from-[#3C3C3C] dt-to-[#505050]',
    highlighted: 'dt-px-2 dt-py-1 dt-rounded-lg',
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
      <div className={`dt-flex dt-flex-col dt-h-screen bg-${theme}`}>
        <div className="dt-flex dt-flex-row dt-justify-end dt-p-2 dt-items-center dt-space-x-2">
          <NotificationsButton
            wallet={wallet}
            network={'localnet'}
            publicKey={JET_PUBLIC_KEY}
            theme={theme}
            variables={themeVariables}
            notifications={[
              { name: 'Liqudiations', detail: 'Event' },
              { name: 'Collateral health', detail: 'Below 130%' },
            ]}
          />
          <WalletButton />
        </div>
        <div className="dt-h-full dt-flex dt-flex-col dt-justify-center">
          <div className="dt-text-center dt-font-poppins">
            <h1 className="dt-text-4xl text-gradient">Jet Protocol</h1>
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
