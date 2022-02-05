import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Bell } from '@dialectlabs/react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { Wallet } from '../components/Wallet';
import { WalletContext } from '../components/Wallet/WalletContext';
import Button from '../components/Button';

import Notifs from './assets/notifs.png';
import Pattern from './assets/pttrn@2x.png';

import { PhantomIcon, TwitterIcon } from '../components/Icon';

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
      className="h-screen min-h-[796px] flex bg-black justify-center"
      style={{
        backgroundImage: `url(${Pattern.src})`,
        backgroundSize: '282px',
      }}
    >
      <div className="bg-gradient-radial absolute left-0 right-0 top-0 bottom-0 w-full h-full"></div>
      <div className="container flex flex-col relative z-10">
        {/* navbar */}
        <div className="flex justify-between items-center my-6">
          <div className="text-3xl font-medium text-white tracking-wider uppercase">
            Dialect
          </div>
          <div className="flex flex-row justify-end p-2 space-x-4 items-center space-x-2">
            <Wallet />
            <Bell
              wallet={wallet}
              network={'localnet'}
              publicKey={DIALECT_PUBLIC_KEY}
              theme={theme}
            />
          </div>
        </div>
        {/* body */}
        <div className="flex flex-col h-full self-center mt-16">
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
                <Button>
                  <PhantomIcon className="mr-2" />
                  connect wallet &amp; try
                </Button>
                <Button>
                  <TwitterIcon className="mr-2" />
                  integrate us
                </Button>
              </div>
            </div>

            <div className="flex justify-end text-white text-6xl">
              <Image
                alt="Notification centers in different dapps"
                src={Notifs}
              />
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
