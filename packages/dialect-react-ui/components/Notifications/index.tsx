import {
  AddressType,
  useDialectDapp,
  useNotificationChannelDappSubscription,
  useNotificationSubscriptions,
  useThread,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import LoadingThread from '../../entities/LoadingThread';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import ThreadEncyprionWrapper from '../../entities/wrappers/ThreadEncryptionWrapper';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import GatedWrapper from '../common/GatedWrapper';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
import { RouteName } from './constants';
import Header from './Header';
import NotificationsList from './screens/NotificationsList';
import Settings from './screens/Settings';

export type NotificationType = {
  name: string;
  detail?: string;
};

interface NotificationsProps {
  onModalClose: () => void;
  notifications?: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
  gatedView?: string | JSX.Element;
  pollingInterval?: number;
  settingsOnly?: boolean;
}

const addressType = AddressType.Wallet;

function InnerNotifications({
  onModalClose,
  onBackClick,
  channels,
  notifications,
  settingsOnly,
  pollingInterval,
}: NotificationsProps): JSX.Element {
  const { dappAddress } = useDialectDapp();
  if (!dappAddress) {
    throw new Error('dapp address should be provided for notifications');
  }
  const { thread, isFetchingThread } = useThread({
    findParams: { otherMembers: [dappAddress] },
  });

  const [isInitialRoutePicked, setInitialRoutePicked] = useState(false);

  const subscription = useNotificationChannelDappSubscription({
    addressType,
  });

  const { isFetching: isFetchingNotificationsSubscriptions } =
    useNotificationSubscriptions();

  const { scrollbar } = useTheme();
  const { navigate } = useRoute();

  const showThread = useCallback(() => {
    if (!thread) {
      return;
    }
    navigate(RouteName.Thread, {
      params: {
        threadId: thread.id,
      },
    });
  }, [navigate, thread]);

  const showSettings = useCallback(() => {
    navigate(RouteName.Settings);
  }, [navigate]);

  const isLoading =
    subscription.isFetchingSubscriptions ||
    isFetchingThread ||
    isFetchingNotificationsSubscriptions;

  const isWeb3Enabled = subscription.enabled && Boolean(thread);

  useEffect(
    function pickInitialRoute() {
      if (isInitialRoutePicked) {
        return;
      }

      if (isLoading) {
        return;
      }

      const shouldShowSettings = settingsOnly || !isWeb3Enabled;

      if (shouldShowSettings) {
        showSettings();
        setInitialRoutePicked(true);
        return;
      }

      showThread();
      setInitialRoutePicked(true);
    },
    [
      isInitialRoutePicked,
      isLoading,
      isWeb3Enabled,
      settingsOnly,
      showSettings,
      showThread,
    ]
  );

  return (
    <div className="dt-h-full">
      <Header
        threadId={thread?.id}
        isWeb3Enabled={isWeb3Enabled}
        isReady={!isLoading}
        onModalClose={onModalClose}
        onBackClick={onBackClick}
        settingsOnly={settingsOnly}
      />
      <div
        className={clsx(
          'dt-h-full dt-overflow-y-auto dt-px-4 dt-pb-[3.5rem]',
          scrollbar
        )}
      >
        {isInitialRoutePicked ? (
          <>
            <Route name={RouteName.Settings}>
              <Settings
                channels={channels || []}
                notifications={notifications}
              />
            </Route>
            <Route name={RouteName.Thread}>
              <NotificationsList refreshInterval={pollingInterval} />
            </Route>
          </>
        ) : (
          <LoadingThread />
        )}
      </div>
    </div>
  );
}

export default function Notifications({
  gatedView,
  ...props
}: NotificationsProps) {
  const { dappAddress } = useDialectDapp();
  const { colors, modal } = useTheme();

  const fallbackHeader = (
    <Header
      isReady={false}
      isWeb3Enabled={false}
      onBackClick={props.onBackClick}
      onModalClose={props.onModalClose}
    />
  );

  return (
    <div className="dialect dt-h-full">
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.textPrimary,
          colors.bg,
          modal
        )}
      >
        <Router>
          <WalletStatesWrapper header={fallbackHeader}>
            <ConnectionWrapper
              header={fallbackHeader}
              pollingInterval={props.pollingInterval}
            >
              <GatedWrapper gatedView={gatedView}>
                <ThreadEncyprionWrapper otherMemberPK={dappAddress}>
                  <InnerNotifications {...props} />
                </ThreadEncyprionWrapper>
              </GatedWrapper>
            </ConnectionWrapper>
          </WalletStatesWrapper>
        </Router>
      </div>
    </div>
  );
}
