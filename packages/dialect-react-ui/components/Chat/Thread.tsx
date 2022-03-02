import React, { KeyboardEvent, FormEvent, useState } from 'react';
import cs from '../../utils/classNames';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { useTheme } from '../common/ThemeProvider';
import { formatTimestamp } from '@dialectlabs/react';
import MessageInput from './MessageInput';
import Avatar from '../Avatar';

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {};

export default function Thread() {
  const { isDialectCreating, dialect, messages, sendMessage, sendingMessage } =
    useDialect();
  const { wallet } = useApi();
  const { messageBubble, otherMessageBubble } = useTheme();

  const [text, setText] = useState<string>('');

  const onMessageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendMessage(text)
      .then(() => setText(''))
      .catch(noop);
  };

  const onEnterPress = async (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      await sendMessage(text)
        .then(() => setText(''))
        .catch(noop);
    }
  };
  const youCanWrite = dialect?.dialect.members.some(
    (m) => m.publicKey.equals(wallet?.publicKey) && m.scopes[1]
  );
  const disabled =
    text.length <= 0 ||
    text.length > 280 ||
    isDialectCreating ||
    sendingMessage;

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="h-full py-2 overflow-y-auto flex flex-col flex-col-reverse space-y-2 space-y-reverse justify-start">
        {messages.map((message) => {
          const isYou =
            message.owner.toString() === wallet?.publicKey?.toString();

          if (isYou) {
            return (
              <div
                key={message.timestamp}
                className={'ml-10 flex flex-row items-center mb-2 justify-end'}
              >
                <div className={cs(messageBubble, 'max-w-full flex-row')}>
                  <div className={'items-end'}>
                    <div className={'break-words text-sm text-right'}>
                      {message.text}
                    </div>
                    <div className={''}>
                      <div className={'opacity-50 text-xs'}>
                        {formatTimestamp(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={message.timestamp} className={'flex flex-row mb-2'}>
              <div className={''}>
                <Avatar size="small" publicKey={message.owner} />
              </div>
              <div
                className={cs(
                  otherMessageBubble,
                  'max-w-xs flex-row flex-shrink'
                )}
              >
                <div className={'text-left'}>
                  <div className={'text-sm break-words'}>{message.text}</div>
                  <div className={'items-end'}>
                    <div className={'opacity-50 text-xs text-right'}>
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
          disabled={disabled}
        />
      )}
    </div>
  );
}
