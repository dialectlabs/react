import clsx from 'clsx';
import { Header } from '../core';
import WalletStatesWrapper from '../core/wallet-state/WalletStatesWrapper';
import { ClassTokens } from '../theme';
import { NotificationsFeedScreen } from './NotificationsFeed';
import { SettingsScreen } from './Settings';
import { useModalState } from './internal/ModalStateProvider';
import { Route, Router } from './internal/Router';

export const Notifications = () => {
  const modalState = useModalState();

  return (
    <div
      className={clsx(
        'dt-flex dt-h-full dt-w-full dt-flex-col',
        ClassTokens.Background.Primary,
      )}
    >
      <WalletStatesWrapper
        header={
          <Header
            title="Notifications"
            showBackButton={false}
            showSettingsButton={false}
            showCloseButton={!!modalState}
            onCloseClick={() => modalState?.setOpen(false)}
          />
        }
      >
        <Router initialRoute={Route.Notifications}>
          {(route) => (
            <>
              {route === Route.Settings && <SettingsScreen />}
              {route === Route.Notifications && <NotificationsFeedScreen />}
            </>
          )}
        </Router>
      </WalletStatesWrapper>
    </div>
  );
};
