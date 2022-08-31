import { useDialectConnectionInfo, useThreads } from '@dialectlabs/react-sdk';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend

type ConnectionValue = {
  isSomeBackendConnected: boolean;
};
interface ConnectionWrapperProps {
  header?: JSX.Element | null;
  children?: JSX.Element | ((val: ConnectionValue) => JSX.Element | null);
}

// FIXME: trigger some hook to check connection

export default function ConnectionWrapper({
  header,
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
  const { errorFetchingThreads } = useThreads({
    refreshInterval: 5000,
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
