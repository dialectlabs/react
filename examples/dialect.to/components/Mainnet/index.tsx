import React from 'react';
import Link from 'next/link';
import Pattern from '../../pages/assets/pttrn@2x.png';
import { BUTTON_STYLES } from '../Button';

import { TwitterIcon } from '../Icon';
import Head from 'next/head';

export default function Devnet() {
  return (
    <>
      <Head>
        <title>Dialect — a web3-native messaging &amp; developer tooling</title>
      </Head>
      <div
        className="h-screen flex bg-black justify-center"
        style={{
          backgroundImage: `url(${Pattern.src})`,
          backgroundSize: '282px',
        }}
      >
        <div className="bg-gradient-radial absolute left-0 right-0 top-0 bottom-0 w-full h-full"></div>
        <div className="container flex flex-col relative z-10">
          {/* body */}
          <div className="flex flex-col h-full self-center justify-between items-center">
            <div className="flex flex-col items-center space-y-4 grow justify-center">
              <div className="text-6xl text-white tracking-widest uppercase font-semibold">
                Dialect
              </div>
              <div className="text-gray-50 opacity-40 uppercase">
                coming soon...
              </div>
            </div>
            <div className="mb-20 flex flex-col space-y-4 items-center">
              <div className="text-gray-50 opacity-40 uppercase">
                Working with select partners now
              </div>
              <Link href="https://twitter.com/saydialect">
                <a
                  target="_blank"
                  className={`${BUTTON_STYLES} normal-case opacity-80`}
                >
                  <TwitterIcon className="mr-2" />
                  Contact us
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
