import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import * as anchor from '@project-serum/anchor';
import { Bell } from '@dialectlabs/react-ui-jet';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletContext, Wallet as WalletButton } from '../components/Wallet';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'FkZPdBJMUFQusgsC3Ts1aHRbdJQrjY18MzE7Ft7J4cb4'
);

function AuthedHome() {
  const wallet = useWallet();
  const [theme, setTheme] = useState('light');

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme]);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className={`flex flex-col h-screen bg-${theme}`}>
        <div className="flex flex-row justify-end p-2 items-center space-x-2">
          <Bell
            wallet={wallet}
            network={'devnet'}
            publicKey={DIALECT_PUBLIC_KEY}
            theme={theme}
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
