import {
  AccountAddress,
  Thread,
  useNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback } from 'react';
import type { NotificationType } from '../..';
import { Divider, Footer, Toggle, ValueRow } from '../../../common';
import { A, P } from '../../../common/preflighted';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import type { Channel } from '../../../common/types';
import { RouteName } from '../../constants';
import Email from '../NewSettings/Email';
import Sms from '../NewSettings/Sms';
import Telegram from '../NewSettings/Telegram';
import Wallet from '../NewSettings/Wallet';

interface RenderNotificationTypeParams {
  name: string;
  detail?: string;
  id?: string;
  enabled?: boolean;
  type: 'local' | 'remote';
  onToggle?: (value: boolean) => void;
}

interface SettingsProps {
  dappAddress: AccountAddress;
  channels: Channel[];
  notifications?: NotificationType[];
}

export const NotificationToggle = ({
  id,
  name,
  detail,
  enabled = true,
  onToggle,
  type,
}: RenderNotificationTypeParams) => {
  const { highlighted, colors, textStyles } = useTheme();
  return (
    <div className={clsx(highlighted, 'dt-mb-2', colors.highlight)}>
      <div className="dt-flex dt-justify-between">
        <span className={clsx(textStyles.body)}>{name}</span>
        {type !== 'local' && (
          <Toggle
            key={id || name}
            checked={enabled}
            toggleSize="S"
            onChange={onToggle}
          />
        )}
      </div>

      {detail && (
        <P className={clsx(textStyles.small, 'dt-mb-1 dt-mt-1 dt-opacity-60')}>
          {detail}
        </P>
      )}
    </div>
  );
};

function Settings({
  dappAddress,
  channels,
  notifications: notificationsTypes,
}: SettingsProps) {
  const { textStyles, xPaddedText } = useTheme();
  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
    isUpdating,
    errorUpdating: errorUpdatingNotificationSubscription,
    errorFetching: errorFetchingNotificationsConfigs,
  } = useNotificationSubscriptions({ dappAddress });

  const { navigate } = useRoute();

  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

  const showThread = useCallback(
    (thread: Thread) => {
      navigate(RouteName.Thread, {
        params: {
          threadId: thread.id,
        },
      });
    },
    [navigate]
  );

  return (
    <>
      <div className={clsx('dt-pt-4 dt-pb-2')}>
        {channels.map((channelSlug) => {
          let form;
          if (channelSlug === 'web3') {
            form = (
              <Wallet dappAddress={dappAddress} onThreadCreated={showThread} />
            );
          } else if (channelSlug === 'email') {
            form = <Email dappAddress={dappAddress} />;
          } else if (channelSlug === 'sms') {
            form = <Sms dappAddress={dappAddress} />;
          } else if (channelSlug === 'telegram') {
            form = <Telegram dappAddress={dappAddress} />;
          }
          return (
            <div key={channelSlug} className="dt-mb-2">
              {form}
            </div>
          );
        })}
      </div>
      <div className="dt-mt-2 dt-mb-6">
        <Divider />
      </div>
      <div>
        {error && !notificationsTypes ? (
          <ValueRow
            label={<P className={clsx('dt-text-red-500')}>{error.message}</P>}
          >
            {''}
          </ValueRow>
        ) : null}
        {notificationSubscriptions.length || notificationsTypes?.length ? (
          <>
            {notificationSubscriptions.map(
              ({ notificationType, subscription }) => (
                <NotificationToggle
                  key={notificationType.id}
                  id={notificationType.id}
                  name={notificationType.name}
                  enabled={subscription.config.enabled}
                  type="remote"
                  detail={notificationType.trigger}
                  onToggle={(value) => {
                    if (isUpdating) return;
                    updateNotificationSubscription({
                      notificationTypeId: notificationType.id,
                      config: {
                        ...subscription.config,
                        enabled: value,
                      },
                    });
                  }}
                />
              )
            )}
            {/* Render manually passed types in case api doesn't return anything */}
            {!notificationSubscriptions.length &&
              notificationsTypes?.map((notificationType, idx) => (
                <NotificationToggle
                  key={idx}
                  {...notificationType}
                  type="local"
                />
              ))}
          </>
        ) : null}
      </div>
      <P
        className={clsx(
          textStyles.xsmall,
          xPaddedText,
          'dt-opacity-50 dt-text-center'
        )}
      >
        By enabling notifications you agree to our{' '}
        <A
          className="dt-underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/tos"
        >
          Terms of Service
        </A>{' '}
        and{' '}
        <A
          className="dt-underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/privacy"
        >
          Privacy Policy
        </A>
      </P>
      <div>
        <Footer />
      </div>
    </>
  );
}

export default Settings;
