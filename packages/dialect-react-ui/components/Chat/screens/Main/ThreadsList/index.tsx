import { useMemo } from 'react';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { useThreads } from '@dialectlabs/react-sdk';
import type { Thread } from '@dialectlabs/sdk';
import MessagePreview from './MessagePreview';
import { Centered } from '../../../../common';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';

interface ThreadsListProps {
  onThreadClick?: (dialectAccount: Thread) => void;
}

const ThreadsList = ({ onThreadClick }: ThreadsListProps) => {
  const { threads } = useThreads();
  const { walletName } = useApi();
  const { dialectAddress } = useDialect();
  const isNotSollet = walletName !== 'Sollet';
  const hasEncryptedMessages = useMemo(
    () => threads.some((thread) => thread.encryptionEnabled),
    [threads]
  );

  const { colors, highlighted, textStyles, scrollbar } = useTheme();

  if (!threads.length) {
    return (
      <Centered>
        <span className="dt-opacity-60">No messages yet</span>
      </Centered>
    );
  }

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-1 dt-flex-col dt-overflow-y-auto',
        scrollbar
      )}
    >
      {isNotSollet && hasEncryptedMessages && (
        <div
          className={clsx(
            colors.highlight,
            highlighted,
            textStyles.small,
            'dt-px-4 dt-py-2 dt-mx-2 dt-mt-2'
          )}
        >
          ⚠ You have encrypted messages in your inbox. Connect the Sollet.io
          wallet to read them.
        </div>
      )}
      {threads.map((thread) => (
        <MessagePreview
          key={thread.address.toBase58()}
          dialectAddress={thread.address}
          disabled={isNotSollet && thread.encryptionEnabled}
          onClick={() => {
            // Do not trigger open if this thread already opened
            if (dialectAddress === thread.address.toBase58()) return;
            onThreadClick?.(thread);
          }}
          selected={dialectAddress === thread.address.toBase58()}
        />
      ))}
    </div>
  );
};

export default ThreadsList;
