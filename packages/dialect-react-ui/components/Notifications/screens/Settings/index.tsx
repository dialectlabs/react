import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import type { Channel } from '../../../common/types';
import { Divider, Footer, Toggle, ValueRow } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import type { NotificationType } from '../..';
import { useNotificationSubscriptions } from '@dialectlabs/react-sdk';
import Email from '../NewSettings/Email';
import Sms from '../NewSettings/Sms';
import Wallet from '../NewSettings/Wallet';
import Telegram from '../NewSettings/Telegram';

interface RenderNotificationTypeParams {
  name: string;
  detail?: string;
  id?: string;
  enabled?: boolean;
  type: 'local' | 'remote';
  onToggle?: () => void;
}

interface SettingsProps {
  channels: Channel[];
  notifications?: NotificationType[];
}

function Settings({
  channels,
  notifications: notificationsTypes,
}: SettingsProps) {
  const { textStyles, xPaddedText, highlighted, colors } = useTheme();
  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
    errorUpdating: errorUpdatingNotificationSubscription,
    errorFetching: errorFetchingNotificationsConfigs,
  } = useNotificationSubscriptions();

  const renderNotificationType = ({
    id,
    name,
    detail,
    enabled = true,
    onToggle,
    type,
  }: RenderNotificationTypeParams) => (
    <div className={clsx(highlighted, 'dt-mb-2', colors.highlight)}>
      <div className="dt-flex dt-justify-between">
        <span className={clsx(textStyles.body)}>{name}</span>
        {type !== 'local' && (
          <Toggle
            key={id || name}
            checked={enabled}
            toggleSize="S"
            onClick={() => onToggle?.()}
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

  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

  return (
    <>
      <div className={clsx('dt-pt-4 dt-pb-2')}>
        {channels.map((channelSlug) => {
          let form;
          if (channelSlug === 'web3') {
            form = <Wallet />;
          } else if (channelSlug === 'email') {
            form = <Email />;
          } else if (channelSlug === 'sms') {
            form = <Sms />;
          } else if (channelSlug === 'telegram') {
            form = <Telegram />;
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
      <div className="dt-mb-">
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
              ({ notificationType, subscription }) =>
                renderNotificationType({
                  id: notificationType.id,
                  name: notificationType.name,
                  enabled: subscription.config.enabled,
                  type: 'remote',
                  detail: notificationType.trigger,
                  onToggle: () => {
                    updateNotificationSubscription({
                      notificationTypeId: notificationType.id,
                      config: {
                        ...subscription.config,
                        enabled: !subscription.config.enabled,
                      },
                    });
                  },
                })
            )}
            {/* Render manually passed types in case api doesn't return anything */}
            {!notificationSubscriptions.length &&
              notificationsTypes?.map((notificationType) =>
                renderNotificationType({
                  ...notificationType,
                  type: 'local',
                })
              )}
          </>
        ) : null}
      </div>
      <P
        className={clsx(
          textStyles.small,
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
