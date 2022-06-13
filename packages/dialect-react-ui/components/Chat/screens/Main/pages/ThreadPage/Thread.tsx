import { KeyboardEvent, FormEvent, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useApi, useDialect } from '@dialectlabs/react';
import type { ParsedErrorData } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import cs from '../../../../../../utils/classNames';
import MessageInput from './MessageInput';
import MessageBubble from '../../../../MessageBubble';

export default function Thread() {
  const {
    showMessages,
    isDialectCreating,
    dialect,
    messages,
    sendMessage,
    isWritable: youCanWrite,
    sendingMessages,
    cancelSendingMessage,
  } = useDialect();

  const { wallet } = useApi();
  const { scrollbar } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<ParsedErrorData | null | undefined>();

  const handleError = (err: ParsedErrorData) => {
    setError(err);
  };

  const handleSendMessage = async (messageText: string, id?: number) => {
    sendMessage(messageText, dialect?.dialect.encrypted, id).catch(handleError);
    setText('');
  };

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleSendMessage(text);
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      handleSendMessage(text);
    }
  };

  const disableSendButton =
    text.length <= 0 || text.length > 280 || isDialectCreating;

  const inputDisabled = isDialectCreating;

  const sendingMessagesInReversedOrder = [...sendingMessages].reverse();
  const allMessages = [...sendingMessagesInReversedOrder, ...messages];

  return (
    <div className="dt-flex dt-flex-col dt-h-full dt-justify-between">
      {/* TODO: fix messages which stretch the entire messaging col */}
      <div
        className={cs(
          'dt-flex dt-flex-auto dt-flex-col-reverse dt-overflow-y-auto dt-py-2 dt-space-y-2 dt-space-y-reverse',
          scrollbar
        )}
      >
        {showMessages ? (
          <TransitionGroup component={null}>
            {allMessages.map((message, idx) => {
              const isYou =
                message.owner.toString() === wallet?.publicKey?.toString();
              const key = message?.id;
              const isLast = idx === 0;

              // TODO: fix transition after message is sent (e.g. key/props shouldn't change)
              return (
                <CSSTransition
                  key={key}
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
                  <div data-key={key}>
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

      {youCanWrite && (
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
