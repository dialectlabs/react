import {
  useDialectConnectionInfo,
  useDialectSdk,
} from '@dialectlabs/react-sdk';
import useSWR from 'swr';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend
type ConnectionValue = {
  errorMessage: string;
  isConnected: boolean;
  isLoading: boolean;
};
interface ConnectionWrapperProps {
  header?: JSX.Element | null;
  pollingInterval?: number;
  children?: JSX.Element | ((val: ConnectionValue) => JSX.Element | null);
}

// FIXME: trigger some hook to check connection

interface UseDialectHealthProps {
  baseUrl: string;
  pollingInterval: number;
}

interface UseDialectHealthValue {
  isOK: boolean;
  isLoading: boolean;
  error?: string;
}

// TODO: fix type
const fetcher = (...args: any[]) => fetch(...args).then((res) => res.json());

const useDialectHealth = ({
  baseUrl,
  pollingInterval,
}: UseDialectHealthProps): UseDialectHealthValue => {
  const { data, error } = useSWR(`${baseUrl}/api/v1/health`, fetcher, {
    refreshInterval: pollingInterval,
    revalidateOnReconnect: true,
    refreshWhenHidden: true,
  });

  const isLoading = data === undefined && !error;

  return {
    isLoading,
    error: error?.message,
    isOK: data?.status === 'ok' && !error,
  };
};

const DEFAULT_CONNECTIVITY_POLLING_INTERVAL = 5000;

export default function ConnectionWrapper({
  header,
  // fallback to a separate value, since this is more about the connection, rather than fetching functionality
  // potentially can be a separate setting completely, TBD.
  pollingInterval = DEFAULT_CONNECTIVITY_POLLING_INTERVAL,
  children,
}: ConnectionWrapperProps): JSX.Element | null {
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

  const {
    info: {
      config: {
        dialectCloud: { url: baseUrl },
      },
    },
  } = useDialectSdk();

  const { isOK, error, isLoading } = useDialectHealth({
    baseUrl,
    pollingInterval,
  });

  const isSomeBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  const isConnected = isSomeBackendConnected && isOK;

  const connectingTo = [
    isDialectCloudShouldConnect &&
      (!isDialectCloudConnected || !isOK) &&
      'Dialect Cloud',
    isSolanaShouldConnect && !isSomeBackendConnected && 'Solana',
  ]
    .filter(Boolean)
    .join(' and ');

  const errorMessage = `Error connecting to ${connectingTo}`;

  if (typeof children === 'function') {
    return children({
      errorMessage: error ? errorMessage : '',
      isConnected,
      isLoading,
    });
  }

  if (!isConnected && !isLoading) {
    return (
      <>
        {header}
        <NoConnectionError message={errorMessage} />
      </>
    );
  }

  return <>{children}</>;
}
