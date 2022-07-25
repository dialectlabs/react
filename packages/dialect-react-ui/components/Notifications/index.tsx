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
import { useCallback, useEffect, useState } from 'react';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import LoadingThread from '../../entities/LoadingThread';
import usePrevious from '../../hooks/usePrevious';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
import WalletStatesWrapper from '../common/WalletStatesWrapper';
import GatedWrapper from '../common/GatedWrapper';
import { RouteName } from './constants';
import Header from './Header';
import NotificationsList from './screens/NotificationsList';
import Settings from './screens/Settings';
import NotAuthorizedError from '../../entities/errors/ui/NotAuthorizedError';
import IconButton from '../IconButton';

export type NotificationType = {
  name: string;
  detail: string;
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
      {isFetchingThread || isFetchingAddresses || !isInitialRoutePicked ? (
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

export default function Notifications({
  gatedView,
  ...props
}: NotificationsProps) {
  const { colors, modal, header, textStyles, icons } = useTheme();

  const {
    connectionInitiated,
    adapter: { connected: isWalletConnected },
  } = useDialectWallet();

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

  // we should render errors immediatly right after error appears
  // that's why useEffect is not suitable to handle logic
  const renderError = () => {
    if (!isWalletConnected) {
      return <NoWalletError />;
    }
    if (!connectionInitiated) {
      return <NotAuthorizedError />;
    }
    if (!someBackendConnected) {
      return <NoConnectionError />;
    }
    return null;
  };

  const renderedError = renderError();

  const hasError = Boolean(renderedError);

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
            <>
              <div
                className={clsx(
                  'dt-flex dt-flex-row dt-items-center dt-justify-end',
                  header
                )}
              >
                <span className={clsx(textStyles.header, colors.accent)}>
                  <IconButton icon={<icons.x />} onClick={props.onModalClose} />
                </span>
              </div>
              {renderedError}
            </>
          ) : (
            <WalletStatesWrapper>
              <GatedWrapper gatedView={gatedView}>
                <InnerNotifications {...props} />
              </GatedWrapper>
            </WalletStatesWrapper>
          )}
        </Router>
      </div>
    </div>
  );
}
