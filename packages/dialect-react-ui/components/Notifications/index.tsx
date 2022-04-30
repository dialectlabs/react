import { useCallback, useMemo, useState } from 'react';
import { useDialect, useApi } from '@dialectlabs/react';
import type { MessageType } from '@dialectlabs/react';
import clsx from 'clsx';
import cs from '../../utils/classNames';
import { useTheme } from '../common/ThemeProvider';
import { A, P } from '../common/preflighted';
import type { Channel } from '../common/types';
import { Centered, Divider, Footer, Section, ValueRow } from '../common';
import IconButton from '../IconButton';
import { Notification } from './Notification';
import { Wallet } from './Wallet';
import { EmailForm } from './EmailForm';
import { SmsForm } from './SmsForm';

export type NotificationType = {
  name: string;
  detail: string;
};

function Header(props: {
  isReady: boolean;
  isSettingsOpen: boolean;
  onModalClose: () => void;
  toggleSettings: () => void;
}) {
  const { isDialectAvailable } = useDialect();
  const { colors, textStyles, header, icons } = useTheme();
  const {
    addresses: { wallet: walletObj },
  } = useApi();
  // Support for threads created before address registry launch
  const isWalletEnabled = walletObj ? walletObj?.enabled : isDialectAvailable;

  if (!isWalletEnabled) {
    return (
      <>
        <div
          className={cs(
            'dt-flex dt-flex-row dt-items-center dt-justify-between',
            header
          )}
        >
          <span className={cs(textStyles.header, colors.accent)}>
            Setup Notifications
          </span>
        </div>
        <Divider />
      </>
    );
  }

  return (
    <>
      <div
        className={cs(
          'dt-flex dt-flex-row dt-items-center dt-justify-between',
          header
        )}
      >
        {!props.isSettingsOpen ? (
          <span className={cs(textStyles.header, colors.accent)}>
            Notifications
          </span>
        ) : (
          <div className="dt-flex">
            <IconButton
              icon={<icons.back />}
              onClick={props.toggleSettings}
              className="dt-mr-2"
            />
            <span className={cs(textStyles.header, colors.accent)}>
              Settings
            </span>
          </div>
        )}
        <div className="dt-flex">
          {props.isReady && !props.isSettingsOpen ? (
            <IconButton
              icon={<icons.settings />}
              onClick={props.toggleSettings}
            />
          ) : null}
          <div className="sm:dt-hidden dt-ml-3">
            <IconButton icon={<icons.x />} onClick={props.onModalClose} />
          </div>
        </div>
      </div>
      <Divider />
    </>
  );
}

const baseChannelOptions: Record<Channel, boolean> = {
  web3: false,
  email: false,
  sms: false,
};

function Settings(props: {
  toggleSettings: () => void;
  notifications: NotificationType[];
  channels: Channel[];
}) {
  const { textStyles, xPaddedText } = useTheme();

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
      <div className={clsx('dt-py-2', xPaddedText)}>
        {channelsOptions.web3 && (
          <div className="dt-mb-2">
            <Wallet onThreadDelete={props.toggleSettings} />
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
      </div>

      <Section className="dt-mb-" title="Notification types">
        <P
          className={cs(textStyles.small, xPaddedText, 'dt-opacity-50 dt-mb-3')}
        >
          The following notification types are supported
        </P>
        {props.notifications
          ? props.notifications.map((type) => (
              <ValueRow
                key={type.name}
                label={type.name}
                className={cs('dt-mb-1')}
              >
                {type.detail}
              </ValueRow>
            ))
          : 'No notification types supplied'}
      </Section>
      <P
        className={cs(
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

export default function Notifications(props: {
  onModalClose: () => void;
  notifications?: NotificationType[];
  channels?: Channel[];
}): JSX.Element {
  const {
    isWalletConnected,
    isDialectAvailable,
    isNoMessages,
    messages,
    disconnectedFromChain,
    cannotDecryptDialect,
  } = useDialect();
  const {
    addresses: { wallet: walletObj },
  } = useApi();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  const { colors, modal, icons, notificationsDivider, scrollbar } = useTheme();

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
        <span className="dt-opacity-60">
          Lost connection to Solana blockchain
        </span>
      </Centered>
    );
  } else if (cannotDecryptDialect) {
    content = (
      <Centered>
        <icons.offline className="dt-w-10 dt-mb-6 dt-opacity-60" />
        <span className="dt-opacity-60">Cannot decrypt messages</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <icons.notConnected className="dt-mb-6 dt-opacity-60" />
        <span className="dt-opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (isSettingsOpen || !isDialectAvailable || !walletObj?.enabled) {
    content = (
      <Settings
        toggleSettings={toggleSettings}
        notifications={props.notifications || []}
        channels={props.channels || []}
      />
    );
  } else if (isNoMessages) {
    content = (
      <Centered>
        <icons.noNotifications className="dt-mb-6" />
        {/* TODO: use some textstyle */}
        <span className="dt-opacity-60">No notifications yet</span>
      </Centered>
    );
  } else {
    content = (
      <div className={'dt-px-4'}>
        {messages.map((message: MessageType) => (
          <>
            <Notification
              key={message.timestamp}
              message={message.text}
              timestamp={message.timestamp}
            />
            <Divider className={notificationsDivider} />
          </>
        ))}
      </div>
    );
  }

  return (
    <div className="dialect dt-h-full">
      <div
        className={cs(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <Header
          isReady={isDialectAvailable}
          isSettingsOpen={isSettingsOpen}
          onModalClose={props.onModalClose}
          toggleSettings={toggleSettings}
        />
        <div className={cs('dt-h-full dt-overflow-y-auto', scrollbar)}>
          {content}
        </div>
      </div>
    </div>
  );
}
