import Header from './Header';
import { Settings } from './Settings';

export const Notifications = () => {
  return (
    <div className="dt-flex dt-w-[420px] dt-flex-col dt-overflow-hidden dt-rounded-xl dt-border dt-border-[--dt-stroke-primary]">
      <Header />
      <Settings />
      {/*<NotificationsFeed />*/}
    </div>
  );
};
