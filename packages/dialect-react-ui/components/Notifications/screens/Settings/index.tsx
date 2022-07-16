import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import type { Channel } from '../../../common/types';
import { Footer, Section, Toggle, ValueRow } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { Web3 } from './Web3';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';
import { TelegramForm } from './TelegramForm';
import { useNotificationsConfigs } from '@dialectlabs/react-sdk';

function Settings(props: { channels: Channel[] }) {
  const { textStyles, xPaddedText } = useTheme();
  const {
    notifications,
    // TODO: should we provide a fallback?
    toggle,
    isFetching: isFetchingNotifications,
  } = useNotificationsConfigs();

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
        <P
          className={clsx(
            textStyles.small,
            xPaddedText,
            'dt-opacity-50 dt-mb-3'
          )}
        >
          The following notification types are supported
        </P>
        {/* TODO: check for fetching */}
        {isFetchingNotifications ? 'Loading your notifications settings' : null}
        {notifications
          ? notifications.map((config) => (
              <ValueRow
                key={config.dappNotification.id}
                label={config.dappNotification.name}
                className={clsx('dt-mb-1')}
              >
                <span className="dt-flex dt-items-center">
                  <Toggle
                    checked={config.config.enabled}
                    onClick={() =>
                      toggle({
                        dappNotificationId: dappNotification.id,
                        enabled: !config.config.enabled,
                      })
                    }
                  />
                </span>
                {/* TODO: config.dappNotification.trigger */}
              </ValueRow>
            ))
          : 'No notification types supplied'}
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
