import { useSubscribe, useUnreadSummary } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import React, { memo, useEffect, useMemo } from 'react';
import { ChannelType, ThemeType } from '../../types';
import { Header } from '../core';
import WalletStatesWrapper from '../core/wallet-state/WalletStatesWrapper';
import { ClassTokens } from '../theme';
import { NotificationsFeedScreen } from './NotificationsFeed';
import { SettingsScreen } from './Settings';
import { ExternalPropsProvider } from './internal/ExternalPropsProvider';
import { Route, Router } from './internal/Router';

const DEFAULT_CHANNELS: ChannelType[] = ['telegram', 'email'];

export interface NotificationsProps {
  channels?: ChannelType[];
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
  theme?: ThemeType;
  renderAdditionalSettingsUi?: (args: Record<string, never>) => React.ReactNode;
}

// separate component before routes, but after wallet states have been passed
const SubscribeExecutor = ({ children }: { children: React.ReactNode }) => {
  const { subscribe } = useSubscribe();
  const { refresh, summary, isLoading } = useUnreadSummary({
    revalidateOnMount: false,
    revalidateOnFocus: false,
  });

  useEffect(() => {
    if (summary?.subscribed || isLoading) {
      return;
    }

    subscribe().then(() => {
      // could lead to minor race conditions, potentially revisit
      if (!summary?.subscribed) {
        refresh();
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [summary?.subscribed, isLoading]);

  return children;
};

export const NotificationsBase = ({
  channels = DEFAULT_CHANNELS,
  open,
  setOpen,
  theme,
  renderAdditionalSettingsUi,
}: NotificationsProps) => {
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
          <SubscribeExecutor>
            <Router initialRoute={Route.Notifications}>
              {(route) => (
                <>
                  {route === Route.Settings && (
                    <SettingsScreen
                      renderAdditionalSettingsUi={renderAdditionalSettingsUi}
                    />
                  )}
                  {route === Route.Notifications && <NotificationsFeedScreen />}
                </>
              )}
            </Router>
          </SubscribeExecutor>
        </WalletStatesWrapper>
      </div>
    </ExternalPropsProvider>
  );
};

export const Notifications = memo(function Notifications(
  props: NotificationsProps,
) {
  return (
    <div className="dialect" data-theme={props.theme}>
      <NotificationsBase {...props} />
    </div>
  );
});
