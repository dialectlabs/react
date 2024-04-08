import { createContext, useContext } from 'react';
import { Message } from './types';

export interface NotificationsItemsProviderValue {
  list: Message['id'][]; // list of ids, for order
  map: Record<Message['id'], Message>;
}

export const NotificationsItemsContext =
  createContext<NotificationsItemsProviderValue>({ list: [], map: {} });

export const useNotification = (id: Message['id']) => {
  const items = useContext(NotificationsItemsContext);

  return items.map[id];
};
