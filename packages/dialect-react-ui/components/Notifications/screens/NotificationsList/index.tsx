import { Divider } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { NoNotifications } from '../../../Icon';
import { Notification } from './Notification';

const NotificationsList = (messages) => {
  const { notificationsDivider } = useTheme();

  if (!messages.length) {
    return <NoNotifications />;
  }

  return (
    <div className="dt-px-4 dt-py-4">
      {messages.map((message: any) => (
        <>
          <Notification
            key={message.timestamp}
            message={message.text}
            timestamp={message.timestamp}
          />
          <Divider className={notificationsDivider} />
        </>
      ))}
    </div>
  );
};

export default NotificationsList;
