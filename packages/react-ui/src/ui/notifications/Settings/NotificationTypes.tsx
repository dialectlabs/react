import {
  optimisticTopicUpdateFn,
  useDialectContext,
  useManageTopics,
  useTopics,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { memo } from 'react';
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

export const NotificationTypes = memo(function NotificationTypes() {
  const {
    topics,
    isLoading: isLoadingTopics,
    error: errorFetchingTopics,
  } = useTopics();
  const {
    app: { id: appId },
  } = useDialectContext();

  const { subscribe, unsubscribe, isSubscribing, isUnsubscribing } =
    useManageTopics();

  const isLoading = isLoadingTopics || isSubscribing || isUnsubscribing;

  return (
    <div className="dt-flex dt-h-full dt-flex-col dt-gap-2">
      <p className={clsx(ClassTokens.Text.Tertiary, 'dt-mb-4 dt-text-text')}>
        Pick your topics and choose what you want to keep track of:
      </p>
      {errorFetchingTopics && (
        <p
          className={clsx(
            ClassTokens.Text.Secondary,
            'dt-mb-4 dt-text-center dt-text-text',
          )}
        >
          Failed to fetch alert topics. Please try again later.
        </p>
      )}
      {!errorFetchingTopics &&
        topics.map((topic) => (
          <NotificationType
            key={topic.id}
            title={topic.name}
            description={topic.description}
            enabled={topic.subscribed}
            onChange={async (value) => {
              if (isLoading) return;

              const changeAction = value ? subscribe : unsubscribe;

              await changeAction(
                { topicId: topic.id },
                {
                  rollbackOnError: true,
                  optimisticData: optimisticTopicUpdateFn(
                    topic.id,
                    value,
                    appId,
                  ),
                  revalidate: false,
                },
              );
            }}
          />
        ))}
    </div>
  );
});
