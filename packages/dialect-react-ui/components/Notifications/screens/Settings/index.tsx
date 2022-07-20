import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import type { Channel } from '../../../common/types';
import { Footer, Section, ToggleSection, ValueRow } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import type { NotificationType } from '../..';
import { Web3 } from './Web3';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';
import { TelegramForm } from './TelegramForm';
import { useNotificationSubscriptions } from '@dialectlabs/react-sdk';

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
  const { textStyles, xPaddedText } = useTheme();
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
    <div className="dt-mb-2">
      <ToggleSection
        key={id || name}
        title={name}
        checked={type === 'local' || enabled}
        hideToggle={type === 'local'}
        onChange={onToggle}
        className={clsx('dt-mb-1')}
      >
        {detail && (
          <P className={clsx(textStyles.small, 'dt-mb-1')}>{detail}</P>
        )}
      </ToggleSection>
    </div>
  );

  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

  return (
    <>
      <div className={clsx('dt-py-2', xPaddedText)}>
        {channels.map((channelSlug) => {
          let form;
          if (channelSlug === 'web3') {
            form = <Web3 />;
          } else if (channelSlug === 'email') {
            form = <EmailForm />;
          } else if (channelSlug === 'sms') {
            form = <SmsForm />;
          } else if (channelSlug === 'telegram') {
            form = <TelegramForm />;
          }
          return (
            <div key={channelSlug} className="dt-mb-2">
              {form}
            </div>
          );
        })}
      </div>
      <Section className="dt-mb-" title="Notification types">
        {error && !notificationsTypes ? (
          <ValueRow
            label={<P className={clsx('dt-text-red-500')}>{error.message}</P>}
          >
            {''}
          </ValueRow>
        ) : null}
        {notificationSubscriptions.length || notificationsTypes?.length ? (
          <>
            <P
              className={clsx(
                textStyles.small,
                xPaddedText,
                'dt-opacity-50 dt-mb-3'
              )}
            >
              The following notification types are supported
            </P>
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
      </Section>
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
