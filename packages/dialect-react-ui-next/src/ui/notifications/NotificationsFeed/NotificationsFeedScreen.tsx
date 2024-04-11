import { NotificationsFeed } from './NotificationsFeed';
import { NotificationsFeedHeaderContainer } from './NotificationsFeedHeaderContainer';

export const NotificationsFeedScreen = () => {
  return (
    <div className="dt-flex dt-h-full dt-flex-col">
      <NotificationsFeedHeaderContainer />
      <section className="dt-h-full dt-overflow-y-scroll">
        <NotificationsFeed.Container />
      </section>
    </div>
  );
};
