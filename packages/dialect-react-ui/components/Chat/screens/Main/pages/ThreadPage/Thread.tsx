import React, { KeyboardEvent, FormEvent, useState } from 'react';
import cs from '../../../../../../utils/classNames';
import { useDialect } from '@dialectlabs/react';
import { useApi } from '@dialectlabs/react';
import { useTheme } from '../../../../../common/ThemeProvider';
import { formatTimestamp } from '@dialectlabs/react';
import MessageInput from './MessageInput';
import Avatar from '../../../../../Avatar';

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
                    <div className={'dt-break-words dt-text-sm dt-text-right'}>
                      {message.text}
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
                  <div className={'dt-text-sm dt-break-words'}>
                    {message.text}
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
          disabled={disabled}
        />
      )}
    </div>
  );
}
