import {
  AddressType,
  useAddresses,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectWallet,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useEffect } from 'react';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import LoadingThread from '../../entities/LoadingThread';

import usePrevious from '../../hooks/usePrevious';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
import WalletStatesWrapper from '../common/WalletStatesWrapper';
import { RouteName } from './constants';
import Header from './Header';
import NotificationsList from './screens/NotificationsList';
import Settings from './screens/Settings';

export type NotificationType = {
  name: string;
  detail: string;
};

interface NotificationsProps {
  onModalClose: () => void;
  notifications?: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
}

function InnerNotifications(props: NotificationsProps): JSX.Element {
  const { isCreatingThread } = useThreads();
  const { dappAddress } = useDialectDapp();
  const { thread, isDeletingThread, isFetchingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });
  const { adapter: wallet } = useDialectWallet();

  const {
    addresses: { WALLET: walletAddress },
    isFetching: isFetchingAddresses,
    create: createAddress,
    delete: deleteAddress,
    isCreatingAddress,
    isDeletingAddress,
  } = useAddresses();

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
    () =>
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
          type: AddressType.Wallet,
          value: wallet.publicKey?.toBase58(),
        });
      } else if (!thread && walletAddress) {
        // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
        deleteAddress({ type: AddressType.Wallet });
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
      if (thread?.id && prevThread?.id?.equals(thread?.id)) {
        // Skip setting initial route if the thread isn't changed
        return;
      }

      const shouldShowSettings =
        !isWeb3Enabled ||
        isCreatingThread ||
        isFetchingThread ||
        isDeletingThread;

      if (shouldShowSettings) {
        showSettings();
        return;
      }

      if (!thread) {
        return;
      }

      showThread();
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
    ]
  );

  return (
    <>
      {isFetchingThread || isFetchingAddresses ? (
        <LoadingThread />
      ) : (
        <>
          <Header
            isWeb3Enabled={isWeb3Enabled}
            isReady={!isFetchingAddresses && !isFetchingThread}
            onModalClose={props.onModalClose}
            onBackClick={props.onBackClick}
          />
          <div className={clsx('dt-h-full dt-overflow-y-auto', scrollbar)}>
            <Route name={RouteName.Settings}>
              <Settings
                notifications={props.notifications || []}
                channels={props.channels || []}
              />
            </Route>
            <Route name={RouteName.Thread}>
              <NotificationsList />
            </Route>
          </div>
        </>
      )}
    </>
  );
}

export default function Notifications(props: NotificationsProps) {
  const { colors, modal } = useTheme();

  const { connected: isWalletConnected } = useDialectWallet();

  const {
    connected: {
      solana: {
        connected: isSolanaConnected,
        shouldConnect: isSolanaShouldConnect,
      },
      dialectCloud: {
        connected: isDialectCloudConnected,
        shouldConnect: isDialectCloudShouldConnect,
      },
    },
  } = useDialectConnectionInfo();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  const hasError = !isWalletConnected || !someBackendConnected;

  // we should render errors immediatly right after error appears
  // that's why useEffect is not suitable to handle logic
  const renderError = () => {
    if (!hasError) {
      return null;
    }
    if (!isWalletConnected) {
      return <NoWalletError />;
    }
    if (!someBackendConnected) {
      return <NoConnectionError />;
    }
  };

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
          {hasError ? (
            renderError()
          ) : (
            <WalletStatesWrapper>
              <InnerNotifications {...props} />
            </WalletStatesWrapper>
          )}
        </Router>
      </div>
    </div>
  );
}
