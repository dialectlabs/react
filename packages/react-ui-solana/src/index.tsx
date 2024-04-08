'use client';

import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana';
import { NotificationsButton } from '@dialectlabs/react-ui';
import React from 'react';

interface DialectSolanaNotificationsProps {
  dappAddress: string;
}

export const DialectSolanaNotificationsButton: React.FC<
  DialectSolanaNotificationsProps
> = ({ dappAddress }) => {
  return (
    <div className="dialect">
      <DialectSolanaSdk dappAddress={dappAddress}>
        <NotificationsButton />
      </DialectSolanaSdk>
    </div>
  );
};
