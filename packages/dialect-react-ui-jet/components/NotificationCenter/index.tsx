import React, { useCallback, useState } from 'react';
import { useDialect, MessageType } from '@dialectlabs/react';
import { display } from '@dialectlabs/web3';
import {
  BG_COLOR_MAPPING,
  BigButton,
  Button,
  Centered,
  Divider,
  Footer,
  JET_BOX_SHADOW,
  TEXT_COLOR_MAPPING,
  TEXT_STYLES,
  ThemeType,
  ValueRow,
} from '../common';
import {
  BackArrow as BackArrowIcon,
  Gear as GearIcon,
  NoNotifications as NoNotificationsIcon,
  NotConnected as NotConnectedIcon,
  Offline as OfflineIcon,
  Trash as TrashIcon,
} from '../Icon';
import cs from '../../utils/classNames';
import { getExplorerAddress } from '../../utils/getExplorerAddress';
import IconButton from '../IconButton';
import { Notification } from './Notification';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

function Header(props: {
  isReady: boolean;
  isSettingsOpen: boolean;
  toggleSettings: () => void;
}) {
  if (props.isSettingsOpen) {
    return (
      <div className="px-4 py-3 flex flex-row items-center">
        <IconButton
          icon={<BackArrowIcon />}
          onClick={props.toggleSettings}
          className="mr-2"
        />
        <span className={TEXT_STYLES.medium15}>Settings</span>
      </div>
    );
  }
  return (
    <div className="px-4 py-3 flex flex-row justify-between items-center">
      <span className={cs(TEXT_STYLES.medium15, 'font-poppins')}>
        Notifications
      </span>
      {props.isReady ? (
        <IconButton icon={<GearIcon />} onClick={props.toggleSettings} />
      ) : null}
    </div>
  );
}

function CreateThread(props: { forTheme?: 'dark' | 'light' }) {
  const { createDialect, isDialectCreating, creationError } = useDialect();

  return (
    <div className="h-full max-w-sm m-auto flex flex-col items-center justify-center">
      <h1
        className={cs(TEXT_STYLES.regular24, 'mb-3 text-center text-gradient')}
      >
        Create notifications thread
      </h1>
      <ValueRow
        highlighted
        label="Rent Deposit (recoverable)"
        forTheme={props.forTheme}
        className={cs('w-full mb-3')}
      >
        0.0002 SOL
      </ValueRow>
      <p className={cs(TEXT_STYLES.regular13, 'text-center mb-3')}>
        To start this message thread, you&apos;ll need to deposit a small amount
        of rent, since messages are stored on-chain.
      </p>
      <Button
        forTheme={props.forTheme}
        onClick={() => createDialect().catch(noop)}
        loading={isDialectCreating}
      >
        {isDialectCreating ? 'Enabling...' : 'Enable notifications'}
      </Button>
      {/* Ignoring disconnected from chain error, since we show a separate screen in this case */}
      {creationError && creationError.type !== 'DISCONNECTED_FROM_CHAIN' && (
        <p
          className={cs(TEXT_STYLES.regular11, 'text-red-500 text-center mt-2')}
        >
          {creationError.message}
        </p>
      )}
    </div>
  );
}

function Settings(props: {
  forTheme?: 'dark' | 'light';
  toggleSettings: () => void;
}) {
  const {
    notificationsThreadAddress,
    deleteDialect,
    isDialectDeleting,
    deletionError,
  } = useDialect();

  return (
    <>
      <div className="mb-3">
        <p className={cs(TEXT_STYLES.regular13, 'mb-1')}>
          Included event types
        </p>
        <ul className={cs(TEXT_STYLES.medium15, 'list-disc pl-6')}>
          <li>Deposit Confirmations</li>
          <li>Liquidation Alerts</li>
          <li>Top Up Requests</li>
          <li>Cross-App Notifications</li>
          <li>Price Alerts</li>
          <li>New markets</li>
          <li>Custom announcements</li>
        </ul>
      </div>
      <div>
        <ValueRow label="Deposited Rent" className={cs('mb-1')}>
          0.001 SOL
        </ValueRow>
        <Divider />
        {notificationsThreadAddress ? (
          <>
            <ValueRow
              label="Notifications thread account"
              className="mt-1 mb-4"
            >
              <a
                target="_blank"
                href={getExplorerAddress(notificationsThreadAddress)}
              >
                {display(notificationsThreadAddress)}↗
              </a>
            </ValueRow>
            <BigButton
              onClick={async () => {
                await deleteDialect().catch(noop);
                // TODO: properly wait for the deletion
                props.toggleSettings();
              }}
              heading="Withdraw rent & delete history"
              description="Events history will be lost forever"
              icon={<TrashIcon />}
              loading={isDialectDeleting}
            />
            {deletionError &&
              deletionError.type !== 'DISCONNECTED_FROM_CHAIN' && (
                <p
                  className={cs(
                    TEXT_STYLES.regular11,
                    'text-red-500 text-center mt-2'
                  )}
                >
                  {deletionError.message}
                </p>
              )}
          </>
        ) : null}
      </div>
    </>
  );
}

export default function NotificationCenter(
  props: {
    theme?: ThemeType;
  } = { theme: 'dark' }
): JSX.Element {
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

  const bgColor = props.theme && BG_COLOR_MAPPING[props.theme];
  const textColor = props.theme && TEXT_COLOR_MAPPING[props.theme];

  let content: JSX.Element;

  if (disconnectedFromChain) {
    content = (
      <Centered>
        <OfflineIcon className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Lost connection to Solana blockchain</span>
      </Centered>
    );
  } else if (cannotDecryptDialect) {
    content = (
      <Centered>
        <OfflineIcon className="w-10 mb-6 opacity-60" />
        <span className="opacity-60">Cannot decrypt messages</span>
      </Centered>
    );
  } else if (!isWalletConnected) {
    content = (
      <Centered>
        <NotConnectedIcon className="mb-6 opacity-60" />
        <span className="opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (!isDialectAvailable) {
    content = <CreateThread forTheme={props.theme as any} />;
  } else if (isSettingsOpen) {
    content = (
      <Settings toggleSettings={toggleSettings} forTheme={props.theme as any} />
    );
  } else if (isNoMessages) {
    content = (
      <Centered>
        <NoNotificationsIcon className="mb-6" />
        <span className="opacity-60">No notifications yet</span>
      </Centered>
    );
  } else {
    content = (
      <>
        {messages.map((message: MessageType) => (
          <Notification
            key={message.timestamp}
            message={message.text}
            timestamp={message.timestamp}
          />
        ))}
      </>
    );
  }

  return (
    <div
      className={cs(
        'flex flex-col h-full shadow-md rounded-3xl overflow-hidden border',
        textColor,
        bgColor
      )}
      style={{
        boxShadow: JET_BOX_SHADOW,
      }}
    >
      <Header
        isReady={isWalletConnected && isDialectAvailable}
        isSettingsOpen={isSettingsOpen}
        toggleSettings={toggleSettings}
      />
      <Divider />
      <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
      <Footer showBackground={messages.length > 4} />
    </div>
  );
}
