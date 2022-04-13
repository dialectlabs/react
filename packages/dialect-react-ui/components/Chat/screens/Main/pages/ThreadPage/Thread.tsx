import React, { KeyboardEvent, FormEvent, useState, useEffect } from 'react';
import Linkify from 'react-linkify';
import { useApi, useDialect, formatTimestamp } from '@dialectlabs/react';
import type { ParsedErrorData } from '@dialectlabs/react';
import { A } from '../../../../../common/preflighted';
import { useTheme } from '../../../../../common/ThemeProvider';
import cs from '../../../../../../utils/classNames';
import Avatar from '../../../../../Avatar';
import MessageInput from './MessageInput';

export default function Thread() {
  const { isDialectCreating, dialect, messages, sendMessage, sendingMessage } =
    useDialect();
  const { wallet } = useApi();
  const { messageBubble, otherMessageBubble, textStyles } = useTheme();

  const [text, setText] = useState<string>('');
  const [error, setError] = useState<ParsedErrorData | null | undefined>();
  const [youCanWrite, setYouCanWrite] = useState<boolean>(false);

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

  useEffect(() => {
    const membersContainCurrentKey = dialect?.dialect.members.some(
      (m) => m.publicKey.equals(wallet?.publicKey) && m.scopes[1] // is not admin but does have write privilages
    );
    if (membersContainCurrentKey) {
      setYouCanWrite(membersContainCurrentKey);
    }
  }, [dialect?.dialect]);

  const disableSendButton =
    text.length <= 0 ||
    text.length > 280 ||
    isDialectCreating ||
    sendingMessage;

  const inputDisabled = isDialectCreating || sendingMessage;

  return (
    <div className="dt-flex dt-flex-col dt-h-full dt-justify-between">
      <div className="dt-h-full dt-py-2 dt-overflow-y-auto dt-flex dt-flex-col-reverse dt-space-y-2 dt-space-y-reverse dt-justify-start">
        {messages.map((message) => {
          const isYou =
            message.owner.toString() === wallet?.publicKey?.toString();

          if (isYou) {
            return (
              <div
                key={message.timestamp}
                className={
                  'dt-ml-10 dt-flex dt-flex-row dt-items-center dt-mb-2 dt-justify-end'
                }
              >
                <div className={cs(messageBubble, 'dt-max-w-full dt-flex-row')}>
                  <div className={'dt-items-end'}>
                    <div
                      className={
                        'dt-break-words dt-text-sm dt-text-right dt-whitespace-pre-wrap'
                      }
                    >
                      <Linkify
                        componentDecorator={(
                          decoratedHref: string,
                          decoratedText: string,
                          key: number
                        ) => (
                          <A
                            target="blank"
                            className={textStyles.link}
                            href={decoratedHref}
                            key={key}
                          >
                            {decoratedText.length > 32
                              ? decoratedText.slice(0, 32) + '...'
                              : decoratedText}
                          </A>
                        )}
                      >
                        {message.text}
                      </Linkify>
                    </div>
                    <div className={''}>
                      <div className={'dt-opacity-50 dt-text-xs'}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div
              key={message.timestamp}
              className={'dt-flex dt-flex-row dt-mb-2'}
            >
              <div className={''}>
                <Avatar size="small" publicKey={message.owner} />
              </div>
              <div
                className={cs(
                  otherMessageBubble,
                  'dt-max-w-xs dt-flex-row dt-flex-shrink'
                )}
              >
                <div className={'dt-text-left'}>
                  <div
                    className={
                      'dt-text-sm dt-break-words dt-whitespace-pre-wrap'
                    }
                  >
                    <Linkify
                      componentDecorator={(
                        decoratedHref: string,
                        decoratedText: string,
                        key: number
                      ) => (
                        <A
                          target="blank"
                          className={textStyles.link}
                          href={decoratedHref}
                          key={key}
                        >
                          {decoratedText.length > 32
                            ? decoratedText.slice(0, 32) + '...'
                            : decoratedText}
                        </A>
                      )}
                    >
                      {message.text}
                    </Linkify>
                  </div>
                  <div className={'dt-items-end'}>
                    <div className={'dt-opacity-50 dt-text-xs dt-text-right'}>
                      {formatTimestamp(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
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
