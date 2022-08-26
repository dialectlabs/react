import {
  SDK_VERSION,
  Thread,
  ThreadId,
  useDialectSdk,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { Centered } from '../../../../common';
import { useTheme } from '../../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../../common/providers/Router';
import MessagePreview from './MessagePreview';
import { UI_VERSION } from '../../../../../version';
import { useChatInternal } from '../../../provider';

interface ThreadsListProps {
  onThreadClick?: (dialectAccount: Thread) => void;
}

const ThreadsList = ({ onThreadClick }: ThreadsListProps) => {
  const {
    params: { threadId },
  } = useRoute<{ threadId?: ThreadId }>();
  const { pollingInterval } = useChatInternal();
  const { threads } = useThreads({ refreshInterval: pollingInterval });
  const {
    info: { apiAvailability },
  } = useDialectSdk();
  const hasEncryptedMessages = useMemo(
    () => threads.some((thread) => thread.encryptionEnabled),
    [threads]
  );

  const { colors, highlighted, textStyles, scrollbar } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex-1 dt-overflow-y-auto',
        scrollbar,
        // min-height doesn't play nicely with flex containers, so adding them only for the Centered component to work
        !threads.length && 'dt-flex dt-flex-col'
      )}
    >
      <div className="dt-min-h-full">
        {!apiAvailability.canEncrypt && hasEncryptedMessages && (
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
              key={thread.id.toString()}
              timeout={400}
              classNames="dt-thread"
            >
              <div className="dt-overflow-hidden dt-shrink-0">
                <MessagePreview
                  threadId={thread.id}
                  disabled={
                    !apiAvailability.canEncrypt && thread.encryptionEnabled
                  }
                  onClick={() => {
                    // Do not trigger open if this thread already opened
                    if (threadId?.equals(thread.id)) return;
                    onThreadClick?.(thread);
                  }}
                  selected={threadId?.equals(thread.id)}
                />
              </div>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
      <div className="dt-px-4 dt-py-2 dt-flex dt-items-center dt-justify-center">
        <span className={clsx('dt-opacity-40', textStyles.small)}>
          {UI_VERSION} / {SDK_VERSION}
        </span>
      </div>
    </div>
  );
};

export default ThreadsList;
