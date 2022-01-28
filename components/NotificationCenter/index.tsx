import React, { useCallback, useState } from 'react';
import { useDialect, MessageType } from '../../api/DialectContext';
import { IconButton } from '../Button';
import { GearIcon, NoNotificationsIcon, NotConnectedIcon } from '../Icon';
import { Notification } from './Notification';
import cs from '../../utils/classNames';
import { Centered, Divider, Footer, TEXT_STYLES, ValueRow } from '../common';

function Header(props: { right: JSX.Element | null }) {
  return (
    <div className="px-4 py-3 flex flex-row justify-between">
      <span className={TEXT_STYLES.medium15}>Notifications</span>
      {props.right ? props.right : null}
    </div>
  );
}

function CreateThread() {
  const { createDialect, isDialectCreating } = useDialect();

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
        disabled={isDialectCreating}
      >
        {isDialectCreating ? 'Enabling...' : 'Enable notifications'}
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
    <div className="flex flex-col h-full shadow-md rounded-lg border">
      <Header
        right={
          isWalletConnected && isDialectAvailable ? (
            <IconButton icon={<GearIcon />} onClick={toggleSettings} />
          ) : null
        }
      />
      <Divider />
      <div className="h-full py-2 px-4 overflow-y-scroll">{content}</div>
      <Footer showBackground={messages.length > 4} />
    </div>
  );
}
