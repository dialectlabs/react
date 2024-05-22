import { ThreadMessage } from '@dialectlabs/react-sdk';
import { ActionType } from '@dialectlabs/sdk';
import clsx from 'clsx';
import { useMemo } from 'react';
import { LinkIt } from 'react-linkify-it';
import { NotificationStyle } from '../../../../types';
import { Badge, BadgeVariant, useSmartMessage } from '../../../core';
import { SmartMessageStateDto } from '../../../core/model/api/smart-messages.types';
import { ClassTokens, Icons, NotificationTypeStyles } from '../../../theme';
import { useNotification } from '../context';
import { ButtonAction } from './ButtonAction';
import { LinkAction } from './LinkAction';
import { getColor, getMessageURLTarget, timeFormatter } from './utils';

export const NotificationMessage = (message: ThreadMessage) => {
  const styles = getStyles(message.metadata?.notificationTypeHumanReadableId);

  return (
    <div
      className={clsx(
        ClassTokens.Stroke.Primary,
        'dt-relative dt-flex dt-flex-row dt-items-center dt-gap-4 dt-overflow-hidden dt-border-b dt-px-4 dt-py-3',
      )}
    >
      <NotificationMessage.Icon
        styles={styles}
        isActionable={Boolean(message.metadata?.smartMessage)}
        overrideIconUrl={message.metadata?.smartMessage?.content.layout.icon}
      />
      <div className="dt-min-w-0">
        <NotificationMessage.ActionStatus
          action={message.metadata?.smartMessage}
        />
        <NotificationMessage.Title>
          {message.metadata?.title}
        </NotificationMessage.Title>
        <NotificationMessage.Text>{message.text}</NotificationMessage.Text>
        <NotificationMessage.Actions
          styles={styles}
          action={message.metadata?.smartMessage}
        />
        <NotificationMessage.Timestamp timestamp={message.timestamp} />
      </div>
    </div>
  );
};

NotificationMessage.Timestamp = function NotificationTimestamp({
  timestamp,
}: {
  timestamp: Date;
}) {
  return (
    <div className={clsx('dt-mt-3 dt-text-caption', ClassTokens.Text.Tertiary)}>
      {timeFormatter.format(timestamp.getTime())}
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
  action,
  styles,
}: {
  action?: Required<ThreadMessage>['metadata']['smartMessage'];
  styles: NotificationStyle;
}) {
  const {
    handleSmartMessageAction,
    isInitiatingSmartMessage,
    handleSmartMessageCancel,
    isCancellingSmartMessage,
  } = useSmartMessage();

  const layoutElements = useMemo(
    () => action?.content.layout.elements.flat() ?? [],
    [action],
  );

  if (!action) {
    return null;
  }

  return (
    <div className="dt-mt-3">
      <div className="dt-flex dt-flex-row dt-items-center dt-gap-2">
        {layoutElements.map((layoutElement, index) => {
          // `label` is an inactive button
          if (layoutElement.type === 'label') {
            return (
              <ButtonAction
                key={`label-${index}`}
                label={layoutElement.text}
                disabled={true}
              />
            );
          }

          if (layoutElement.action.type === 'SIGN_TRANSACTION') {
            const buttonAction = layoutElement.action;
            return (
              <ButtonAction
                key={`button-sign-${index}`}
                label={layoutElement.text}
                disabled={isCancellingSmartMessage || isInitiatingSmartMessage}
                loading={isInitiatingSmartMessage}
                onClick={() =>
                  handleSmartMessageAction(
                    action.id,
                    buttonAction.humanReadableId,
                  )
                }
              />
            );
          }

          if (layoutElement.action.type === 'CANCEL') {
            return (
              <ButtonAction
                key={`button-cancel-${index}`}
                label={layoutElement.text}
                disabled={isCancellingSmartMessage || isInitiatingSmartMessage}
                loading={isCancellingSmartMessage}
                onClick={() => handleSmartMessageCancel(action.id)}
              />
            );
          }

          return (
            <LinkAction
              key={`button-link-${index}`}
              url={layoutElement.action.link}
              styles={styles}
              label={layoutElement.text}
            />
          );
        })}
      </div>
      {action.content.layout.description && (
        <div
          className={clsx(
            'dt-mt-3 dt-text-caption',
            ClassTokens.Text.Secondary,
          )}
        >
          {action.content.layout.description}
        </div>
      )}
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
