import clsx from 'clsx';
import { ClassTokens } from '../../theme';

const defaultMessageStyles = {
  shadow: 'dt-shadow-purple-60',
  iconBackground: 'dt-bg-purple-50',
  icon: null,
  link: 'dt-text-purple-50',
  title: '',
};

export interface Message {
  text: string;
  metadata?: {
    notificationTypeHumanReadableId?: string;
    title?: string;
    actions?: [{ url?: string; label?: string }];
  };
  timestamp: Date;
}
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});
export const NotificationMessage = (message: Message) => {
  //'announcement' or 'filled-order'

  const messageStyles =
    message.metadata?.notificationTypeHumanReadableId === 'filled-order'
      ? {
          shadow: 'dt-shadow-green-50',
          iconBackground: 'dt-bg-green-50',
          link: 'dt-text-green-50',
          icon: null,
          title: 'dt-text-green-50',
        }
      : defaultMessageStyles;

  return (
    <div className="dt-relative dt-flex dt-flex-row dt-items-center dt-gap-4 dt-overflow-hidden dt-px-4 dt-py-3">
      <div className="relative">
        <div
          className={clsx(
            'dt-absolute dt-left-4 dt-top-4 dt-opacity-20 dt-shadow-[0px_0px_60px_50px] ',
            messageStyles.shadow,
          )}
        />
        <div
          className={clsx(
            'dt-h-8 dt-w-8 dt-rounded-full dt-bg-opacity-10 dt-p-1.5 ',
            messageStyles.iconBackground,
          )}
        >
          <div
            className={clsx(
              'dt-flex dt-h-full dt-w-full dt-items-center dt-justify-center dt-rounded-full ',
              messageStyles.iconBackground,
            )}
          >
            {messageStyles.icon}
          </div>
        </div>
      </div>
      <div className="dt-min-w-0">
        {message.metadata?.title && (
          <div
            className={clsx(
              ClassTokens.Text.Primary,
              'dt-whitespace-pre-wrap dt-break-words dt-pb-2 dt-text-text dt-font-semibold',
            )}
          >
            {message.metadata.title}
          </div>
        )}
        <div
          className={clsx(
            ClassTokens.Text.Secondary,
            'dt-whitespace-pre-wrap dt-break-words dt-text-subtext',
          )}
        >
          {message.text}
        </div>
        {message.metadata?.actions?.[0]?.url && (
          <a
            href={message.metadata.actions[0].url}
            target="_blank"
            className={clsx(
              'dt-flex dt-flex-row dt-items-center dt-gap-0.5 dt-pt-3 dt-text-subtext dt-font-semibold',
              messageStyles.link,
            )}
            rel="noreferrer"
          >
            {message.metadata.actions[0].label || 'Open Link'}
            {/*<ArrowRight size={16} />*/}
          </a>
        )}
        <div
          className={clsx('dt-pt-3 dt-text-caption', ClassTokens.Text.Tertiary)}
        >
          {timeFormatter.format(message.timestamp.getTime())}
        </div>
      </div>
    </div>
  );
};
