import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import type { Channel } from '../../../common/types';
import { Footer, Loader, Section, Toggle, ValueRow } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Web3 } from './Web3';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';
import { TelegramForm } from './TelegramForm';
import { useNotificationSubscriptions } from '@dialectlabs/react-sdk';

function Settings(props: { channels: Channel[] }) {
  const { textStyles, xPaddedText } = useTheme();
  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
    isFetching: isFetchingNotifications,
    errorUpdating: errorUpdatingNotificationSubscription,
    errorFetching: errorFetchingNotificationsConfigs,
  } = useNotificationSubscriptions();

  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

  return (
    <>
      <div className={clsx('dt-py-2', xPaddedText)}>
        {props.channels.map((channelSlug) => {
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
        {isFetchingNotifications ? (
          <ValueRow
            label={
              <div className="dt-flex dt-items-center dt-space-x-1">
                <Loader /> <span>Loading your notifications settings</span>
              </div>
            }
          >
            {''}
          </ValueRow>
        ) : null}
        {error ? (
          <ValueRow
            label={<P className={clsx('dt-text-red-500')}>{error.message}</P>}
          >
            {''}
          </ValueRow>
        ) : null}
        {notificationSubscriptions.length ? (
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
              ({ notificationType, subscription }) => (
                <ValueRow
                  key={notificationType.id}
                  label={notificationType.name}
                  className={clsx('dt-mb-1')}
                >
                  <span className="dt-flex dt-items-center">
                    <Toggle
                      checked={subscription.config.enabled}
                      onClick={async () => {
                        updateNotificationSubscription({
                          notificationTypeId: notificationType.id,
                          config: {
                            ...subscription.config,
                            enabled: !subscription.config.enabled,
                          },
                        });
                      }}
                    />
                  </span>
                  {/* TODO: render config.dappNotification.trigger */}
                </ValueRow>
              )
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
