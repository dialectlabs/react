import {
  AccountAddress,
  AddressType,
  ThreadMessage,
  useNotificationChannelDappSubscription,
  useNotificationSubscriptions,
  useThread,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
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
  renderAdditional?: () => ReactNode;
};

export type RemoteNotificationExtension = {
  humanReadableId: string;
  renderAdditional?: (state: boolean) => ReactNode;
};

interface NotificationsProps {
  dappAddress: AccountAddress;
  onModalClose: () => void;
  notifications?: NotificationType[];
  remoteNotificationExtensions?: RemoteNotificationExtension[];
  channels?: Channel[];
  onBackClick?: () => void;
  gatedView?: string | JSX.Element;
  pollingInterval?: number;
  settingsOnly?: boolean;
  showCloseButton?: boolean;
  renderNotificationMessage?: (
    message: ThreadMessage,
    index?: number
  ) => JSX.Element;
}

const ADDRESS_TYPE = AddressType.Wallet;

function InnerNotifications({
  dappAddress,
  onModalClose,
  onBackClick,
  channels,
  notifications,
  showCloseButton,
  settingsOnly,
  pollingInterval,
  remoteNotificationExtensions,
  renderNotificationMessage,
}: NotificationsProps): JSX.Element {
  const { thread, isFetchingThread } = useThread({
    findParams: { otherMembers: [dappAddress] },
  });

  const [isInitialRoutePicked, setInitialRoutePicked] = useState(false);

  const subscription = useNotificationChannelDappSubscription({
    addressType: ADDRESS_TYPE,
    dappAddress,
  });

  const { isFetching: isFetchingNotificationsSubscriptions } =
    useNotificationSubscriptions({ dappAddress });

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
    <React.Fragment>
      <Header
        threadId={thread?.id}
        isWeb3Enabled={isWeb3Enabled}
        isReady={!isLoading}
        onModalClose={onModalClose}
        onBackClick={onBackClick}
        settingsOnly={settingsOnly}
        showCloseButton={showCloseButton}
      />
      <div
        className={clsx(
          'dt-h-full dt-overflow-y-auto dt-overflow-scroll-contain',
          scrollbar
        )}
      >
        {isInitialRoutePicked ? (
          <>
            <Route name={RouteName.Settings}>
              <Settings
                dappAddress={dappAddress}
                channels={channels || []}
                notifications={notifications}
                remoteNotificationExtensions={remoteNotificationExtensions}
              />
            </Route>
            <Route name={RouteName.Thread}>
              <NotificationsList
                refreshInterval={pollingInterval}
                renderNotificationMessage={renderNotificationMessage}
              />
            </Route>
          </>
        ) : (
          <LoadingThread />
        )}
      </div>
    </React.Fragment>
  );
}

export default function Notifications({
  gatedView,
  ...props
}: NotificationsProps) {
  const { dappAddress } = props;
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
                <ThreadEncyprionWrapper otherMemberAddress={dappAddress}>
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
