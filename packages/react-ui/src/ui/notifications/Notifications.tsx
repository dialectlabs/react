import clsx from 'clsx';
import { useMemo } from 'react';
import { ChannelType, ThemeType } from '../../types';
import { Header } from '../core';
import WalletStatesWrapper from '../core/wallet-state/WalletStatesWrapper';
import { ClassTokens } from '../theme';
import { NotificationsFeedScreen } from './NotificationsFeed';
import { SettingsScreen } from './Settings';
import { ExternalPropsProvider } from './internal/ExternalPropsProvider';
import { Route, Router } from './internal/Router';

const DEFAULT_CHANNELS: ChannelType[] = ['wallet', 'telegram', 'email'];

export interface NotificationsProps {
  channels?: ChannelType[];
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  theme?: ThemeType;
}

export const NotificationsBase = (
  { channels = DEFAULT_CHANNELS, open, setOpen, theme }: NotificationsProps = {
    channels: DEFAULT_CHANNELS,
  },
) => {
  const normalizedExtProps = useMemo(
    () => ({
      open,
      setOpen,
      theme,
      channels: Array.from(new Set(channels)),
    }),
    [open, setOpen, theme, channels],
  );

  return (
    <ExternalPropsProvider props={normalizedExtProps}>
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
              showCloseButton={!!setOpen}
              onCloseClick={() => setOpen?.(false)}
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
    </ExternalPropsProvider>
  );
};

export const Notifications = (props: NotificationsProps) => {
  return (
    <div className="dialect" data-theme={props.theme}>
      <NotificationsBase {...props} />
    </div>
  );
};
