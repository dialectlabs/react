import { useDialectSdk } from '@dialectlabs/react-sdk';
import useSWR from 'swr';
import NoConnectionError from '../errors/ui/NoConnectionError';

// Only renders children if connected to successfully some backend
type ConnectionValue = {
  errorMessage?: string;
  isConnected: boolean;
  isLoading: boolean;
};
interface ConnectionWrapperProps {
  header?: JSX.Element | null;
  pollingInterval?: number;
  children?: JSX.Element | ((val: ConnectionValue) => JSX.Element | null);
}

interface UseDialectHealthProps {
  baseUrl: string;
  pollingInterval: number;
}

interface UseDialectHealthValue {
  isOK: boolean;
  isLoading: boolean;
  error?: string;
}

const ERROR_MESSAGE = 'Error connecting to Dialect Cloud';

const fetcher = (...args: Parameters<typeof fetch>) =>
  fetch(...args).then((res) => res.json());

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

const DEFAULT_CONNECTIVITY_POLLING_INTERVAL = 60000;
// TODO, pinging with sdk?
export default function ConnectionWrapper({
  header,
  // fallback to a separate value, since this is more about the connection, rather than fetching functionality
  // potentially can be a separate setting completely, TBD.
  pollingInterval = DEFAULT_CONNECTIVITY_POLLING_INTERVAL,
  children,
}: ConnectionWrapperProps): JSX.Element | null {
  const {
    config: {
      dialectCloud: { url: baseUrl },
    },
  } = useDialectSdk();

  const { isOK, error, isLoading } = useDialectHealth({
    baseUrl,
    pollingInterval,
  });

  const isConnected = isOK;

  if (typeof children === 'function') {
    return children({
      errorMessage: error ? ERROR_MESSAGE : undefined,
      isConnected,
      isLoading,
    });
  }

  if (!isConnected && !isLoading) {
    return (
      <>
        {header}
        <NoConnectionError message={ERROR_MESSAGE} />
      </>
    );
  }

  return <>{children}</>;
}
