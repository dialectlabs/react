import useSWR from 'swr';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_CHANNELS } from './internal/swrCache';
import { SubscriberChannels } from './types';
import useDialectSdk from './useDialectSdk';

export interface UseChannelsValue {
  channels: SubscriberChannels;
  isFetching: boolean;
  error: Error | null;
}

export interface UseChannelsOptions {
  appId?: string | boolean;
  refreshInterval?: number;
}

function getAppId(argAppId: string | boolean, globalAppId?: string | null) {
  if (typeof argAppId === 'string') {
    return argAppId;
  }

  return argAppId ? globalAppId ?? null : null;
}

export default function useChannels(
  { appId = true, ...options }: UseChannelsOptions = { appId: true },
): UseChannelsValue {
  const {
    clientKey,
    app: { id: globalAppId },
  } = useDialectContext();
  const sdk = useDialectSdk();

  const finalAppId = getAppId(appId, globalAppId);

  const {
    data: channels,
    error,
    isLoading,
  } = useSWR(
    clientKey ? CACHE_KEY_CHANNELS(finalAppId) : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const requestUrl = new URL(
        `${sdk.config.dialectCloud.v2Url}/v2/channels`,
      );
      if (finalAppId) {
        requestUrl.searchParams.set('appId', finalAppId);
      }

      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: await getRequestHeaders(sdk, clientKey),
      });

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<SubscriberChannels>;
    },
    {
      refreshInterval: options.refreshInterval,
    },
  );

  return {
    channels: channels || {},
    isFetching: isLoading,
    error,
  };
}
