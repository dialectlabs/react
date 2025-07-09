import useSWR from 'swr';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_CHANNELS } from './internal/swrCache';
import { getAppId } from './internal/utils';
import { ExternalChannelType, SubscriberChannels } from './types';
import useDialectSdk from './useDialectSdk';

export interface UseChannelsOptions {
  appId?: string | boolean;
  type?: ExternalChannelType;
  refreshInterval?: number;
}

export default function useChannels(
  { appId: argAppId = true, type, ...options }: UseChannelsOptions = {
    appId: true,
  },
) {
  const {
    clientKey,
    app: { id: globalAppId },
  } = useDialectContext();
  const sdk = useDialectSdk();

  const appId = getAppId(argAppId, globalAppId);

  const {
    data: channels,
    error,
    isLoading,
    isValidating,
    mutate,
  } = useSWR(
    clientKey ? CACHE_KEY_CHANNELS(appId, type) : null,
    async () => {
      if (!clientKey) {
        throw new Error('Client key not available');
      }

      const requestUrl = new URL(
        `${sdk.config.dialectCloud.v2Url}/v2/channels`,
      );
      if (appId) {
        requestUrl.searchParams.set('appId', appId);
      }

      if (type) {
        requestUrl.searchParams.set('type', type);
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
    isLoading,
    isValidating,
    error,
    refresh: mutate,
  };
}
