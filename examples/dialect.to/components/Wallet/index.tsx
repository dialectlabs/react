import React from 'react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');
import { PhantomIcon } from '../Icon';

export const Wallet = () => {
  return (
    <>
      <WalletModalProvider>
        <WalletMultiButton
          className="flex items-center transition ease-in-out duration-300 uppercase text-white text-lg border border-white rounded-full py-2 px-6 font-semibold hover:text-black hover:bg-white bg-transparent"
          startIcon={<PhantomIcon />}
        />
      </WalletModalProvider>
    </>
  );
};
