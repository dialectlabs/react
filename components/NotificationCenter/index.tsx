import React, { useCallback, useState } from 'react';
import { useDialect, MessageType } from '../../api/DialectContext';
import { IconButton } from '../Button';
import {
  DialectLogo,
  GearIcon,
  NoNotificationsIcon,
  NotConnectedIcon,
} from '../Icon';
import { Notification } from './Notification';
import cs from '../../utils/classNames';

const TEXT_STYLES = {
  regular13: 'text-sm font-normal',
  medium13: 'text-sm font-medium',
  medium15: 'text-base font-medium',
  bold30: 'text-3xl font-bold',
};

function Divider(): JSX.Element {
  return <div className="h-px bg-gray-200" />;
}

function ValueRow(props: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cs('flex flex-row justify-between', props.className)}>
      <span className={cs(TEXT_STYLES.regular13)}>{props.label}:</span>
      <span className={cs(TEXT_STYLES.medium13)}>{props.children}</span>
    </p>
  );
}

function Footer(): JSX.Element {
  return (
    <div
      className="w-40 inline-flex items-center justify-center absolute bottom-3 left-0 right-0 mx-auto uppercase"
      style={{ fontSize: '10px' }}
    >
      Powered by <DialectLogo className="ml-px" />
    </div>
  );
}

function Centered(props: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      {props.children}
    </div>
  );
}

function CreateThread() {
  const { createDialect, isDialeactCreating } = useDialect();

  return (
    <div className="h-full max-w-sm m-auto flex flex-col items-center justify-center">
      <h1 className={cs(TEXT_STYLES.bold30, 'mb-3')}>
        Create notifications thread
      </h1>
      <ValueRow
        label="Rent Deposit (recoverable)"
        className="w-full bg-black/5 px-4 py-3 rounded-lg mb-3"
      >
        0.0002 SOL
      </ValueRow>
      <p className={cs(TEXT_STYLES.regular13, 'text-center mb-3')}>
        To start this message thread, you'll need to deposit a small amount of
        rent, since messages are stored on-chain.
      </p>
      <button
        className="hover:bg-black hover:text-white px-4 py-2 rounded-lg border border-black"
        onClick={createDialect}
        disabled={isDialeactCreating}
      >
        {isDialeactCreating ? 'Enabling...' : 'Enable notifications'}
      </button>
    </div>
  );
}

function Settings() {
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
        <ValueRow label="Deposited Rent" className="mb-1">
          0.001 SOL
        </ValueRow>
        <Divider />
        <ValueRow label="Notifications thread account" className="mt-1">
          0x21...1dX9↗
        </ValueRow>
      </div>
    </>
  );
}

export default function NotificationCenter(): JSX.Element {
  const { isWalletConnected, isDialectAvailable, isNoMessages, messages } =
    useDialect();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  let content: JSX.Element;

  if (!isWalletConnected) {
    content = (
      <Centered>
        <NotConnectedIcon className="mb-6" />
        <span className="text-black opacity-60">Wallet not connected</span>
      </Centered>
    );
  } else if (!isDialectAvailable) {
    content = <CreateThread />;
  } else if (isSettingsOpen) {
    content = <Settings />;
  } else if (isNoMessages) {
    content = (
      <Centered>
        <NoNotificationsIcon className="mb-6" />
        <span className="text-black opacity-60">No notifications yet</span>
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
    <div className="flex flex-col overflow-y-scroll h-full shadow-md rounded-lg border bg-white">
      <div className="px-4 py-3 flex flex-row justify-between">
        <span className={TEXT_STYLES.medium15}>Notifications</span>
        {isWalletConnected && isDialectAvailable ? (
          <IconButton icon={<GearIcon />} onClick={toggleSettings} />
        ) : null}
      </div>
      <Divider />
      <div className="h-full py-2 px-4">{content}</div>
      <Footer />
    </div>
  );
}
