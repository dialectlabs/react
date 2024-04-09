import { Header } from '../../core';
import { Route, useRouter } from '../Router';

export const NotificationsFeedHeaderContainer = () => {
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications"
      showBackButton={false}
      showSettingsButton={true}
      showCloseButton={true}
      onSettingsClick={() => setRoute(Route.Settings)}
    />
  );
};
