import { KeyboardEvent, FormEvent, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useApi, useDialect } from '@dialectlabs/react';
import type { ParsedErrorData } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import cs from '../../../../../../utils/classNames';
import MessageInput from './MessageInput';
import hash from 'object-hash';
import MessageBubble from '../../../../MessageBubble';

export default function Thread() {
  const {
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

  const messagesInRightOrder = [...messages].reverse();
  const allMessages = [...messagesInRightOrder, ...sendingMessages];

  return (
    <div className="dt-flex dt-flex-col dt-h-full dt-justify-between">
      {/* TODO: fix messages which stretch the entire messaging col */}
      <div
        className={cs(
          'dt-flex dt-flex-auto dt-flex-col-reverse dt-overflow-y-auto',
          scrollbar
        )}
      >
        <div className="dt-py-2 dt-space-y-2 dt-space-y-reverse">
          {allMessages.length ? (
            <TransitionGroup component={null}>
              {allMessages.map((message, idx) => {
                const isYou =
                  message.owner.toString() === wallet?.publicKey?.toString();
                /* TODO: more efficient key */
                const key = message?.id || hash(message.text) + idx;
                const isLast = idx === messages.length - 1;

                return (
                  <CSSTransition
                    key={key}
                    timeout={200}
                    classNames={{
                      // TODO: move transition settings to theme
                      enter: 'dt-translate-y-full',
                      enterActive:
                        'dt-translate-y-0 dt-transition-transform dt-duration-200 dt-ease-in-out',
                    }}
                  >
                    <MessageBubble
                      {...message}
                      isYou={isYou}
                      showStatus={isLast}
                      onSendMessage={handleSendMessage}
                      onCancelMessage={cancelSendingMessage}
                    />
                  </CSSTransition>
                );
              })}
            </TransitionGroup>
          ) : null}
        </div>
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
