import React from 'react';
import useNotificationCenter from '../../api/useNotificationCenter';
import type { NotificationCenterPropTypes } from '../../api/useNotificationCenter';
import { Notification } from './Notification';

export default function NotificationCenter(
  props: NotificationCenterPropTypes
): JSX.Element {
  const {
    isWalletConnected,
    isDialectAvailable,
    isEmpty,
    createDialect,
    isDialeactCreating,
    messages,
  } = useNotificationCenter(props);

  let content: JSX.Element;

  if (!isWalletConnected) {
    content = (
      <div className="h-full flex items-center justify-center text-gray-400">
        <div>Connect your wallet to enable notifications</div>
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
  } else if (isEmpty) {
    content = <div>No notifications yet.</div>;
  } else {
    content = (
      <>
        {messages.map((message) => (
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
    <div className="flex flex-col overflow-y-scroll h-full shadow-md py-4 px-6 rounded-lg border bg-white">
      <div className="text-lg font-semibold text-center mb-2">
        Notifications
      </div>
      <div className="h-px bg-gray-200" />
      {content}
    </div>
  );
}
