import { ThreadMessage } from '@dialectlabs/react-sdk';
import { createContext, useContext } from 'react';

// TODO: update to ThreadMessages, once `id` is returned
export interface NotificationsItemsProviderValue {
  list: ThreadMessage['id'][]; // list of ids, for order
  map: Record<ThreadMessage['id'], ThreadMessage>;
}

export const NotificationsItemsContext =
  createContext<NotificationsItemsProviderValue>({ list: [], map: {} });

export const useNotification = (id: ThreadMessage['id']) => {
  const items = useContext(NotificationsItemsContext);

  return items.map[id];
};
