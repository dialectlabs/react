import { useDialectConnectionInfo, useThreads } from '@dialectlabs/react-sdk';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend
type ConnectionValue = {
  isSomeBackendConnected: boolean;
};
interface ConnectionWrapperProps {
  header?: JSX.Element | null;
  pollingInterval?: number;
  children?: JSX.Element | ((val: ConnectionValue) => JSX.Element | null);
}

// FIXME: trigger some hook to check connection

const DEFAULT_CONNECTIVITY_POLLING_INTERVAL = 5000;

export default function ConnectionWrapper({
  header,
  // fallback to a separate value, since this is more about the connection, rather than fetching functionality
  // potentially can be a separate setting completely, TBD.
  pollingInterval = DEFAULT_CONNECTIVITY_POLLING_INTERVAL,
  children,
}: ConnectionWrapperProps): JSX.Element {
  // TODO: take into account offline
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

  // FIXME: trigger some fetch from some of backends to get connection state
  useThreads({
    refreshInterval: pollingInterval,
  });

  const isSomeBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  if (typeof children === 'function') {
    return children({ isSomeBackendConnected });
  }

  if (!isSomeBackendConnected) {
    return (
      <>
        {header}
        <NoConnectionError />
      </>
    );
  }

  return <>{children}</>;
}
