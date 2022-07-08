import { useMemo } from 'react';
import clsx from 'clsx';
import { A, P } from '../../../common/preflighted';
import type { Channel } from '../../../common/types';
import { Footer, Section, ValueRow } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import type { NotificationType } from '../..';
import { Web3 } from './Web3';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';
import { TelegramForm } from './TelegramForm';
import { useDialectSdk } from '@dialectlabs/react-sdk';

const baseChannelOptions: Record<Channel, boolean> = {
  web3: false,
  email: false,
  sms: false,
  telegram: false,
};

function Settings(props: {
  toggleSettings: () => void;
  notifications: NotificationType[];
  channels: Channel[];
}) {
  const { textStyles, xPaddedText } = useTheme();
  const {
    info: {
      config: { environment },
    },
  } = useDialectSdk();

  const channelsOptions = useMemo(
    () =>
      Object.fromEntries(
        // Since by default options everything is false, passed options are considered enabled
        props.channels.map((channel) => [channel, !baseChannelOptions[channel]])
      ) as Record<Channel, boolean>,
    [props.channels]
  );

  const botURL =
    environment === 'production'
      ? 'https://telegram.me/DialectLabsBot'
      : 'https://telegram.me/DialectLabsDevBot';

  return (
    <>
      <div className={clsx('dt-py-2', xPaddedText)}>
        {channelsOptions.web3 && (
          <div className="dt-mb-2">
            <Web3 onThreadDelete={props.toggleSettings} />
          </div>
        )}
        {channelsOptions.email && (
          <div className="dt-mb-2">
            <EmailForm />
          </div>
        )}
        {channelsOptions.sms && (
          <div className="dt-mb-2">
            <SmsForm />
          </div>
        )}
        {channelsOptions.telegram && (
          <div className="dt-mb-2">
            <TelegramForm botURL={botURL} />
          </div>
        )}
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
        {props.notifications
          ? props.notifications.map((type) => (
              <ValueRow
                key={type.name}
                label={type.name}
                className={clsx('dt-mb-1')}
              >
                {type.detail}
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
