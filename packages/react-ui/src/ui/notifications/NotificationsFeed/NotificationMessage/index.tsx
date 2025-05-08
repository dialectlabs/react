import {
  ActionElement,
  HistoricalAlert,
  ThreadMessage,
} from '@dialectlabs/react-sdk';
import { ActionType } from '@dialectlabs/sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import { LinkIt } from 'react-linkify-it';
import { NotificationStyle } from '../../../../types';
import { Badge, BadgeVariant } from '../../../core';
import { SmartMessageStateDto } from '../../../core/model/api/smart-messages.types';
import { ClassTokens, Icons, NotificationTypeStyles } from '../../../theme';
import { useNotification } from '../context';
import { LinkAction } from './LinkAction';
import { getColor, getMessageURLTarget, timeFormatter } from './utils';

export const NotificationMessage = (alert: HistoricalAlert) => {
  const styles = getStyles(alert.topic?.slug);

  return (
    <div
      className={clsx(
        ClassTokens.Stroke.Primary,
        'dt-relative dt-flex dt-flex-row dt-items-center dt-gap-4 dt-overflow-hidden dt-border-b dt-px-4 dt-py-3',
      )}
    >
      <NotificationMessage.Icon
        styles={styles}
        isActionable={!!alert.actions && alert.actions.length > 0}
        overrideIconUrl={alert.image}
      />
      <div className="dt-min-w-0">
        <NotificationMessage.Title>{alert.title}</NotificationMessage.Title>
        <NotificationMessage.Text>{alert.body}</NotificationMessage.Text>
        <NotificationMessage.Actions styles={styles} actions={alert.actions} />
        <NotificationMessage.Timestamp timestamp={alert.timestamp} />
      </div>
    </div>
  );
};

NotificationMessage.Timestamp = function NotificationTimestamp({
  timestamp,
}: {
  timestamp: string;
}) {
  const date = useMemo(() => new Date(timestamp), [timestamp]);

  return (
    <div className={clsx('dt-mt-3 dt-text-caption', ClassTokens.Text.Tertiary)}>
      {timeFormatter.format(date.getTime())}
    </div>
  );
};

const MAX_URL_LENGTH = 32;
const URL_REGEX =
  /(https?:\/\/|www\.)([-\w.]+\/[\p{L}\p{Emoji}\p{Emoji_Component}!#$%&'"()*+,./\\:;=_?@[\]~-]*[^\s'",.;:\b)\]}?]|(([\w-]+\.)+[\w-]+[\w/-]))/u;

NotificationMessage.Text = function NotificationMessageText({
  children,
}: {
  children: string;
}) {
  const messageText = useMemo(
    () => (
      <LinkIt
        regex={URL_REGEX}
        component={(url, key) => (
          <a
            key={key}
            href={url}
            target={getMessageURLTarget(url)}
            className="dt-font-medium dt-underline"
          >
            {url.length > MAX_URL_LENGTH
              ? `${url.slice(0, MAX_URL_LENGTH)}...`
              : url}
          </a>
        )}
      >
        {children}
      </LinkIt>
    ),
    [children],
  );

  return (
    <div
      className={clsx(
        ClassTokens.Text.Primary,
        'dt-whitespace-pre-wrap dt-break-words dt-text-subtext',
      )}
    >
      {messageText}
    </div>
  );
};

NotificationMessage.Title = function NotificationTitle({
  children,
}: {
  children?: string;
}) {
  return children ? (
    <div
      className={clsx(
        ClassTokens.Text.Primary,
        'dt-mb-1 dt-whitespace-pre-wrap dt-break-words dt-text-text dt-font-semibold',
      )}
    >
      {children}
    </div>
  ) : null;
};

NotificationMessage.Icon = function NotificationIcon({
  overrideIconUrl,
  styles,
  isActionable,
}: {
  overrideIconUrl?: string | null;
  styles: NotificationStyle;
  isActionable: boolean;
}) {
  return (
    <>
      <div
        className="dt-pointer-events-none dt-absolute -dt-bottom-[36%] -dt-top-[36%] dt-left-0 dt-w-[240px] -dt-translate-x-1/2 dt-transform"
        style={{
          background:
            isActionable && styles.actionGradientStartColor
              ? `radial-gradient(50% 50% at 50% 50%, ${getColor(styles.actionGradientStartColor)} 0%, transparent 100%)`
              : 'transparent',
        }}
      />
      <div className="dt-relative">
        {overrideIconUrl ? (
          <div
            className={clsx(
              'dt-h-8 dt-w-8 dt-overflow-hidden dt-border',
              ClassTokens.Radius.XSmall,
              ClassTokens.Stroke.Primary,
            )}
          >
            <img
              src={overrideIconUrl}
              alt=""
              className="dt-h-full dt-w-full dt-object-cover"
            />
          </div>
        ) : (
          <div
            className={clsx('dt-h-8 dt-w-8 dt-rounded-full dt-p-1.5')}
            style={{
              background: getColor(styles.iconBackgroundBackdropColor),
            }}
          >
            <div
              className={clsx(
                'dt-flex dt-h-full dt-w-full dt-items-center dt-justify-center dt-rounded-full',
              )}
              style={{
                background: getColor(styles.iconBackgroundColor),
                color: getColor(styles.iconColor),
              }}
            >
              {styles.Icon}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

NotificationMessage.Actions = function NotificationActions({
  actions,
  styles,
}: {
  actions?: ActionElement[];
  styles: NotificationStyle;
}) {
  if (!actions) {
    return null;
  }

  return (
    <div className="dt-mt-3">
      <div className="dt-flex dt-flex-row dt-items-center dt-gap-2">
        {actions.map((action, index) => {
          if (action.type === 'link') {
            return (
              <LinkAction
                key={`button-link-${index}`}
                url={action.url}
                styles={styles}
                label={action.label}
              />
            );
          }

          return null;
        })}
      </div>
    </div>
  );
};

const getBadgeVariant = (state: SmartMessageStateDto): BadgeVariant => {
  switch (state) {
    case SmartMessageStateDto.Succeeded:
      return 'success';
    case SmartMessageStateDto.Failed:
      return 'error';
    default:
      return 'default';
  }
};

const actionStateTextMap: Record<SmartMessageStateDto, string> = {
  [SmartMessageStateDto.Created]: 'Ready',
  [SmartMessageStateDto.ReadyForExecution]: 'Executing',
  [SmartMessageStateDto.Executing]: 'Executing',
  [SmartMessageStateDto.Succeeded]: 'Succeeded',
  [SmartMessageStateDto.Failed]: 'Failed',
  [SmartMessageStateDto.Canceled]: 'Canceled',
};

NotificationMessage.ActionStatus = function NotificationActionStatus({
  action,
}: {
  action?: Required<ThreadMessage>['metadata']['smartMessage'];
}) {
  if (
    !action ||
    action.content.layout.elements
      .flat()
      .every(
        (el) => el.type === 'button' && el.action.type === ActionType.OpenLink,
      )
  ) {
    return null;
  }

  return (
    <div className="dt-mb-2">
      <Badge variant={getBadgeVariant(action.content.state)}>
        {actionStateTextMap[action.content.state]}
      </Badge>
    </div>
  );
};

const DefaultMessageStyles: NotificationStyle = {
  Icon: <Icons.Bell width={12} height={12} />,
  iconColor: 'var(--dt-icon-primary)',
  iconBackgroundColor: 'var(--dt-bg-brand)',
  iconBackgroundBackdropColor: 'var(--dt-brand-transparent)',
  linkColor: 'var(--dt-accent-brand)',
  actionGradientStartColor: 'transparent',
};

const getStyles = (notificationType?: string) => {
  if (notificationType) {
    return NotificationTypeStyles[notificationType] ?? DefaultMessageStyles;
  }

  return DefaultMessageStyles;
};

NotificationMessage.Container = function NotificationMessageContainer({
  id,
}: {
  id: ThreadMessage['id'];
}) {
  const notification = useNotification(id);

  if (!notification) {
    return null;
  }

  return <NotificationMessage {...notification} />;
};
