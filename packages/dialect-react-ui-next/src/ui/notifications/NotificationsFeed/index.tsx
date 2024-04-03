import { NotificationMessage } from './NotificationMessage';

export const NotificationsFeed = () => {
  const messages = [
    {
      id: 1,
      text: 'hahaha',
      timestamp: new Date(),
      metadata: { title: 'Title' },
    },
    {
      id: 2,
      text: 'hahaha',
      timestamp: new Date(),
      metadata: { title: 'Title' },
    },
    {
      id: 3,
      text: 'hahaha',
      timestamp: new Date(),
      metadata: { title: 'Title' },
    },
  ];
  return (
    <div className="dt-flex dt-flex-col">
      {messages.map((it) => (
        <NotificationMessage
          key={it.id}
          text={it.text}
          timestamp={it.timestamp}
        />
      ))}
    </div>
  );
};
