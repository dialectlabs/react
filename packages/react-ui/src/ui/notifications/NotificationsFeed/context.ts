import { HistoricalAlert } from '@dialectlabs/react-sdk';
import { createContext, useContext } from 'react';

export interface NotificationsItemsProviderValue {
  list: HistoricalAlert['id'][]; // list of ids, for order
  map: Record<HistoricalAlert['id'], HistoricalAlert>;
}

export const NotificationsItemsContext =
  createContext<NotificationsItemsProviderValue>({ list: [], map: {} });

export const useNotification = (id: HistoricalAlert['id']) => {
  const items = useContext(NotificationsItemsContext);

  return items.map[id];
};
