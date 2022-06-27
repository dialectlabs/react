import {
  useDialectCloudApi,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectSdk,
  useDialectWallet,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useCallback, useEffect, useState } from 'react';
import EncryptionInfo from '../Chat/screens/EncryptionInfo';
import Error from '../Chat/screens/Error';
import SignMessageInfo from '../Chat/screens/SignMessageInfo';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
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
  const {
    info: { apiAvailability },
  } = useDialectSdk();
  const { dappAddress } = useDialectDapp();
  const { isCreatingThread } = useThreads();
  const { thread, isDeletingThread, isFetchingThread } = useThread({
    findParams: { otherMembers: dappAddress ? [dappAddress] : [] },
  });

  const isDialectAvailable = Boolean(thread);

  const cannotDecryptDialect =
    !apiAvailability.canEncrypt && thread?.encryptionEnabled;

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

  const {
    isSigning,
    isEncrypting,
    connected: isWalletConnected,
  } = useDialectWallet();

  const {
    addresses: { wallet: walletObj },
  } = useDialectCloudApi();

  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const isWeb3Enabled = walletObj
    ? Boolean(walletObj?.enabled)
    : isDialectAvailable;

  const toggleSettings = useCallback(
    () => setSettingsOpen(!isSettingsOpen),
    [isSettingsOpen, setSettingsOpen]
  );

  const { colors, modal, scrollbar } = useTheme();

  const { navigate } = useRoute();

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
      return <Error type="NoWallet" />;
    }
    if (!someBackendConnected) {
      return <Error type="NoConnection" />;
    }
  };

  useEffect(
    function pickRoute() {
      const shouldShowSettings =
        isSettingsOpen ||
        !isWeb3Enabled ||
        isCreatingThread ||
        isDeletingThread;

      if (isSigning) {
        navigate(RouteName.SigningRequest);
      } else if (isEncrypting) {
        navigate(RouteName.SigningRequest);
      } else if (cannotDecryptDialect) {
        navigate(RouteName.CantDecrypt);
      } else if (shouldShowSettings) {
        navigate(RouteName.Settings);
      } else if (thread) {
        navigate(RouteName.Thread, {
          params: {
            threadId: thread.id,
          },
        });
      }
    },
    [
      navigate,
      someBackendConnected,
      isSigning,
      isEncrypting,
      isSettingsOpen,
      isWeb3Enabled,
      isFetchingThread,
      isCreatingThread,
      isDeletingThread,
      cannotDecryptDialect,
      thread,
    ]
  );

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
        <Header
          isWeb3Enabled={isWeb3Enabled}
          isReady={isDialectAvailable || Boolean(walletObj?.enabled)}
          isSettingsOpen={isSettingsOpen}
          onModalClose={props.onModalClose}
          toggleSettings={toggleSettings}
          onBackClick={props.onBackClick}
        />
        <div className={clsx('dt-h-full dt-overflow-y-auto', scrollbar)}>
          {hasError ? (
            renderError()
          ) : (
            <>
              {/* <Route name={RouteName.CantDecrypt}>
                <Error type="CantDecrypt" /> // I guess this should never happen?
              </Route> */}
              <Route name={RouteName.SigningRequest}>
                <SignMessageInfo />
              </Route>
              <Route name={RouteName.EncryptionRequest}>
                <EncryptionInfo />
              </Route>
              <Route name={RouteName.Settings}>
                <Settings
                  toggleSettings={() => {
                    toggleSettings();
                  }}
                  notifications={props.notifications || []}
                  channels={props.channels || []}
                />
              </Route>
              <Route name={RouteName.Thread}>
                <NotificationsList />
              </Route>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Notifications(props: NotificationsProps) {
  return (
    <Router initialRoute={RouteName.Main}>
      <InnerNotifications {...props} />
    </Router>
  );
}
