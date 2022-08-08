import { useDialectConnectionInfo } from '@dialectlabs/react-sdk';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend

interface ConnectionWrapperProps {
  header: JSX.Element | null;
  children?: React.ReactNode;
}

// FIXME: trigger some hook to check connection

export default function ConnectionWrapper({
  header,
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

  // FIXME: trigger some fetch from some of backends to get connection state
  // const { threads, errorFetchingThreads } = useThreads();

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
    return (
      <>
        {header}
        <NoConnectionError />
      </>
    );
  }

  return <>{children}</>;
}
