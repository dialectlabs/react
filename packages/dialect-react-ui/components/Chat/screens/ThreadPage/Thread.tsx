import type { ParsedErrorData } from '@dialectlabs/react';
import {
  useDialectSdk,
  useThread,
  useThreadMessages,
} from '@dialectlabs/react-sdk';
import { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import { FormEvent, KeyboardEvent, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import MessageBubble from '../../MessageBubble';
import MessageInput from './MessageInput';

type ThreadProps = {
  threadId: string;
};

export default function Thread({ threadId }: ThreadProps) {
  const { thread, isWritable, isFetchingThread } = useThread({
    findParams: { address: threadId },
  });
  const { messages, send, cancel } = useThreadMessages({
    address: threadId,
  });

  const {
    info: { wallet },
  } = useDialectSdk();
  const { scrollbar } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<ParsedErrorData | null | undefined>();

  if (!thread) return null;

  // TODO: replace with optimistic UI data from react-sdk
  const isMessagesReady = true;
  const cancelSendingMessage = (id: string) => {
    cancel({ id });
  };

  const handleError = (err: ParsedErrorData) => {
    setError(err);
  };

  const handleSendMessage = async (
    messageText: string,
    id: string = messages.length.toString()
  ) => {
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
        {isMessagesReady ? (
          <TransitionGroup component={null}>
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
        ) : null}
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
