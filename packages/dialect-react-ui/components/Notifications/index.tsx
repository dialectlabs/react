import React, { useCallback, useMemo, useState } from 'react';
import { useDialect, MessageType, useApi } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import {
  Accordion,
  BigButton,
  Button,
  Centered,
  Divider,
  Footer,
  useBalance,
  ValueRow,
} from '../common';
import { useTheme } from '../common/ThemeProvider';
import cs from '../../utils/classNames';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import IconButton from '../IconButton';
import { Notification } from './Notification';
import { EmailForm } from './EmailForm';
import type { Channel } from '../common/types';

export type NotificationType = {
  name: string;
  detail: string;
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}) {
  const { isDialectAvailable } = useDialect();
  const { colors, textStyles, header, icons } = useTheme();

  if (!isDialectAvailable) return null;

  if (props.isSettingsOpen) {
    return (
      <>
        <div className={cs('flex flex-row items-center', header)}>
          <IconButton
            icon={<icons.back />}
            onClick={props.toggleSettings}
            className="mr-2"
          />
          <span className={cs(textStyles.header, colors.accent)}>Settings</span>
        </div>
        <Divider className="mx-2" />
      </>
    );
  }
  return (
    <>
      <div className={cs('flex flex-row items-center justify-between', header)}>
        <span className={cs(textStyles.header, colors.accent)}>
          Notifications
        </span>
        {props.isReady ? (
          <IconButton
            icon={<icons.settings />}
            onClick={props.toggleSettings}
          />
        ) : null}
      </div>
      <Divider className="mx-2" />
    </>
  );
}

function NetworkBadge({ network = 'devnet' }: { network?: string | null }) {
  const { textStyles, colors } = useTheme();
  let color = 'text-green-600';
  if (network === 'devnet') {
    color = 'text-yellow-600';
  }
  if (network === 'localnet') {
    color = 'text-red-600';
  }
  return (
    <span
      className={cs(
        'py-0.5 px-1 rounded-sm',
        textStyles.small,
        colors.highlight,
        color
      )}
    >
      {network}
    </span>
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
  const { colors, textStyles, icons, secondaryRemoveButton } = useTheme();
  const { balance } = useBalance();

  if (isDialectAvailable) {
    return (
      <div>
        {isDialectAvailable && dialectAddress ? (
          <ValueRow
            label={
              <>
                <p className={cs(textStyles.small, 'opacity-60')}>
                  Account address
                </p>
                <p>
                  <a
                    target="_blank"
                    href={getExplorerAddress(dialectAddress)}
                    rel="noreferrer"
                  >
                    {display(dialectAddress)}↗
                  </a>
                </p>
              </>
            }
            className="mt-1 mb-2"
          >
            <span className="text-right">
              <p className={cs(textStyles.small, 'opacity-60')}>
                Deposited Rent
              </p>
              <p>0.058 SOL</p>
            </span>
          </ValueRow>
        ) : null}
        {isDialectAvailable && dialectAddress ? (
          <>
            {/* // TODO fix styles as secondary with red */}
            <BigButton
              className={cs(colors.errorBg, secondaryRemoveButton)}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props?.onThreadDelete?.();
              }}
              heading="Withdraw rent & delete history"
              description="Notification history will be lost forever"
              icon={<icons.trash />}
              loading={isDialectDeleting}
            />
            {deletionError &&
              deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
                <p
                  className={cs(
                    textStyles.small,
                    'text-red-500 text-center mt-2'
                  )}
                >
                  {deletionError.message}
                </p>
              )}
          </>
        ) : null}
      </div>
    );
  }

  return (
    <div className="h-full m-auto flex flex-col">
      {wallet ? (
        <ValueRow
          label={
            <>
              Balance ({wallet?.publicKey ? display(wallet?.publicKey) : ''}){' '}
              <NetworkBadge network={network} />
            </>
          }
          className="mt-1 mb-1"
        >
          <span className="text-right">{balance || 0} SOL</span>
        </ValueRow>
      ) : null}
      <ValueRow
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-3')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.small, 'opacity-50 text-center mb-3')}>
        To start this notifications thread, you&apos;ll need to deposit a small
        amount of rent, since messages are stored on-chain.
      </p>
      <Button
        onClick={() => createDialect().catch(noop)}
        loading={isDialectCreating}
      >
        {isDialectCreating ? 'Enabling...' : 'Enable notifications'}
      </Button>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
        <p className={cs(textStyles.small, 'text-red-500 text-center mt-2')}>
          {creationError.message}
        </p>
      )}
    </div>
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
  const { textStyles } = useTheme();

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
      {channelsOptions.web3 && (
        <Accordion className="mb-8" defaultExpanded title="Web3 notifications">
          <p className={cs(textStyles.small, 'opacity-50 my-3')}>
            Receive notifications directly to your wallet
          </p>
          <Wallet onThreadDelete={props.toggleSettings} />
        </Accordion>
      )}
      {channelsOptions.email && (
        <Accordion className="mb-3" defaultExpanded title="Email notifications">
          <p className={cs(textStyles.small, 'opacity-50 my-3')}>
            Receive notifications to your email. Emails are stored securely
            off-chain.
          </p>
          <EmailForm />
        </Accordion>
      )}
      <Accordion className="mb-8" defaultExpanded title="Notification types">
        <p className={cs(textStyles.small, 'opacity-50 my-3')}>
          The following notification types are supported
        </p>
        {props.notifications
          ? props.notifications.map((type) => (
              <ValueRow
                key={type.name}
                label={type.name}
                className={cs('mb-1')}
              >
                {type.detail}
              </ValueRow>
            ))
          : 'No notification types supplied'}
      </Accordion>
      <p className={cs(textStyles.small, 'opacity-50 text-center mb-10')}>
        By enabling notifications you agree to our{' '}
        <a
          className="underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/tos"
        >
          Terms of Service
        </a>{' '}
        and{' '}
        <a
          className="underline"
          target="_blank"
          rel="noreferrer"
          href="https://www.dialect.to/privacy"
        >
          Privacy Policy
        </a>
      </p>
    </>
  );
}

export default function Notifications(props: {
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

  const { colors, modal, icons, notificationsDivider } = useTheme();

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Lost connection to Solana blockchain</span>
      </Centered>
    );
  } else if (cannotDecryptDialect) {
    content = (
      <Centered>
        <icons.offline className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Cannot decrypt messages</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <icons.notConnected className="mb-6 opacity-60" />
        <span className="opacity-60">Wallet not connected</span>
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
        <icons.noNotifications className="mb-6" />
        <span className="opacity-60">No notifications yet</span>
      </Centered>
    );
  } else {
    content = (
      <>
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
      </>
    );
  }

  return (
    <div className="dialect h-full">
      <div
        className={cs(
          'flex flex-col h-full shadow-md overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <Header
          isReady={isDialectAvailable}
          isSettingsOpen={isSettingsOpen}
          toggleSettings={toggleSettings}
        />
        <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
        <Footer />
      </div>
    </div>
  );
}
