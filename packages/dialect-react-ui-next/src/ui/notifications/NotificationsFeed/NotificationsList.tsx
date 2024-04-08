import { useMemo } from 'react';
import { NotificationMessage } from './NotificationMessage';
import {
  NotificationsItemsContext,
  NotificationsItemsProviderValue,
} from './context';
import { Message } from './types';

export const NotificationsList = ({ messages }: { messages: Message[] }) => {
  const context: NotificationsItemsProviderValue = useMemo(() => {
    return {
      list: messages.map((it) => it.id),
      map: Object.fromEntries(messages.map((it) => [it.id, it])),
    };
  }, [messages]);

  return (
    <div className="dt-flex dt-flex-col">
      <NotificationsItemsContext.Provider value={context}>
        {messages.map((it) => (
          <NotificationMessage.Container key={it.id} id={it.id} />
        ))}
      </NotificationsItemsContext.Provider>
    </div>
  );
};
