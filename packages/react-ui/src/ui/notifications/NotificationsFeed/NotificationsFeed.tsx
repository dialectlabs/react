import {
  useHistory,
  useReadHistory,
  useSubscribe,
} from '@dialectlabs/react-sdk';
import { PropsWithChildren, useEffect } from 'react';
import { ErrorNotifications } from './ErrorNotifications';
import { NoNotifications } from './NoNotifications';
import { NotificationsList } from './NotificationsList';
import { NotificationsLoading } from './NotificationsLoading';

export const NotificationsFeed = ({
  children,
  isEmpty,
  isLoading,
  isError,
}: PropsWithChildren<{
  isLoading: boolean;
  isEmpty: boolean;
  isError: boolean;
}>) => {
  if (isLoading) {
    return <NotificationsLoading />;
  }

  if (isError) {
    return <ErrorNotifications />;
  }

  if (isEmpty) {
    return <NoNotifications />;
  }

  return children;
};

NotificationsFeed.Container = function NotificationsFeeContainer() {
  const {
    history,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useHistory();

  const { isLoading: isSubscribeLoading, error: subscribeError } =
    useSubscribe();
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
      isError={!!subscribeError || !!historyError}
      isLoading={isHistoryLoading || isSubscribeLoading}
    >
      <NotificationsList.Container alerts={history?.alerts ?? []} />
    </NotificationsFeed>
  );
};
