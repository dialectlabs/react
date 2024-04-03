import { Message, NotificationMessage } from './NotificationMessage';

export const NotificationsList = ({ messages }: { messages: Message[] }) => {
  return (
    <div className="dt-flex dt-flex-col">
      {messages.map((it) => (
        <NotificationMessage key={it.id} {...it} />
      ))}
    </div>
  );
};
