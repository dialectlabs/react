import {
  useDialectCloudApi,
  useDialectConnectionInfo,
  useDialectDapp,
  useDialectSdk,
  useDialectWallet,
  useThread,
  useThreads,
} from '@dialectlabs/react-sdk';
import { useEffect } from 'react';
import cs from '../../utils/classNames';
import Error from '../Chat/screens/Error';
import SignMessageInfo from '../Chat/screens/SignMessageInfo';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import type { Channel } from '../common/types';
import { RouteName } from './constants';
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
      wallet: { connected: isWalletConnected },
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

  const { isSigning } = useDialectWallet();

  const {
    addresses: { wallet: walletObj },
  } = useDialectCloudApi();

  const isWeb3Enabled = walletObj
    ? Boolean(walletObj?.enabled)
    : isDialectAvailable;

  const { colors, modal, scrollbar } = useTheme();

  const { navigate } = useRoute();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  useEffect(
    function pickRoute() {
      const shouldShowSettings =
        !isWeb3Enabled || isCreatingThread || isDeletingThread;

      if (!someBackendConnected) {
        navigate(RouteName.NoConnection);
      } else if (!isWalletConnected) {
        navigate(RouteName.NoWallet);
      } else if (isSigning) {
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
      isSolanaConnected,
      isWalletConnected,
      isSigning,
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
        className={cs(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.primary,
          colors.bg,
          modal
        )}
      >
        <div className={cs('dt-h-full dt-overflow-y-auto', scrollbar)}>
          <Route name={RouteName.NoConnection}>
            <Error type="NoConnection" />
          </Route>
          {/* TODO: add error if off-chain messages enabled but dialectCloud is unreachable */}
          <Route name={RouteName.NoWallet}>
            <Error type="NoWallet" />
          </Route>
          {/* <Route name={RouteName.CantDecrypt}>
            <Error type="CantDecrypt" />
          </Route> */}
          <Route name={RouteName.SigningRequest}>
            <SignMessageInfo />
          </Route>
          <Route name={RouteName.Settings}>
            <Settings
              notifications={props.notifications || []}
              channels={props.channels || []}
              setup={!isWeb3Enabled}
            />
          </Route>
          <Route name={RouteName.Thread}>
            <NotificationsList />
          </Route>
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
