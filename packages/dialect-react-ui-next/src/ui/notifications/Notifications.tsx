import WalletStatesWrapper from '../core/wallet-state/WalletStatesWrapper';
import { NotificationsFeedScreen } from './NotificationsFeed';
import { Route, Router } from './Router';
import { SettingsScreen } from './Settings';

export const Notifications = () => {
  return (
    <div className="dt-flex dt-min-h-[600px] dt-w-[420px] dt-flex-col dt-overflow-hidden dt-rounded-xl dt-border dt-border-[--dt-stroke-primary]">
      <WalletStatesWrapper>
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
