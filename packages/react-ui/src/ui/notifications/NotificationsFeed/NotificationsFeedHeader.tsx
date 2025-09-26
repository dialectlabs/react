import { useClearHistory, useHistory } from '@dialectlabs/react-sdk';
import { Header } from '../../core';
import { useExternalProps } from '../internal/ExternalPropsProvider';
import { Route, useRouter } from '../internal/Router';

export const NotificationsFeedHeader = () => {
  const { setOpen } = useExternalProps();
  const { setRoute } = useRouter();
  const { clear } = useClearHistory();
  const { refresh } = useHistory();

  return (
    <Header
      title="Notifications"
      showBackButton={false}
      showSettingsButton={true}
      showCloseButton={!!setOpen}
      showClearNotificationsButton={true}
      onSettingsClick={() => setRoute(Route.Settings)}
      onCloseClick={() => setOpen?.(false)}
      onClearNotificationsClick={() => {
        clear().then(() => refresh());
      }}
    />
  );
};
