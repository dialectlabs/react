import { Header } from '../../core';
import { useExternalProps } from '../internal/ExternalPropsProvider';
import { Route, useRouter } from '../internal/Router';

export const SettingsHeader = () => {
  const { setOpen } = useExternalProps();
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications Settings"
      showBackButton={true}
      showSettingsButton={false}
      showCloseButton={!!setOpen}
      onBackClick={() => setRoute(Route.Notifications)}
      onCloseClick={() => setOpen?.(false)}
    />
  );
};
