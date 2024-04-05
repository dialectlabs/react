import { useDialectSdk } from '@dialectlabs/react-sdk';
import WalletStatesWrapper from '../core/wallet-state/WalletStatesWrapper';
import Header from './Header';
import { NotificationsFeed } from './NotificationsFeed';
import { Settings } from './Settings';

export const Notifications = () => {
  const sdk = useDialectSdk(true);
  console.log('sdk', sdk);
  console.log('notifications');
  return (
    <div className="dt-flex dt-w-[420px] dt-flex-col dt-overflow-hidden dt-rounded-xl dt-border dt-border-[--dt-stroke-primary]">
      <WalletStatesWrapper>
        <Header />
        <Settings />
        <NotificationsFeed />
      </WalletStatesWrapper>
    </div>
  );
};
