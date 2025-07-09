import useSWR from 'swr';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_TOPICS } from './internal/swrCache';
import { getAppId } from './internal/utils';
import { Topic } from './types';
import useDialectSdk from './useDialectSdk';

export interface GetTopicsResponse {
  byApp: {
    [appId: string]: {
      items: Topic[];
    };
  };
}

export interface UseTopicsOptions {
  appId?: string | boolean;
}

export interface UseTopicsValue {
  topics: Topic[];
  allTopics?: GetTopicsResponse['byApp'];
  isLoading: boolean;
  isValidating: boolean;
  refresh: () => Promise<GetTopicsResponse | void>;
  error: Error | null;
}

export default function useTopics(
  { appId: argAppId = true }: UseTopicsOptions = { appId: true },
): UseTopicsValue {
  const { app, clientKey } = useDialectContext();
  const sdk = useDialectSdk();
  const appId = getAppId(argAppId, app?.id);

  const { data, error, isLoading, isValidating, mutate } = useSWR(
    clientKey ? CACHE_KEY_TOPICS() : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const url = new URL(`${sdk.config.dialectCloud.v2Url}/v2/topics`);
      if (appId) {
        url.searchParams.set('appId', appId);
      }

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: await getRequestHeaders(sdk, clientKey),
      });

      if (!response.ok) {
        throw await response.json();
      }
      return response.json() as Promise<GetTopicsResponse>;
    },
  );

  return {
    topics: appId ? data?.byApp[appId]?.items || [] : [],
    allTopics: !appId ? data?.byApp ?? {} : undefined,
    refresh: mutate,
    isLoading,
    isValidating,
    error,
  };
}

export const optimisticTopicUpdateFn =
  (topicId: string, subscribed: boolean, appId?: string | null) =>
  (current?: GetTopicsResponse): GetTopicsResponse => {
    if (!current || !appId) {
      return { byApp: {} };
    }

    const appTopics = current.byApp[appId]?.items;

    if (!appTopics) {
      return {
        byApp: {
          [appId]: {
            items: [],
          },
        },
      };
    }

    return {
      byApp: {
        [appId]: {
          items: appTopics.map((t) =>
            t.id === topicId ? { ...t, subscribed: subscribed } : t,
          ),
        },
      },
    };
  };
