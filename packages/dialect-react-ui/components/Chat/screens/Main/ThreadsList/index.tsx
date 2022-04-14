import { useMemo } from 'react';
import type { DialectAccount } from '@dialectlabs/react';
import { useApi, Wallets } from '@dialectlabs/react';
import MessagePreview from './MessagePreview';
import { Centered } from '../../../../common';
import { useTheme } from '../../../../common/ThemeProvider';
import clsx from 'clsx';

interface ThreadsListProps {
  chatThreads: DialectAccount[];
  onThreadClick?: (dialectAccount: DialectAccount) => void;
}

const ThreadsList = ({ chatThreads, onThreadClick }: ThreadsListProps) => {
  const { walletName } = useApi();
  const isNotSollet = walletName !== 'Sollet';
  const hasEncryptedMessages = useMemo(
    () => chatThreads.some((subscription) => subscription.dialect.encrypted),
    [chatThreads]
  );

  const { colors, highlighted, textStyles, scrollbar } = useTheme();

  if (!chatThreads.length) {
    return (
      <Centered>
        <span className="dt-opacity-60">No messages yet</span>
      </Centered>
    );
  }

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-1 dt-flex-col dt-space-y-2 dt-py-2 dt-overflow-y-auto',
        scrollbar
      )}
    >
      {isNotSollet && hasEncryptedMessages && (
        <div
          className={clsx(
            colors.highlight,
            highlighted,
            textStyles.small,
            'dt-px-4 dt-py-2 dt-mr-2'
          )}
        >
          ⚠ You have encrypted messages in your inbox. Connect the Sollet.io
          wallet to read them.
        </div>
      )}
      {chatThreads.map((subscription) => (
        <MessagePreview
          key={subscription.publicKey.toBase58()}
          dialect={subscription}
          disabled={isNotSollet && subscription.dialect.encrypted}
          onClick={() => {
            onThreadClick?.(subscription);
          }}
        />
      ))}
    </div>
  );
};

export default ThreadsList;
