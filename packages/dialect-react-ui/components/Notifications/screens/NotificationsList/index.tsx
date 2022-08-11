import { ThreadId, useThreadMessages } from '@dialectlabs/react-sdk';
import React, { useEffect } from 'react';
import { Divider } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import NoNotifications from './NoNotifications';
import { Notification } from './Notification';

interface NotificationsListProps {
  refreshInterval?: number;
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

const NotificationsList = ({ refreshInterval }: NotificationsListProps) => {
  const { notificationsDivider } = useTheme();

  const {
    params: { threadId },
  } = useRoute<{ threadId: ThreadId }>();

  const { messages, setLastReadMessageTime } = useThreadMessages({
    id: threadId,
    refreshInterval,
  });

  useEffect(
    function markAsRead() {
      setLastReadMessageTime(new Date());
    },
    [setLastReadMessageTime]
  );

  if (!messages.length) {
    return <NoNotifications />;
  }

  return (
    <div className="dt-py-4">
      {messages.map((message, idx) => (
        <React.Fragment key={idx}>
          <Notification
            message={message.text}
            timestamp={message.timestamp.getTime()}
          />
          <Divider className={notificationsDivider} />
        </React.Fragment>
      ))}
    </div>
  );
};

export default NotificationsListWrapper;
