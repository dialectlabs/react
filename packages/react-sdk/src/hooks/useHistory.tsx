import useSWR from 'swr';
import { useDialectContext } from '../context';
import { EMPTY_OBJ } from '../utils';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_HISTORY } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

export interface Topic {
  id: string;
  name: string;
  slug: string;
}

// todo: replace with sdk types
export interface ActionElement {
  type: 'link';
  label: string;
  url: string;
}

export interface App {
  id: string;
  name: string;
  icon?: string;
}

export interface HistoricalAlert {
  id: string;
  timestamp: string;
  title: string;
  body: string;
  image?: string;
  actions?: ActionElement[];
  topic?: Topic;
  app?: App;
}

export interface History {
  alerts: Array<HistoricalAlert>;
  summary: {
    unreadCount: number;
    lastRead?: {
      timestamp: string;
    };
  };
  limit: number;
  cursor?: string;
}

interface UseHistoryParams {
  refreshInterval?: number;
}

const DEFAULT_INTERVAL = 10000;

export default function useHistory({
  refreshInterval = DEFAULT_INTERVAL,
}: UseHistoryParams = EMPTY_OBJ) {
  const {
    clientKey,
    app: { id: appId },
  } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    data: history,
    isLoading,
    error,
    mutate,
  } = useSWR(
    appId && clientKey ? CACHE_KEY_HISTORY(appId) : null,
    async () => {
      if (!appId || !clientKey) {
        return;
      }

      const url = new URL(`${sdk.config.dialectCloud.v2Url}/v2/history`);
      url.searchParams.set('appId', appId);

      const response = await fetch(url, {
        method: 'GET',
        headers: await getRequestHeaders(sdk, clientKey),
      });

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<History>;
    },
    {
      refreshInterval,
    },
  );

  return {
    history,
    error,
    isLoading,
    refresh: mutate,
  };
}
