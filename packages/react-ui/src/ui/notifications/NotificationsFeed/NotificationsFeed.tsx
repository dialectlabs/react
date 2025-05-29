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

  const notifications = history?.alerts ?? [];
  const notificationsCount = notifications.length;

  const isLoading = isHistoryLoading || isSubscribeLoading;
  const hasError = !!subscribeError || !!historyError;
  const isEmpty = notificationsCount === 0;

  useEffect(() => {
    if (notificationsCount > 0) {
      read();
    }
  }, [notificationsCount, read]);

  return (
    <NotificationsFeed
      isEmpty={isEmpty}
      isError={hasError}
      isLoading={isLoading}
    >
      <NotificationsList.Container alerts={notifications} />
    </NotificationsFeed>
  );
};
