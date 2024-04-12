import { ThreadMessage } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import {
  NotificationStyle,
  NotificationStyleToggleColor,
} from '../../../types';
import { ClassTokens, Icons, NotificationTypeStyles } from '../../theme';
import { useNotification } from './context';

const DefaultMessageStyles: NotificationStyle = {
  Icon: <Icons.Bell width={12} height={12} />,
  iconColor: 'var(--dt-icon-primary)',
  iconBackgroundColor: 'var(--dt-bg-brand)',
  iconBackgroundBackdropColor: 'var(--dt-bg-brand-transparent)',
  linkColor: 'var(--dt-accent-success)',
  actionGradientStartColor: 'transparent',
};

const timeFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
});

const getColor = (
  color?: string | NotificationStyleToggleColor,
  theme?: 'light' | 'dark',
): string | undefined => {
  if (!color) {
    return;
  }

  if (typeof color === 'string') {
    return color;
  }

  return color[theme || 'light'];
};

const getStyles = (notificationType?: string) => {
  if (notificationType) {
    return NotificationTypeStyles[notificationType] ?? DefaultMessageStyles;
  }

  return DefaultMessageStyles;
};

export const NotificationMessage = (message: ThreadMessage) => {
  const messageStyles = getStyles(
    message.metadata?.notificationTypeHumanReadableId,
  );

  return (
    <div
      className={clsx(
        ClassTokens.Stroke.Primary,
        'dt-relative dt-flex dt-flex-row dt-items-center dt-gap-4 dt-overflow-hidden dt-border-b dt-px-4 dt-py-3',
      )}
    >
      <div
        className="dt-pointer-events-none dt-absolute -dt-bottom-[36%] -dt-top-[36%] dt-left-0 dt-w-[240px] -dt-translate-x-1/2 dt-transform"
        style={{
          background:
            message.metadata?.actions?.length &&
            messageStyles.actionGradientStartColor
              ? `radial-gradient(50% 50% at 50% 50%, ${getColor(messageStyles.actionGradientStartColor)} 0%, transparent 100%)`
              : 'transparent',
        }}
      />
      <div className="dt-relative">
        <div
          className={clsx('dt-h-8 dt-w-8 dt-rounded-full dt-p-1.5')}
          style={{
            background: getColor(messageStyles.iconBackgroundBackdropColor),
          }}
        >
          <div
            className={clsx(
              'dt-flex dt-h-full dt-w-full dt-items-center dt-justify-center dt-rounded-full',
            )}
            style={{
              background: getColor(messageStyles.iconBackgroundColor),
              color: getColor(messageStyles.iconColor),
            }}
          >
            {messageStyles.Icon}
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
            )}
            style={{
              color: getColor(messageStyles.linkColor),
            }}
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
  id: ThreadMessage['id'];
}) {
  const notification = useNotification(id);

  // TODO: custom component injection
  return notification ? <NotificationMessage {...notification} /> : null;
};
