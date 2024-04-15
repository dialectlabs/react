import { Header } from '../../core';
import { useExternalProps } from '../internal/ExternalPropsProvider';
import { Route, useRouter } from '../internal/Router';

export const NotificationsFeedHeader = () => {
  const { setOpen } = useExternalProps();
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications"
      showBackButton={false}
      showSettingsButton={true}
      showCloseButton={!!setOpen}
      onSettingsClick={() => setRoute(Route.Settings)}
      onCloseClick={() => setOpen?.(false)}
    />
  );
};
