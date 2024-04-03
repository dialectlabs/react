'use client';
import { DialectProvider, Notifications } from '@dialectlabs/react-ui';
import '@dialectlabs/react-ui/index.css';
import { PublicKey } from '@solana/web3.js';

export const Dialect = () => {
  return (
    <div className="dialect">
      <DialectProvider dappAddress={PublicKey.default}>
        <Notifications />
      </DialectProvider>
    </div>
  );
};
