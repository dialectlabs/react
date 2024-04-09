import { Header } from '../../core';
import { useModalState } from '../internal/ModalStateProvider';
import { Route, useRouter } from '../internal/Router';

export const NotificationsFeedHeaderContainer = () => {
  const modelState = useModalState();
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications"
      showBackButton={false}
      showSettingsButton={true}
      showCloseButton={!!modelState}
      onSettingsClick={() => setRoute(Route.Settings)}
      onCloseClick={() => modelState?.setOpen(false)}
    />
  );
};
