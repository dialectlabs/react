import React from 'react';
import type { DialectAccount } from '@dialectlabs/react';
import MessagePreview from './MessagePreview';
import { Centered } from '../../../../common';

interface ThreadsListProps {
  chatThreads: DialectAccount[];
  onThreadClick?: (key: string) => void;
}

const ThreadsList = ({ chatThreads, onThreadClick }: ThreadsListProps) => {
  if (!chatThreads.length) {
    return (
      <Centered>
        <span className="opacity-60">No messages yet</span>
      </Centered>
    );
  }
  return (
    <div className="flex flex-1 flex-col space-y-2">
      {chatThreads.map((subscription) => (
        <MessagePreview
          key={subscription.publicKey.toBase58()}
          dialect={subscription}
          onClick={() => {
            onThreadClick?.(subscription.publicKey.toBase58());
          }}
        />
      ))}
    </div>
  );
};

export default ThreadsList;
