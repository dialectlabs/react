import { CSSTransition } from 'react-transition-group';
import clsx from 'clsx';
import Avatar from '../Avatar';
import { ButtonLink, LinkifiedText } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import MessageStatus from './MessageStatus';
import type { LocalThreadMessage } from '@dialectlabs/react-sdk';
import { formatTimestamp } from '../../utils/timeUtils';

type MessageBubbleProps = LocalThreadMessage & {
  isOnChain: boolean;
  isYou: boolean;
  isSending?: boolean;
  error?: { message: string } | null;
  showStatus: boolean;
  onSendMessage: (text: string, id: string) => void;
  onCancelMessage: (id: string) => void;
};

export default function MessageBubble({
  id,
  author,
  text,
  timestamp,
  isYou,
  isOnChain,
  isSending,
  error,
  showStatus,
  onSendMessage,
  onCancelMessage,
}: MessageBubbleProps) {
  const {
    icons,
    messageBubble,
    message,
    otherMessage,
    messageOnChain,
    otherMessageOnChain,
  } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-row dt-items-center',
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
              <Avatar size="small" publicKey={author.publicKey} />
            </div>
          ) : null}
          <div
            className={clsx(
              'dt-flex-row',
              messageBubble,
              isYou && isOnChain && messageOnChain,
              !isYou && isOnChain && otherMessageOnChain,
              isYou && !isOnChain && message,
              !isYou && !isOnChain && otherMessage,
              isYou ? 'dt-max-w-full ' : 'dt-max-w-xs dt-flex-shrink dt-ml-1'
            )}
          >
            <div className="dt-items-end">
              <div
                className={clsx(
                  'dt-break-words dt-whitespace-pre-wrap dt-text-sm',
                  isYou ? 'dt-text-right' : 'dt-text-left'
                )}
              >
                <LinkifiedText>{text}</LinkifiedText>
              </div>
              <div className={'dt-opacity-50 dt-text-xs dt-text-right'}>
                {isSending
                  ? 'Sending...'
                  : formatTimestamp(timestamp.getTime())}
              </div>
            </div>
          </div>
          <div className="dt-inline-flex dt-w-4 dt-ml-1">
            {showStatus || isSending || error?.message ? (
              <MessageStatus isSending={isSending} error={error?.message} />
            ) : null}
          </div>
        </div>

        <CSSTransition in={Boolean(error)} timeout={300}>
          {(state) => (
            <div
              className={clsx(
                'dt-overflow-hidden',
                state === 'entering' && 'dt-max-h-0',
                state === 'entered' &&
                  'dt-max-h-[20px] dt-transition-[max-height] dt-duration-300',
                state === 'exiting' && 'dt-max-h-[20px]',
                state === 'exited' &&
                  'dt-max-h-0 dt-transition-[max-height] dt-duration-300'
              )}
            >
              <div className="dt-flex dt-flex-col dt-mt-1 dt-pr-9">
                <div className="dt-text-xs dt-flex dt-items-center dt-justify-end">
                  <ButtonLink
                    className={clsx(
                      state === 'entering' && 'dt-opacity-0 dt-scale-75',
                      state === 'entered' &&
                        'dt-opacity-100 dt-scale-100 dt-transition-transform dt-duration-300'
                    )}
                    onClick={() => onSendMessage(text, id)}
                  >
                    <icons.arrowclockwise className="dt-h-3 dt-w-3 dt-mr-0.5" />
                    <span>retry</span>
                  </ButtonLink>
                  <div
                    className={clsx(
                      'dt-h-3 dt-w-[1px] dt-ml-2 dt-mr-1 dt-bg-current dt-opacity-30',
                      state === 'entering' && 'dt-opacity-0',
                      state === 'entered' &&
                        'dt-opacity-30 dt-transition dt-delay-100'
                    )}
                  />
                  <ButtonLink
                    className={clsx(
                      state === 'entering' && 'dt-opacity-0 dt-scale-75',
                      state === 'entered' &&
                        'dt-opacity-100 dt-scale-100 dt-transition-transform dt-duration-300'
                    )}
                    onClick={() => onCancelMessage(id)}
                  >
                    <icons.cancel className="dt-h-3 dt-w-3 dt-mr-0.5" />
                    <span>cancel</span>
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </CSSTransition>
      </div>
    </div>
  );
}
