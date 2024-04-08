import clsx from 'clsx';
import { ClassTokens, Icons } from '../../theme';
import { useNotification } from './context';
import { Message } from './types';

const defaultMessageStyles = {
  shadow: 'dt-shadow-[--dt-accent-brand]',
  iconBackground: 'dt-bg-[--dt-accent-brand]',
  icon: <Icons.Bell width={12} height={12} />,
  link: 'dt-text-[--dt-accent-brand]',
  title: '',
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

export const NotificationMessage = (message: Message) => {
  const messageStyles = defaultMessageStyles;

  return (
    <div
      className={clsx(
        ClassTokens.Stroke.Primary,
        'dt-relative dt-flex dt-flex-row dt-items-center dt-gap-4 dt-overflow-hidden dt-border-b dt-px-4 dt-py-3',
      )}
    >
      <div className="dt-relative">
        <div
          className={clsx(
            'dt-absolute dt-left-1/2 dt-top-1/2 dt-opacity-20 dt-shadow-[0px_0px_60px_50px] ',
            messageStyles.shadow,
          )}
        />
        <div
          className={clsx(
            // messageStyles.iconBackground,
            //TODO bg-opacity doesn't work with variables???
            'dt-h-8 dt-w-8 dt-rounded-full dt-bg-accent-success dt-bg-opacity-10 dt-p-1.5',
          )}
        >
          <div
            className={clsx(
              'dt-flex dt-h-full dt-w-full dt-items-center dt-justify-center dt-rounded-full ',
              messageStyles.iconBackground,
              ClassTokens.Icon.Inverse,
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
            <Icons.ArrowRight />
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

NotificationMessage.Container = function NotificationMessageContainer({
  id,
}: {
  id: Message['id'];
}) {
  const notification = useNotification(id);

  // TODO: custom component injection
  return notification ? <NotificationMessage {...notification} /> : null;
};
