import { Header } from '../../core';
import { useModalState } from '../ModalStateProvider';
import { Route, useRouter } from '../Router';

export const SettingsHeader = () => {
  const modelState = useModalState();
  const { setRoute } = useRouter();

  return (
    <Header
      title="Notifications Settings"
      showBackButton={true}
      showSettingsButton={false}
      showCloseButton={!!modelState}
      onBackClick={() => setRoute(Route.Notifications)}
      onCloseClick={() => modelState?.setOpen(false)}
    />
  );
};
