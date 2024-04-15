import {
  useDialectContext,
  useNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { Checkbox } from '../../core';
import { ClassTokens } from '../../theme';

interface Props {
  title: string;
  description?: string;
  enabled: boolean;
  onChange: (newValue: boolean) => void;
}

const NotificationType = ({ title, description, enabled, onChange }: Props) => {
  return (
    <div
      className={clsx(
        ClassTokens.Background.Secondary,
        ClassTokens.Radius.Medium,
        'dt-flex dt-flex-row dt-items-center dt-justify-between dt-gap-3 dt-px-4 dt-py-3',
      )}
    >
      <div className="dt-flex dt-flex-col dt-gap-1">
        <span
          className={clsx(
            ClassTokens.Text.Primary,
            'dt-text-text dt-font-semibold',
          )}
        >
          {title}
        </span>
        {description && (
          <span
            className={clsx(
              ClassTokens.Text.Tertiary,
              'dt-text-subtext dt-font-normal',
            )}
          >
            {description}
          </span>
        )}
      </div>
      <Checkbox checked={enabled} onChange={onChange} />
    </div>
  );
};

export const NotificationTypes = () => {
  const { dappAddress } = useDialectContext();

  const {
    subscriptions: notificationSubscriptions,
    update: updateNotificationSubscription,
    isUpdating,
    errorUpdating: errorUpdatingNotificationSubscription,
    errorFetching: errorFetchingNotificationsConfigs,
  } = useNotificationSubscriptions({ dappAddress });
  const error =
    errorFetchingNotificationsConfigs || errorUpdatingNotificationSubscription;

  return (
    <div className="dt-flex dt-flex-col dt-gap-2">
      {error && <p className={clsx(ClassTokens.Text.Error)}>{error.message}</p>}
      {Boolean(notificationSubscriptions.length) && (
        <>
          <p
            className={clsx(
              ClassTokens.Text.Tertiary,
              'dt-text-subtext dt-font-semibold',
            )}
          >
            Notification Type
          </p>
          {notificationSubscriptions.map(
            ({ notificationType, subscription }) => (
              <NotificationType
                key={notificationType.id}
                title={notificationType.name}
                description={notificationType.trigger}
                enabled={subscription.config.enabled}
                onChange={(value) => {
                  if (isUpdating) return;
                  updateNotificationSubscription(
                    {
                      notificationTypeId: notificationType.id,
                      config: {
                        ...subscription.config,
                        enabled: value,
                      },
                    },
                    {
                      optimisticData: {},
                    },
                  );
                }}
              />
            ),
          )}
        </>
      )}
    </div>
  );
};
