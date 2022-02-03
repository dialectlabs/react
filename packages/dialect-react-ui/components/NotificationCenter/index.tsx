import React, { useCallback, useState } from 'react';
import { useDialect, MessageType } from '@dialectlabs/react';
import {
  BackArrowIcon,
  GearIcon,
  NoNotificationsIcon,
  NotConnectedIcon,
  TrashIcon,
} from '../Icon';
import { Notification } from './Notification';
import cs from '../../utils/classNames';
import {
  BigButton,
  Button,
  Centered,
  Divider,
  Footer,
  TEXT_STYLES,
  ValueRow,
} from '../common';
import IconButton from '../IconButton';
import { display } from '@dialectlabs/web3';

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
      <span className={TEXT_STYLES.medium15}>Notifications</span>
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
      <h1 className={cs(TEXT_STYLES.bold30, 'mb-3 text-center')}>
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
        onClick={createDialect}
        loading={isDialectCreating}
      >
        {isDialectCreating ? 'Enabling...' : 'Enable notifications'}
      </Button>
      {creationError && (
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
  const { notificationsThreadAddress, deleteDialect, isDialectDeleting } =
    useDialect();

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
              {display(notificationsThreadAddress)}↗
            </ValueRow>
            <BigButton
              onClick={async () => {
                await deleteDialect();
                // TODO: properly wait for the deletion
                props.toggleSettings();
              }}
              heading="Withdraw rent & delete history"
              description="Events history will be lost forever"
              icon={<TrashIcon />}
              loading={isDialectDeleting}
            />
          </>
        ) : null}
      </div>
    </>
  );
}

export default function NotificationCenter(
  props: {
    theme?: 'dark' | 'light';
  } = { theme: 'dark' }
): JSX.Element {
  const { isWalletConnected, isDialectAvailable, isNoMessages, messages } =
    useDialect();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  const bgColor = props.theme === 'dark' ? 'bg-night' : 'bg-white';
  const textColor = props.theme === 'dark' ? 'text-white' : 'text-black';

  let content: JSX.Element;

  if (!isWalletConnected) {
    content = (
      <Centered>
        <NotConnectedIcon className="mb-6" />
        <span className="opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (!isDialectAvailable) {
    content = <CreateThread forTheme={props.theme} />;
  } else if (isSettingsOpen) {
    content = (
      <Settings toggleSettings={toggleSettings} forTheme={props.theme} />
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
        'flex flex-col h-full shadow-md rounded-lg overflow-hidden border',
        textColor,
        bgColor
      )}
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
