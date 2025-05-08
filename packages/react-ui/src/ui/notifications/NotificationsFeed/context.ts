import { Alert } from '@dialectlabs/react-sdk';
import { createContext, useContext } from 'react';

export interface NotificationsItemsProviderValue {
  list: Alert['id'][]; // list of ids, for order
  map: Record<Alert['id'], Alert>;
}

export const NotificationsItemsContext =
  createContext<NotificationsItemsProviderValue>({ list: [], map: {} });

export const useNotification = (id: Alert['id']) => {
  const items = useContext(NotificationsItemsContext);

  return items.map[id];
};
