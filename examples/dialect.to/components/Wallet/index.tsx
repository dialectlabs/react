import React from 'react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomIcon } from '../Icon';

export const Wallet = () => {
  return (
    <>
      <WalletModalProvider>
        <WalletMultiButton
          className="dialect-wallet-button"
          startIcon={<PhantomIcon />}
        />
      </WalletModalProvider>
    </>
  );
};
