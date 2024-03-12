import {
  ThreadId,
  ThreadMessage,
  useThreadMessages,
} from '@dialectlabs/react-sdk';
import React, { useEffect } from 'react';
import { Divider } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import NoNotifications from '../../../../entities/notifications/NoNotifications';
import { Notification } from '../../../../entities/notifications/Notification';

interface NotificationsListProps {
  refreshInterval?: number;
  renderNotificationMessage?: (
    message: ThreadMessage,
    index?: number
  ) => JSX.Element;
}

const NotificationsListWrapper = (props: NotificationsListProps) => {
  const {
    params: { threadId },
  } = useRoute<{ threadId: ThreadId }>();

  if (!threadId) {
    return null;
  }

  return <NotificationsList {...props} />;
};

const NotificationsList = ({
  refreshInterval,
  renderNotificationMessage,
}: NotificationsListProps) => {
  const { notificationsDivider, notificationsListWrapper } = useTheme();

  const {
    params: { threadId },
  } = useRoute<{ threadId: ThreadId }>();

  const { messages, markAsRead } = useThreadMessages({
    id: threadId,
    refreshInterval,
  });

  useEffect(() => {
    markAsRead();
  }, [markAsRead]);

  if (!messages.length) {
    return <NoNotifications />;
  }

  return (
    <div className={notificationsListWrapper}>
      {messages.map((message, idx) =>
        renderNotificationMessage ? (
          <React.Fragment key={idx}>
            {renderNotificationMessage(message, idx)}
          </React.Fragment>
        ) : (
          <React.Fragment key={idx}>
            <Notification
              message={message.text}
              timestamp={message.timestamp.getTime()}
            />
            <Divider className={notificationsDivider} />
          </React.Fragment>
        )
      )}
    </div>
  );
};

export default NotificationsListWrapper;
