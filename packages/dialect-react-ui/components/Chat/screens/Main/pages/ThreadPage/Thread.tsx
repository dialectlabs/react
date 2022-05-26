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
import { LinkifiedText } from '../../../../../common';
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
  } = useDialect();

  const { wallet } = useApi();
  const { messageBubble, otherMessageBubble, scrollbar } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<ParsedErrorData | null | undefined>();

  const handleError = (err: ParsedErrorData) => {
    setError(err);
  };

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(text, dialect?.dialect.encrypted)
      .then(() => setText(''))
      .catch(handleError);
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      await sendMessage(text, dialect?.dialect.encrypted)
        .then(() => setText(''))
        .catch(handleError);
    }
  };

  const disableSendButton =
    text.length <= 0 ||
    text.length > 280 ||
    isDialectCreating ||
    sendingMessage;

  const inputDisabled = isDialectCreating || sendingMessage;

  return (
    <div className="dt-flex dt-flex-col dt-h-full dt-justify-between">
      {/* TODO: fix messages which stretch the entire messaging col */}
      <div
        className={cs(
          'dt-h-full dt-py-2 dt-overflow-y-auto dt-flex dt-flex-col-reverse dt-space-y-2 dt-space-y-reverse dt-justify-start',
          scrollbar
        )}
      >
        {messages.length ? (
          <TransitionGroup component={null}>
            {messages.map((message, idx) => {
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
                            className={'dt-opacity-50 dt-text-xs dt-text-right'}
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
