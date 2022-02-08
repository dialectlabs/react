import Link from 'next/link';
import React from 'react';
import Image from 'next/image';
import { Bell } from '@dialectlabs/react-ui';
import * as anchor from '@project-serum/anchor';
import { useWallet } from '@solana/wallet-adapter-react';

import { WalletButton } from '../Wallet';
import { BUTTON_STYLES } from '../Button';

import Notifs from '../../pages/assets/notifs.png';
import Pattern from '../../pages/assets/pttrn@2x.png';

import { TwitterIcon } from '../Icon';
import Head from 'next/head';

const DIALECT_PUBLIC_KEY = new anchor.web3.PublicKey(
  'D2pyBevYb6dit1oCx6e8vCxFK9mBeYCRe8TTntk2Tm98'
);

export default function Mainnet() {
  const wallet = useWallet();

  return (
    <>
      <Head>
        <title>Dialect — a web3-native messaging &amp; developer tooling</title>
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

                  <Link href="https://twitter.com/saydialect">
                    <a target="_blank" className={BUTTON_STYLES}>
                      <TwitterIcon className="mr-2" />
                      Integrate us
                    </a>
                  </Link>
                </div>
              </div>

              <div className="flex justify-end text-white text-6xl w-3/4">
                <Image alt="Notifications" src={Notifs} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
