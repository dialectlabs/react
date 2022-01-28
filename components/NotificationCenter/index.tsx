import React, { useCallback, useState } from 'react';
import { useDialect, MessageType } from '../../api/DialectContext';
import { IconButton } from '../Button';
import { DialectLogo, GearIcon, NotConnectedIcon } from '../Icon';
import { Notification } from './Notification';
import cs from '../../utils/classNames';

const TEXT_STYLES = {
  regular13: 'text-sm font-normal',
  medium13: 'text-sm font-medium',
  medium15: 'text-base font-medium',
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

export default function NotificationCenter(): JSX.Element {
  const {
    isWalletConnected,
    isDialectAvailable,
    isNoMessages,
    createDialect,
    isDialeactCreating,
    messages,
  } = useDialect();

  const [isSettingsOpen, setSettingsOpen] = useState(false);

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  let content: JSX.Element;

  if (!isWalletConnected) {
    content = (
      <div className="h-full flex flex-col items-center justify-center text-black">
        <NotConnectedIcon className="mb-6" />
        <span className="opacity-60">Wallet not connected</span>
      </div>
    );
  } else if (!isDialectAvailable) {
    content = (
      <div className="h-full flex items-center justify-center">
        <button
          className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-200 disabled:text-gray-400 px-4 py-2 rounded-full"
          onClick={createDialect}
          disabled={isDialeactCreating}
        >
          {isDialeactCreating ? 'Enabling...' : 'Enable notifications'}
        </button>
      </div>
    );
  } else if (isSettingsOpen) {
    content = <Settings />;
  } else if (isNoMessages) {
    content = <div>No notifications yet.</div>;
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
