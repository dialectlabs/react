'use client';

import type { ConfigProps } from '@dialectlabs/react-sdk';
import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana';
import { NotificationsButton } from '@dialectlabs/react-ui';
import React from 'react';

interface DialectSolanaNotificationsProps {
  dappAddress: string;
  config?: ConfigProps;
}

export const DialectSolanaNotificationsButton: React.FC<
  DialectSolanaNotificationsProps
> = ({ dappAddress, config }) => {
  return (
    <div className="dialect">
      <DialectSolanaSdk dappAddress={dappAddress} config={config}>
        <NotificationsButton />
      </DialectSolanaSdk>
    </div>
  );
};
