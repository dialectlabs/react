import {
  WalletProvider,
  MartianWalletAdapter,
} from '@manahippo/aptos-wallet-adapter';
import React from 'react';

const wallets = [new MartianWalletAdapter()];

export const AptosWalletContext: React.FC<any> = (props) => {
  return (
    <WalletProvider
      wallets={wallets}
      onError={(error: Error) => {
        console.log('Handle Error Message', error);
      }}
    >
      {props.children}
    </WalletProvider>
  );
};
