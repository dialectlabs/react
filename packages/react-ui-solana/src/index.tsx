import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana';
import { Notifications } from '@dialectlabs/react-ui';
import React from 'react';

interface DialectSolanaNotificationsProps {
  dappAddress: string;
}

export const DialectSolanaNotifications: React.FC<
  DialectSolanaNotificationsProps
> = ({ dappAddress }) => {
  return (
    <DialectSolanaSdk dappAddress={dappAddress}>
      <Notifications />
    </DialectSolanaSdk>
  );
};
