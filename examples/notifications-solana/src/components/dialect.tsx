'use client';
import { DialectSolanaNotifications } from '@dialectlabs/react-ui-solana';
import '@dialectlabs/react-ui/index.css';
import { PublicKey } from '@solana/web3.js';

export const Dialect = () => {
  return (
    <div className="dialect">
      <DialectSolanaNotifications dappAddress={PublicKey.default.toString()} />
    </div>
  );
};
