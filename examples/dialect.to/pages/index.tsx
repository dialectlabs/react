import React from 'react';
import Image from 'next/image';
import { Bell } from '@dialectlabs/react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { WalletButton, WalletContext } from '../components/Wallet';
import Button from '../components/Button';

import Notifs from './assets/notifs.png';
import Pattern from './assets/pttrn@2x.png';

import { TwitterIcon } from '../components/Icon';
import Head from 'next/head';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'D2pyBevYb6dit1oCx6e8vCxFK9mBeYCRe8TTntk2Tm98'
);

function AuthedHome() {
  // const wallet = useAnchorWallet();
  const wallet = useWallet();

  return (
    <>
      <Head>
        <title>
          Dialect — a web3-native messaging standard & developer tooling
        </title>
      </Head>
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
              <WalletButton>Connect wallet</WalletButton>
              <Bell
                wallet={wallet}
                network={'devnet'}
                publicKey={DIALECT_PUBLIC_KEY}
                theme="dark"
                bellStyle={{
                  backgroundColor: 'white',
                  color: 'black',
                }}
              />
            </div>
          </div>
          {/* body */}
          <div className="flex flex-col h-full self-center mt-64">
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
                  , &amp; developer tooling to power a generation of new
                  products &amp; infrastructure.
                </div>
                <div className="flex space-x-4 mt-8">
                  <WalletButton>Connect wallet &amp; try</WalletButton>

                  <Button>
                    <TwitterIcon className="mr-2" />
                    integrate us
                  </Button>
                </div>
              </div>

              <div className="flex justify-end text-white text-6xl w-3/4">
                <Image
                  alt="Notifications"
                  src={Notifs}
                />
              </div>
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
