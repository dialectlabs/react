import Header from './Header';
import { Settings } from './Settings';

export const Notifications = () => {
  return (
    <div className="dt-flex dt-flex-col dt-rounded-xl dt-overflow-hidden">
      <Header />
      <Settings />
    </div>
  );
};
