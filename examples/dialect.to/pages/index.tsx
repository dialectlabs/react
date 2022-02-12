import React from 'react';

import { WalletContext } from '../components/Wallet';
import Mainnet from '../components/Mainnet';
import Devnet from '../components/Devnet';

export default function Home(): JSX.Element {
  return (
    <WalletContext>
      <Devnet />
    </WalletContext>
  );
}
