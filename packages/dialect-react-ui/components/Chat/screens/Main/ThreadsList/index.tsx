import { useEffect, useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useApi } from '@dialectlabs/react';
import { useThreads } from '@dialectlabs/react-sdk';
import type { Thread } from '@dialectlabs/sdk';
import MessagePreview from './MessagePreview';
import { Centered } from '../../../../common';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import clsx from 'clsx';
import { useRoute } from '../../../../common/providers/Router';

interface ThreadsListProps {
  onThreadClick?: (dialectAccount: Thread) => void;
}

const ThreadsList = ({ onThreadClick }: ThreadsListProps) => {
  const {
    params: { threadId },
  } = useRoute<{ threadId?: string }>();
  const { threads } = useThreads();
  const { walletName } = useApi();
  const isNotSollet = walletName !== 'Sollet';
  const hasEncryptedMessages = useMemo(
    () => threads.some((thread) => thread.encryptionEnabled),
    [threads]
  );

  const { colors, highlighted, textStyles, scrollbar } = useTheme();

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
            'dt-px-4 dt-py-2 dt-mx-2 dt-my-2'
          )}
        >
          ⚠ You have encrypted messages in your inbox. Connect the Sollet.io
          wallet to read them.
        </div>
      )}
      {!threads.length ? (
        <Centered>
          <span className="dt-opacity-60">No messages yet</span>
        </Centered>
      ) : null}
      <TransitionGroup component={null}>
        {/* FIXME: enter animation isn't working */}
        {threads.map((thread) => (
          <CSSTransition
            key={thread.address.toBase58()}
            timeout={400}
            classNames="dt-thread"
          >
            <div className="dt-overflow-hidden">
              <MessagePreview
                dialectAddress={thread.address}
                disabled={isNotSollet && thread.encryptionEnabled}
                onClick={() => {
                  // Do not trigger open if this thread already opened
                  if (threadId === thread.address.toBase58()) return;
                  onThreadClick?.(thread);
                }}
                selected={threadId === thread.address.toBase58()}
              />
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </div>
  );
};

export default ThreadsList;
