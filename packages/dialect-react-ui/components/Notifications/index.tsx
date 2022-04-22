import React, { useCallback, useMemo, useState } from 'react';
import clsx from 'clsx';
import { useDialect, useApi } from '@dialectlabs/react';
import type { MessageType } from '@dialectlabs/react';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import useMobile from '../../utils/useMobile';
import cs from '../../utils/classNames';
import { display } from '@dialectlabs/web3';
import { useTheme } from '../common/ThemeProvider';
import { A, P } from '../common/preflighted';
import type { Channel } from '../common/types';
import {
  Button,
  Centered,
  Divider,
  NetworkBadge,
  Section,
  ToggleSection,
  useBalance,
  ValueRow,
} from '../common';
import IconButton from '../IconButton';
import { Notification } from './Notification';
import { EmailForm } from './EmailForm';

export type NotificationType = {
  name: string;
  detail: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isSettingsOpen: boolean;
  onModalClose: () => void;
  toggleSettings: () => void;
}) {
  const { isDialectAvailable } = useDialect();
  const { colors, textStyles, header, icons } = useTheme();
  const isMobile = useMobile();

  if (!isDialectAvailable && !isMobile) return null;

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
      <Divider className="dt-mx-2" />
    </>
  );
}

function Wallet(props: { onThreadDelete?: () => void }) {
  const { wallet, network } = useApi();
  const {
    createDialect,
    isDialectCreating,
    isDialectAvailable,
    dialectAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
    creationError,
  } = useDialect();
  const {
    textStyles,
    xPaddedText,
    secondaryDangerButton,
    secondaryDangerButtonLoading,
  } = useTheme();
  const { balance } = useBalance();

  let content = (
    <div className="dt-h-full dt-m-auto dt-flex dt-flex-col">
      {wallet ? (
        <ValueRow
          label={
            <>
              Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}){' '}
              <NetworkBadge network={network} />
            </>
          }
          className="dt-mb-2"
        >
          <span className="dt-text-right">{balance || 0} SOL</span>
        </ValueRow>
      ) : null}
      <ValueRow
        label="Rent Deposit (recoverable)"
        className={cs('dt-w-full dt-mb-3')}
      >
        0.058 SOL
      </ValueRow>
      <Button
        className="dt-mb-2"
        onClick={() => createDialect().catch(noop)}
        loading={isDialectCreating}
      >
        {isDialectCreating
          ? 'Creating...'
          : 'Create on-chain notifications thread'}
      </Button>
      <P className={cs(textStyles.small, 'dt-p-1 dt-opacity-50 dt-text-left')}>
        To start this notifications thread, you&apos;ll need to deposit a small
        amount of rent, since messages are stored on-chain.
      </P>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {/* TODO: move red color to the theme */}
      {creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
        <P
          className={cs(
            textStyles.small,
            'dt-text-red-500 dt-text-left dt-mt-2'
          )}
        >
          {creationError.message}
        </P>
      )}
    </div>
  );

  if (isDialectAvailable) {
    content = (
      <div>
        {isDialectAvailable && dialectAddress ? (
          <ValueRow
            label={
              <>
                <P className={cs(textStyles.small, 'dt-opacity-60')}>
                  Notifications account address
                </P>
                <P>
                  <A
                    target="_blank"
                    href={getExplorerAddress(dialectAddress, network)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
                  </A>
                </P>
              </>
            }
            className="dt-mt-1 dt-mb-2"
          >
            <span className="dt-text-right">
              <P className={cs(textStyles.small, 'dt-opacity-60')}>
                Deposited Rent
              </P>
              <P>0.058 SOL</P>
            </span>
          </ValueRow>
        ) : null}
        {isDialectAvailable && dialectAddress ? (
          <>
            <Button
              className="dt-w-full"
              defaultStyle={secondaryDangerButton}
              loadingStyle={secondaryDangerButtonLoading}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props?.onThreadDelete?.();
              }}
              loading={isDialectDeleting}
            >
              Withdraw rent & delete history
            </Button>
            {deletionError &&
            deletionError.type !== 'DISCONNECTED_FROM_CHAIN' ? (
              <P
                className={cs(
                  textStyles.small,
                  xPaddedText,
                  'dt-text-red-500 dt-mt-2'
                )}
              >
                {deletionError.message}
              </P>
            ) : (
              <P
                className={cs(
                  textStyles.small,
                  xPaddedText,
                  'dt-opacity-50 dt-mt-2'
                )}
              >
                Notification history will be lost forever
              </P>
            )}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <ToggleSection
      className="dt-mb-6"
      title="💬  Web3 wallet notifications"
      enabled={isDialectAvailable}
    >
      {content}
    </ToggleSection>
  );
}

const baseChannelOptions: Record<Channel, boolean> = {
  web3: false,
  email: false,
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
  } else if (isSettingsOpen || !isDialectAvailable) {
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
