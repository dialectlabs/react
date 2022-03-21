import React, { useCallback, useState } from 'react';
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

  if (props.isSettingsOpen) {
    return (
      <div className={cs('flex flex-row items-center', header)}>
        <IconButton
          icon={<icons.back />}
          onClick={props.toggleSettings}
          className="mr-2"
        />
        <span className={cs(textStyles.header, colors.accent)}>Settings</span>
      </div>
    );
  }
  return (
    <div className={cs('flex flex-row items-center justify-between', header)}>
      <span className={cs(textStyles.header, colors.accent)}>
        {isDialectAvailable ? 'Notifications' : 'Setup Notifications'}
      </span>
      {props.isReady ? (
        <IconButton icon={<icons.settings />} onClick={props.toggleSettings} />
      ) : null}
    </div>
  );
}

function NetworkBadge({ network }) {
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

function OnChain(props: { onThreadDelete?: () => void }) {
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
  const { colors, textStyles, icons } = useTheme();
  const { balance } = useBalance();

  if (isDialectAvailable) {
    return (
      <>
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
            className="mt-1 mb-4"
          >
            <div className="text-right">
              <p className={cs(textStyles.small, 'opacity-60')}>
                Deposited Rent
              </p>
              <p>0.058 SOL</p>
            </div>
          </ValueRow>
        ) : null}
        {isDialectAvailable && dialectAddress ? (
          <>
            <BigButton
              className={colors.errorBg}
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props?.onThreadDelete();
              }}
              heading="Withdraw rent & delete history"
              description="Events history will be lost forever"
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
      </>
    );
  }

  return (
    <div className="h-full pb-8 m-auto flex flex-col">
      {wallet ? (
        <ValueRow
          label={
            <>
              Balance ({display(wallet?.publicKey)}){' '}
              <NetworkBadge network={network} />
            </>
          }
          className="mt-1 mb-1"
        >
          {balance || 0} SOL
        </ValueRow>
      ) : null}
      <ValueRow
        label="Rent Deposit (recoverable)"
        className={cs('w-full mb-4')}
      >
        0.058 SOL
      </ValueRow>
      <p className={cs(textStyles.body, 'text-center mb-1')}>
        To start this message thread, you&apos;ll need to deposit a small amount
        of rent, since messages are stored on-chain.
      </p>
      <p className={cs(textStyles.small, 'opacity-50 text-center mb-3')}>
        By creating this thread you agree to our{' '}
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

function Settings(props: {
  toggleSettings: () => void;
  notifications: NotificationType[];
}) {
  return (
    <>
      <Accordion className="mb-3" defaultExpanded title="Event types">
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
      <Accordion className="mb-3" defaultExpanded title="Email Notifications">
        <EmailForm />
      </Accordion>
      <Accordion
        className="mb-3"
        defaultExpanded
        title="On-Chain Notifications"
      >
        <OnChain onThreadDelete={props.toggleSettings} />
      </Accordion>
    </>
  );
}

export default function Notifications(props: {
  notifications?: NotificationType[];
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
        notifications={props.notifications}
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
        <Divider className="mx-2" />
        <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
        <Footer />
      </div>
    </div>
  );
}
