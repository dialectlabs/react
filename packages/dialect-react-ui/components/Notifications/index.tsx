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
}

const addressType = AddressType.Wallet;

function InnerNotifications(props: NotificationsProps): JSX.Element {
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
    () => navigate(RouteName.Settings);
  }, [navigate]);

  const isLoading =
    subscription.isFetchingSubscriptions ||
    isFetchingThread ||
    isFetchingNotificationsSubscriptions;

  useEffect(
    function pickInitialRoute() {
      if (isInitialRoutePicked) {
        return;
      }

      if (isLoading) {
        return;
      }

      const shouldShowSettings = !subscription.enabled || !thread;

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
      showSettings,
      showThread,
      subscription,
      thread,
    ]
  );

  return (
    <>
      {!isInitialRoutePicked ? (
        <LoadingThread />
      ) : (
        <div className={clsx('dt-h-full dt-overflow-y-auto dt-p-9', scrollbar)}>
          <Header
            isWeb3Enabled={subscription.enabled}
            isReady={!isLoading}
            onModalClose={props.onModalClose}
            onBackClick={props.onBackClick}
          />
          <Route name={RouteName.Settings}>
            <Settings
              channels={props.channels || []}
              notifications={props?.notifications}
            />
          </Route>
          <Route name={RouteName.Thread}>
            <NotificationsList />
          </Route>
        </div>
      )}
    </>
  );
}

export default function Notifications({
  gatedView,
  ...props
}: NotificationsProps) {
  const { dappAddress } = useDialectDapp();
  const { colors, modal } = useTheme();

  return (
    <div className="dialect dt-h-full">
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <Router initialRoute={RouteName.Settings}>
          <WalletStatesWrapper>
            <ConnectionWrapper>
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
