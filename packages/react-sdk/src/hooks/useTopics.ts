import useSWR from 'swr';
import { useDialectContext } from '../context';
import useDialectSdk from './useDialectSdk';
import { getAppId } from './internal/utils';
import { Topic } from './types';
import { getRequestHeaders } from './internal/api-v2-helpers';

export interface GetTopicsResponse {
  byApp: {
    [appId: string]: {
      items: Topic[];
    }
  }
}

export interface UseTopicsOptions {
  appId?: string | boolean;
}

export interface UseTopicsValue {
  topics: Topic[];
  allTopics?: {
    [appId: string]: {
      items: Topic[];
    }
  };
  isLoading: boolean;
  error: Error | null;
}

export default function useTopics({ appId: argAppId = true }: UseTopicsOptions = { appId: true }): UseTopicsValue {
  const { app, clientKey } = useDialectContext();
  const sdk = useDialectSdk();
  const appId = getAppId(argAppId, app?.id);

  const { data, error, isLoading } = useSWR(
    clientKey ? ['TOPICS', appId] : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const url = new URL(`${sdk.config.dialectCloud.v2Url}/v2/topics`);
      if (appId) {
        url.searchParams.set('appId', appId);
      }

      const response = await fetch(url.toString(), { method: 'GET', headers: await getRequestHeaders(sdk, clientKey) });

      if (!response.ok) {
        throw await response.json();
      }
      return response.json() as Promise<GetTopicsResponse>;
    },
  );

  return {
    topics: appId ? data?.byApp[appId]?.items || [] : [],
    allTopics: !appId ? data?.byApp ?? {} : undefined,
    isLoading,
    error,
  };
} 