import React from 'react';
import { ThreadId, useThreadMessages } from '@dialectlabs/react-sdk';
import { Divider } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useRoute } from '../../../common/providers/Router';
import { Header } from '../../../Header';
import { RouteName } from '../../constants';
import NoNotifications from './NoNotifications';
import { Notification } from './Notification';

const NotificationsContent = () => {
  const {
    params: { threadId },
  } = useRoute<{ threadId: ThreadId }>();
  const { notificationsDivider } = useTheme();
  const { messages } = useThreadMessages({ id: threadId });

  if (!messages.length) {
    return <NoNotifications />;
  }

  return (
    <div className="dt-px-4 dt-py-4">
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

const NotificationsList = () => {
  const { navigate } = useRoute<{ threadId: ThreadId }>();
  const { icons } = useTheme();

  return (
    <>
      <Header>
        <Header.Icons containerOnly position="left" />
        <Header.Title>Notifications</Header.Title>
        <Header.Icons>
          <Header.Icons>
            <Header.Icon
              icon={<icons.settings />}
              onClick={() => navigate(RouteName.Settings)}
            />
          </Header.Icons>
        </Header.Icons>
      </Header>
      <NotificationsContent />
    </>
  );
};

export default NotificationsList;
