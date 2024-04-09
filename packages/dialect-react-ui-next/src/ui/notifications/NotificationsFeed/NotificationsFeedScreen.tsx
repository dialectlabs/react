import { NotificationsFeed } from './NotificationsFeed';
import { NotificationsFeedHeaderContainer } from './NotificationsFeedHeaderContainer';

export const NotificationsFeedScreen = () => {
  return (
    <div className="dt-flex dt-flex-col">
      <NotificationsFeedHeaderContainer />
      <NotificationsFeed.Container />
    </div>
  );
};
