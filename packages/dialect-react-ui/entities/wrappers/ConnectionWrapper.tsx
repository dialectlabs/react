import { useDialectConnectionInfo, useThreads } from '@dialectlabs/react-sdk';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend

interface ConnectionWrapperProps {
  children?: React.ReactNode;
}

// FIXME: trigger some hook to check connection

export default function ConnectionWrapper({
  children,
}: ConnectionWrapperProps): JSX.Element {
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

  const { threads, errorFetchingThreads } = useThreads({
    // refreshInterval: 10000,
  });

  console.log({ threads, errorFetchingThreads });

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  console.log({
    isSolanaShouldConnect,
    isDialectCloudShouldConnect,
    isSolanaConnected,
    isDialectCloudConnected,
  });

  if (!someBackendConnected) {
    return <NoConnectionError />;
  }

  return <>{children}</>;
}
