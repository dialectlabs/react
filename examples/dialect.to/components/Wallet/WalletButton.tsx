import React from 'react';
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
// Default styles that can be overridden by your app
import '@solana/wallet-adapter-react-ui/styles.css';
import { PhantomIcon } from '../Icon';
import { display } from '@dialectlabs/web3';

export const WalletButton = ({ children }: any) => {
  const wallet = useWallet();

  return (
    <>
      <WalletModalProvider>
        <WalletMultiButton
          className="dialect-wallet-button"
          startIcon={<PhantomIcon />}
        >
          {wallet && wallet.publicKey ? display(wallet.publicKey) : children}
        </WalletMultiButton>
      </WalletModalProvider>
    </>
  );
};
