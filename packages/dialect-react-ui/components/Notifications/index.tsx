import {
  AddressType,
  useAddresses,
  useDialectDapp,
  useDialectWallet,
  useNotificationSubscriptions,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import LoadingThread from '../../entities/LoadingThread';
import usePrevious from '../../hooks/usePrevious';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import GatedWrapper from '../common/GatedWrapper';
import { RouteName } from './constants';
import Header from './Header';
import NotificationsList from './screens/NotificationsList';
import Settings from './screens/Settings';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import ThreadEncyprionWrapper from '../../entities/wrappers/ThreadEncryptionWrapper';

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
  const { isCreatingThread } = useThreads();
  const { dappAddress } = useDialectDapp();
  const { thread, isDeletingThread, isFetchingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });
  const { adapter: wallet } = useDialectWallet();
  const [isInitialRoutePicked, setInitialRoutePicked] = useState(false);

  const {
    addresses: { WALLET: walletAddress },
    isFetching: isFetchingAddresses,
    create: createAddress,
    delete: deleteAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useAddresses();

  const { isFetching: isFetchingNotificationsSubscriptions } =
    useNotificationSubscriptions();

  const [
    isInitialNotificationSubscriptionsLoaded,
    setInitialNotificationSubscriptionsLoaded,
  ] = useState(false);

  useEffect(() => {
    setInitialNotificationSubscriptionsLoaded(true);
  }, [isFetchingNotificationsSubscriptions]);

  const isWeb3Enabled =
    walletAddress?.enabled ||
    isCreatingThread ||
    isCreatingAddress ||
    isDeletingThread ||
    isDeletingAddress;

  const { scrollbar } = useTheme();
  const { navigate } = useRoute();
  const prevThread = usePrevious(thread);

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

  // Sync state for web3 channel in case of errors
  useEffect(
    function syncState() {
      if (thread && prevThread?.id.equals(thread.id)) {
        return;
      }

      if (
        !wallet?.publicKey ||
        isFetchingAddresses ||
        isFetchingThread ||
        isCreatingThread ||
        isDeletingThread
      )
        return;

      if (thread && !walletAddress) {
        // In case the wallet isn't in web2 db, but the actual thread was created
        createAddress({
          addressType,
          value: wallet.publicKey?.toBase58(),
        });
      } else if (!thread && walletAddress) {
        // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
        deleteAddress({ addressType });
      }
    },
    [
      isFetchingThread,
      thread,
      isCreatingThread,
      isDeletingThread,
      prevThread?.id,
      walletAddress,
      wallet.publicKey,
      isFetchingAddresses,
      createAddress,
      deleteAddress,
    ]
  );

  useEffect(
    function pickInitialRoute() {
      if (isInitialRoutePicked) {
        return;
      }

      if (isFetchingAddresses || isFetchingThread) {
        return;
      }

      const shouldShowSettings =
        !isWeb3Enabled ||
        isCreatingThread ||
        isFetchingThread ||
        isDeletingThread;

      if (shouldShowSettings) {
        showSettings();
        setInitialRoutePicked(true);
        return;
      }

      if (!thread) {
        return;
      }

      showThread();
      setInitialRoutePicked(true);
    },
    [
      navigate,
      isWeb3Enabled,
      isFetchingThread,
      isCreatingThread,
      isDeletingThread,
      thread,
      prevThread?.id,
      showThread,
      showSettings,
      walletAddress?.enabled,
      isFetchingAddresses,
      isInitialRoutePicked,
    ]
  );

  return (
    <>
      {isFetchingThread ||
      isFetchingAddresses ||
      !isInitialNotificationSubscriptionsLoaded ||
      !isInitialRoutePicked ? (
        <LoadingThread />
      ) : (
        <div className={clsx('dt-h-full dt-overflow-y-auto dt-p-9', scrollbar)}>
          <Header
            isWeb3Enabled={isWeb3Enabled}
            isReady={!isFetchingAddresses && !isFetchingThread}
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
