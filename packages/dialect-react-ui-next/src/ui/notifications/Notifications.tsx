import Header from './Header';
import { NotificationsFeed } from './NotificationsFeed';

export const Notifications = () => {
  return (
    <div className="dt-flex dt-flex-col dt-overflow-hidden dt-rounded-xl dt-border dt-border-[--dt-stroke-primary]">
      <Header />
      {/*<Settings />*/}
      <NotificationsFeed />
    </div>
  );
};
