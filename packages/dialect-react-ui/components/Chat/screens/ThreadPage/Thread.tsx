import {
  Backend,
  DialectSdkError,
  ThreadId,
  useDialectSdk,
  useThread,
  useThreadMessages,
  useUnreadMessages,
} from '@dialectlabs/react-sdk';
import { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { FormEvent, KeyboardEvent, useEffect, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import MessageBubble from '../../MessageBubble';
import MessageInput from './MessageInput';

type ThreadProps = {
  threadId: ThreadId;
};

export default function Thread({ threadId }: ThreadProps) {
  const { thread, isWritable, isFetchingThread } = useThread({
    findParams: { id: threadId },
  });
  const { messages, send, cancel, setLastReadMessageTime } = useThreadMessages({
    id: threadId,
  });
  const { refresh } = useUnreadMessages();

  const {
    info: { wallet },
  } = useDialectSdk();
  const { scrollbar } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<DialectSdkError | null | undefined>();

  useEffect(() => {
    // After resetting the last read timestamp, we need to refetch the global unread message state
    setLastReadMessageTime(new Date()).then(refresh);
  }, [setLastReadMessageTime, refresh]);

  if (!thread) return null;

  const isOnChain = thread.backend === Backend.Solana;

  const cancelSendingMessage = (id: string) => {
    cancel({ id });
  };

  const handleError = (err: DialectSdkError) => {
    setError(err);
  };

  const handleSendMessage = async (
    messageText: string,
    id: string = messages.length.toString()
  ) => {
    if (!messageText) {
      return;
    }
    send({ text: messageText, id }).catch(handleError);
    setText('');
  };

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage(text);
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey == false) {
      e.preventDefault();
      handleSendMessage(text);
    }
  };

  const disableSendButton =
    text.length <= 0 || text.length > 280 || isFetchingThread;

  const inputDisabled = !thread;

  return (
    <div className="dt-flex dt-flex-col dt-h-full dt-justify-between">
      {/* TODO: fix messages which stretch the entire messaging col */}
      <div
        className={clsx(
          'dt-flex dt-flex-auto dt-flex-col-reverse dt-overflow-y-auto dt-py-2 dt-space-y-2 dt-space-y-reverse',
          scrollbar
        )}
      >
        {/* Key added to prevent messages appearing animation while switching threads */}
        <TransitionGroup component={null} key={thread.id.toString()}>
          {messages.map((message, idx) => {
            const isYou = message.author.publicKey.equals(
              wallet?.publicKey || PublicKey.default
            );
            const isLast = idx === 0;

            // TODO: fix transition after message is sent (e.g. key/props shouldn't change)
            return (
              <CSSTransition
                key={message.id}
                timeout={{
                  enter: 400,
                  exit: 200,
                }}
                classNames={{
                  // TODO: move transition settings to theme
                  enter: 'dt-message-enter',
                  enterActive: 'dt-message-enter-active',
                  exit: 'dt-message-exit',
                  exitActive: 'dt-message-exit-active',
                }}
              >
                {/* additional div wrapper is needed to avoid paddings /margins interfere with animation */}
                <div data-key={`message-${message.id}`}>
                  <MessageBubble
                    {...message}
                    isOnChain={isOnChain}
                    isYou={isYou}
                    showStatus={isYou && isLast}
                    onSendMessage={handleSendMessage}
                    onCancelMessage={cancelSendingMessage}
                  />
                </div>
              </CSSTransition>
            );
          })}
        </TransitionGroup>
      </div>

      {isWritable && (
        <MessageInput
          text={text}
          setText={setText}
          onSubmit={onMessageSubmit}
          onEnterPress={onEnterPress}
          disableSendButton={disableSendButton}
          inputDisabled={inputDisabled}
          error={error}
          setError={setError}
        />
      )}
    </div>
  );
}
