'use client';

import '@dialectlabs/react-ui/index.css';

import { DialectSolanaSdk } from '@dialectlabs/react-sdk-blockchain-solana';
import {
  Icons,
  NotificationTypeStyles,
  NotificationsButton,
  ThemeType,
} from '@dialectlabs/react-ui';

const DAPP_ADDRESS =
  process.env.NEXT_PUBLIC_DAPP_ADDRESS ??
  'D1ALECTfeCZt9bAbPWtJk7ntv24vDYGPmyS7swp7DY5h';

NotificationTypeStyles.offer_outbid = {
  Icon: <Icons.Bell width={12} height={12} />,
  iconColor: '#FFFFFF',
  iconBackgroundColor: '#FF0000',
  iconBackgroundBackdropColor: '#FF00001A',
  linkColor: '#FF0000',
  actionGradientStartColor: '#FF00001A',
};

export const DialectSolanaNotificationsButton = (props: {
  theme: ThemeType;
}) => {
  return (
    <DialectSolanaSdk
      dappAddress={DAPP_ADDRESS}
      config={{
        environment: process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'production',
      }}
    >
      <NotificationsButton theme={props.theme} />
    </DialectSolanaSdk>
  );
};
