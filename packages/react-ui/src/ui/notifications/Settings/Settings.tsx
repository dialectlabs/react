import {
  useDialectContext,
  useNotificationChannelDappSubscription,
  useNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import { AddressType } from '@dialectlabs/sdk';
import clsx from 'clsx';
import { ClassTokens } from '../../theme';
import { useExternalProps } from '../internal/ExternalPropsProvider';
import { AppInfo } from './AppInfo';
import { Channels } from './Channels';
import { NotificationTypes } from './NotificationTypes';
import { SettingsLoading } from './SettingsLoading';
import { TosAndPrivacy } from './TosAndPrivacy';
import { TryDialectOperator } from './TryDialectOperator';

export const Settings = () => {
  const { dappAddress } = useDialectContext();

  const subscription = useNotificationChannelDappSubscription({
    addressType: AddressType.Wallet,
    dappAddress,
  });

  const { isFetching: isFetchingNotificationsSubscriptions } =
    useNotificationSubscriptions({ dappAddress });

  const isLoading =
    subscription.isFetchingSubscriptions ||
    isFetchingNotificationsSubscriptions;

  const { channels } = useExternalProps();

  return isLoading ? (
    <SettingsLoading />
  ) : (
    <div className="dt-flex dt-h-full dt-flex-col">
      <div className="dt-px-4 dt-py-3">
        <Channels channels={channels} />
      </div>
      <div className="dt-px-4">
        <NotificationTypes />
      </div>
      <div className="dt-flex-1" />
      <div className="dt-px-4 dt-py-4">
        <TryDialectOperator />
      </div>
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-gap-2 dt-border-t dt-px-4 dt-py-4',
          ClassTokens.Stroke.Primary,
        )}
      >
        <TosAndPrivacy />
        <AppInfo />
      </div>
    </div>
  );
};
