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
import { Header } from '../../../Header';
import { useRoute } from '../../../common/providers/Router';
import { RouteName } from '../../constants';
import { useDialectDapp, useThread } from '@dialectlabs/react-sdk';

const baseChannelOptions: Record<Channel, boolean> = {
  web3: false,
  email: false,
  sms: false,
  telegram: false,
};

function Settings(props: {
  notifications: NotificationType[];
  channels: Channel[];
  setup?: boolean;
}) {
  const { navigate } = useRoute();
  const { textStyles, xPaddedText, icons } = useTheme();
  const { dappAddress } = useDialectDapp();
  const { thread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const channelsOptions = useMemo(
    () =>
      Object.fromEntries(
        // Since by default options everything is false, passed options are considered enabled
        props.channels.map((channel) => [channel, !baseChannelOptions[channel]])
      ) as Record<Channel, boolean>,
    [props.channels]
  );

  return (
    <>
      <Header>
        <Header.Icons containerOnly position="left">
          {!props.setup ? (
            <Header.Icon
              icon={<icons.back />}
              onClick={() =>
                navigate(RouteName.Thread, {
                  params: {
                    threadId: thread?.id,
                  },
                })
              }
            />
          ) : null}
        </Header.Icons>
        <Header.Title>
          {props.setup ? 'Setup notifications' : 'Settings'}
        </Header.Title>
        <Header.Icons />
      </Header>
      <div className={clsx('dt-py-2', xPaddedText)}>
        {channelsOptions.web3 && (
          <div className="dt-mb-2">
            <Web3 />
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
            <TelegramForm botURL="https://telegram.me/DialectLabsBot" />
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
