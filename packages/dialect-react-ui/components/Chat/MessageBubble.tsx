import { formatTimestamp } from '@dialectlabs/react';
import type { Message } from '@dialectlabs/web3';
import clsx from 'clsx';
import Avatar from '../Avatar';
import { LinkifiedText } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import MessageStatus from './MessageStatus';

type MessageBubbleProps = Message & {
  isYou: boolean;
  isSending: boolean;
  error: string;
  showStatus: boolean;
  onSendMessage: (text: string, id: number) => void;
  onCancelMessage: (id: number) => void;
};

export default function MessageBubble({
  id,
  owner,
  text,
  timestamp,
  isYou,
  isSending,
  error,
  showStatus,
  onSendMessage,
  onCancelMessage,
}: MessageBubbleProps) {
  const { icons, messageBubble, otherMessageBubble } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-items-center dt-mb-2',
        isYou && 'dt-ml-10 dt-justify-end'
      )}
    >
      <div className="dt-flex dt-flex-col">
        <div
          className={clsx(
            'dt-flex dt-flex-row',
            isYou && 'dt-justify-end dt-items-end'
          )}
        >
          {!isYou ? (
            <div className="dt-mr-1">
              <Avatar size="small" publicKey={owner} />
            </div>
          ) : null}
          <div
            className={clsx(
              'dt-flex-row',
              isYou ? messageBubble : otherMessageBubble,
              isYou ? 'dt-max-w-full ' : 'dt-max-w-xs dt-flex-shrink dt-ml-1'
            )}
          >
            <div className={'dt-items-end'}>
              <div
                className={clsx(
                  'dt-break-words dt-whitespace-pre-wrap dt-text-sm',
                  isYou ? 'dt-text-right' : 'dt-text-left'
                )}
              >
                <LinkifiedText>{text}</LinkifiedText>
              </div>
              <div className={'dt-opacity-50 dt-text-xs dt-text-right'}>
                {isSending ? 'Sending...' : formatTimestamp(timestamp)}
              </div>
            </div>
          </div>
          <div className="dt-inline-flex dt-w-4 dt-ml-1">
            {showStatus || isSending || error?.message ? (
              <MessageStatus isSending={isSending} error={error?.message} />
            ) : null}
          </div>
        </div>

        {error ? (
          <div className="dt-flex dt-flex-col dt-mt-1 dt-pr-9">
            <div className="dt-text-xs dt-flex dt-items-center dt-justify-end">
              <a
                className="dt-inline-flex dt-items-center hover:dt-opacity-50 dt-transition-opacity dt-cursor-pointer"
                onClick={() => {
                  onSendMessage(text, id);
                }}
              >
                <icons.arrowclockwise className="dt-mr-1" />
                retry
              </a>
              <div className="dt-h-3 dt-w-[1px] dt-mx-1 dt-bg-current dt-opacity-50" />
              <a
                className="dt-inline-flex dt-items-center hover:dt-opacity-50 dt-transition-opacity dt-cursor-pointer"
                onClick={() => onCancelMessage(id)}
              >
                <icons.x className="dt-h-4 dt-w-4" />
                cancel
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
