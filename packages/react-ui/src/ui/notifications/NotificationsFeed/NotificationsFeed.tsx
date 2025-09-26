import {
  useClearHistory,
  useHistory,
  useReadHistory,
  useSubscribe,
  useUnreadSummary,
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
  const { error: clearError } = useClearHistory();
  const { refresh: refreshSummary } = useUnreadSummary({
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  const notifications = history?.alerts ?? [];
  const notificationsCount = notifications.length;

  const isLoading = isHistoryLoading || isSubscribeLoading;
  const hasError = !!subscribeError || !!historyError || !!clearError;
  const isEmpty = notificationsCount === 0;

  useEffect(() => {
    if (notificationsCount > 0) {
      read().then(() => refreshSummary());
    }
    // ignoring fn deps
    // eslint-disable-next-line
  }, [notificationsCount]);

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
