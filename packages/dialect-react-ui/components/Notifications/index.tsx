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
import CantDecryptError from '../../entities/errors/ui/CantDecryptError';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
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

  const { isSigning, isEncrypting } = useDialectWallet();

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

  const { scrollbar } = useTheme();

  const { navigate } = useRoute();

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
      isSigning,
      isEncrypting,
      isSettingsOpen,
      isWeb3Enabled,
      isFetchingThread,
      isCreatingThread,
      isDeletingThread,
      thread,
      cannotDecryptDialect,
    ]
  );

  return (
    <>
      <Header
        isWeb3Enabled={isWeb3Enabled}
        isReady={isDialectAvailable || Boolean(walletObj?.enabled)}
        isSettingsOpen={isSettingsOpen}
        onModalClose={props.onModalClose}
        toggleSettings={toggleSettings}
        onBackClick={props.onBackClick}
      />
      <div className={clsx('dt-h-full dt-overflow-y-auto', scrollbar)}>
        <Route name={RouteName.CantDecrypt}>
          <CantDecryptError />
        </Route>
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
      </div>
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
        <Router initialRoute={RouteName.Main}>
          {hasError ? renderError() : <InnerNotifications {...props} />}
        </Router>
      </div>
    </div>
  );
}
