import { Header } from '../../core';
import { Route, useRouter } from '../Router';

export const SettingsHeader = () => {
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications Settings"
      showBackButton={true}
      showSettingsButton={false}
      showCloseButton={true}
      onBackClick={() => setRoute(Route.Notifications)}
    />
  );
};
