import { Alert } from '@dialectlabs/react-sdk';
import { ReactNode, useMemo } from 'react';
import { NotificationMessage } from './NotificationMessage';
import {
  NotificationsItemsContext,
  NotificationsItemsProviderValue,
} from './context';

export const NotificationsList = ({ children }: { children?: ReactNode }) => {
  return <div className="dt-flex dt-flex-col">{children}</div>;
};

NotificationsList.Container = function NotificationListContainer({
  alerts,
}: {
  alerts: Alert[];
}) {
  // potentially move to useSWR, since messages will change on every new fetch
  const context: NotificationsItemsProviderValue = useMemo(() => {
    return {
      list: alerts.map((it) => it.id),
      map: Object.fromEntries(alerts.map((it) => [it.id, it])),
    };
  }, [alerts]);

  return (
    <NotificationsItemsContext.Provider value={context}>
      <NotificationsList>
        {alerts.map((it) => (
          <NotificationMessage.Container key={it.id} id={it.id} />
        ))}
      </NotificationsList>
    </NotificationsItemsContext.Provider>
  );
};
