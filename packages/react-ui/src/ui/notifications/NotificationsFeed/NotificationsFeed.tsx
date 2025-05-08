import {
  useHistory,
  useReadHistory,
  useSubscribe,
} from '@dialectlabs/react-sdk';
import { PropsWithChildren, useEffect } from 'react';
import { NoNotifications } from './NoNotifications';
import { NotificationsList } from './NotificationsList';
import { NotificationsLoading } from './NotificationsLoading';

export const NotificationsFeed = ({
  children,
  isEmpty,
  isLoading,
}: PropsWithChildren<{ isLoading: boolean; isEmpty: boolean }>) => {
  if (isLoading) {
    return <NotificationsLoading />;
  }

  if (isEmpty) {
    return <NoNotifications />;
  }

  return children;
};

NotificationsFeed.Container = function NotificationsFeeContainer() {
  const { history, isLoading: isHistoryLoading } = useHistory();

  const { isLoading: isSubscribeLoading } = useSubscribe();
  const { read } = useReadHistory();

  const alertsLength = history?.alerts.length || 0;

  useEffect(() => {
    if (alertsLength > 0) {
      read();
    }
  }, [alertsLength, read]);

  return (
    <NotificationsFeed
      isEmpty={alertsLength === 0}
      isLoading={isHistoryLoading || isSubscribeLoading}
    >
      <NotificationsList.Container alerts={history?.alerts ?? []} />
    </NotificationsFeed>
  );
};
