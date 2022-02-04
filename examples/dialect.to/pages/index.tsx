import React, { useEffect, useState } from 'react';
import * as anchor from '@project-serum/anchor';

import { Bell } from '@dialectlabs/react-ui';
import { WalletContext, Wallet } from '../components/Wallet';
import Button from '../components/Button';
import { useWallet } from '@solana/wallet-adapter-react';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'FkZPdBJMUFQusgsC3Ts1aHRbdJQrjY18MzE7Ft7J4cb4'
);

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
    <div
      className="flex bg-black justify-center bg-gradient-radial"
      style={{ backgroundImage: `url(${'/images/pttrn2x.png'})` }}
    >
      <div className="container flex-col h-screen">
        {/* navbar */}
        <div className="flex justify-between items-center my-6">
          <div className="text-3xl font-medium text-white tracking-wider">
            DIALECT
          </div>
          <div className="flex flex-row justify-end p-2 space-x-4 items-center space-x-2">
            <Bell
              wallet={wallet}
              network={'localnet'}
              publicKey={DIALECT_PUBLIC_KEY}
              theme={theme}
            />
            <Wallet />
          </div>
        </div>
        {/* body */}
        <div className="flex flex-col h-full mt-32">
          <div className="grid grid-cols-1 gap-48 lg:grid-cols-2 items-center">
            <div className="flex flex-col justify-center">
              <div className="text-white text-8xl">
                Notifications
                <br />
                Engine for Web3
              </div>
              <div className="mt-10 text-white text-2xl text-gray-300">
                {'Dialect is building '}
                <span className="text-white font-medium">
                  a web3-native messaging standard
                </span>
                , &amp; developer tooling to power a generation of new products
                &amp; infrastructure.
              </div>
              <div className="flex space-x-4 mt-8">
                <Button>connect wallet &amp; try</Button>
                <Button>integrate us</Button>
              </div>
            </div>

            <div className="flex justify-end text-white text-6xl">
              <img src={'/images/notifs.png'} />
            </div>
          </div>
        </div>
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
