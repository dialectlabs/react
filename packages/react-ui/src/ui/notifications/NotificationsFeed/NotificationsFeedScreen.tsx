import { NotificationsFeed } from './NotificationsFeed';
import { NotificationsFeedHeader } from './NotificationsFeedHeader';

export const NotificationsFeedScreen = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-col">
      <NotificationsFeedHeader />
      <section className="dt-h-full dt-overflow-y-scroll">
        <NotificationsFeed.Container />
      </section>
    </div>
  );
};
