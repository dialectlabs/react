import {
  KeyboardEvent,
  FormEvent,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useApi, useDialect, formatTimestamp } from '@dialectlabs/react';
import type { ParsedErrorData } from '@dialectlabs/react';
import { Button, LinkifiedText } from '../../../../../common';
import { useTheme } from '../../../../../common/ThemeProvider';
import cs from '../../../../../../utils/classNames';
import Avatar from '../../../../../Avatar';
import MessageInput from './MessageInput';
import hash from 'object-hash';

export default function Thread() {
  const {
    isDialectCreating,
    dialect,
    messages,
    sendMessage,
    sendingMessage,
    isWritable: youCanWrite,
    sendingMessages,
    sendingMessagesMap,
    cancelSendingMessage,
  } = useDialect();

  const { wallet } = useApi();
  const { icons, messageBubble, otherMessageBubble, scrollbar } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<ParsedErrorData | null | undefined>();

  const handleError = (err: ParsedErrorData) => {
    setError(err);
  };

  const handleSendMessage = async (messageText: string, id?: number) => {
    sendMessage(messageText, dialect?.dialect.encrypted, id).catch((err) =>
      handleError(err)
    );
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

  const messagesInRightOrder = [].concat(messages).reverse();
  const allMessages = [].concat(messagesInRightOrder, sendingMessages);

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
                const key = hash(message.text) + idx;

                if (isYou) {
                  return (
                    <CSSTransition
                      key={key}
                      timeout={200}
                      classNames={{
                        // TODO: move to theme
                        enter: 'dt-translate-y-full',
                        enterActive:
                          'dt-translate-y-0 dt-transition-transform dt-duration-200 dt-ease-in-out',
                      }}
                    >
                      <div
                        className={
                          'dt-ml-10 dt-flex dt-flex-row dt-items-center dt-mb-2 dt-justify-end'
                        }
                      >
                        <div className="dt-flex-col">
                          <div
                            className={cs(
                              messageBubble,
                              'dt-max-w-full dt-flex-row'
                            )}
                          >
                            <div className={'dt-items-end'}>
                              <div
                                className={
                                  'dt-break-words dt-whitespace-pre-wrap dt-text-sm dt-text-right'
                                }
                              >
                                <LinkifiedText>{message.text}</LinkifiedText>
                              </div>
                              <div className={''}>
                                <div className={'dt-opacity-50 dt-text-xs'}>
                                  {message.isSending
                                    ? 'Sending...'
                                    : formatTimestamp(message.timestamp)}
                                </div>
                              </div>
                            </div>
                          </div>
                          {message?.error ? (
                            <div className="dt-flex dt-flex-col dt-mr-4">
                              <div className="dt-text-xs dt-pl-1 dt-text-red-500">
                                Error: {message?.error?.message}
                              </div>
                              <div className="dt-text-xs dt-flex dt-items-center dt-justify-end">
                                <a
                                  className="dt-inline-flex dt-items-center hover:dt-opacity-50 dt-transition-opacity dt-cursor-pointer"
                                  onClick={() => {
                                    handleSendMessage(message.text, message.id);
                                  }}
                                >
                                  <icons.arrowclockwise className="dt-mr-1" />
                                  retry
                                </a>
                                <div className="dt-h-3 dt-w-[1px] dt-mx-1 dt-bg-current dt-opacity-50" />
                                <a
                                  className="dt-inline-flex dt-items-center hover:dt-opacity-50 dt-transition-opacity dt-cursor-pointer"
                                  onClick={() =>
                                    cancelSendingMessage(message.id)
                                  }
                                >
                                  <icons.x className="dt-h-4 dt-w-4" />
                                  cancel
                                </a>
                              </div>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </CSSTransition>
                  );
                }

                return (
                  <CSSTransition
                    key={key}
                    timeout={200}
                    classNames={{
                      enter: 'dt-translate-y-full',
                      enterActive:
                        'dt-translate-y-0 dt-transition-transform dt-duration-200 dt-ease-in-out',
                      enterDone: 'dt-translate-y-0',
                    }}
                  >
                    <div className={'dt-flex dt-flex-row dt-mb-2'}>
                      <div className={''}>
                        <Avatar size="small" publicKey={message.owner} />
                      </div>
                      <div
                        className={cs(
                          otherMessageBubble,
                          'dt-max-w-xs dt-flex-row dt-flex-shrink dt-ml-1'
                        )}
                      >
                        <div className={'dt-text-left'}>
                          <div
                            className={
                              'dt-text-sm dt-break-words dt-whitespace-pre-wrap'
                            }
                          >
                            <LinkifiedText>{message.text}</LinkifiedText>
                          </div>
                          <div className={'dt-items-end'}>
                            <div
                              className={
                                'dt-opacity-50 dt-text-xs dt-text-right'
                              }
                            >
                              {message.isSending
                                ? 'Sending...'
                                : formatTimestamp(message.timestamp)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
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
