'use client';

import '@dialectlabs/react-ui/index.css';

import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana';
import {
  Icons,
  NotificationTypeStyles,
  NotificationsButton,
} from '@dialectlabs/react-ui';

const DAPP_ADDRESS = 'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h';

NotificationTypeStyles.offer_outbid = {
  Icon: <Icons.Bell width={12} height={12} />,
  iconColor: '#FFFFFF',
  iconBackgroundColor: '#FF0000',
  iconBackgroundBackdropColor: '#FF00001A',
  linkColor: '#FF0000',
  actionGradientStartColor: '#FF00001A',
};

export const DialectSolanaNotificationsButton = () => {
  return (
    <div className="dialect">
      <DialectSolanaSdk dappAddress={DAPP_ADDRESS}>
        <NotificationsButton />
      </DialectSolanaSdk>
    </div>
  );
};
