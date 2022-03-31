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
        <span className="dt-opacity-60">No messages yet</span>
      </Centered>
    );
  }
  return (
    <div className="dt-flex dt-flex-1 dt-flex-col dt-space-y-2 dt-py-2 dt-pl-2 dt-overflow-y-auto">
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
