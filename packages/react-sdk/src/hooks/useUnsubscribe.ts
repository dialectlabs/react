import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_UNSUBSCRIBE_MUTATION } from './internal/swrCache';
import { SubscriptableChannelType } from './types';
import useDialectSdk from './useDialectSdk';

export default function useUnsubscribe({
  channel = 'IN_APP',
}: { channel?: SubscriptableChannelType | SubscriptableChannelType[] } = {}) {
  const {
    app: { id: appId },
    clientKey,
  } = useDialectContext();
  const sdk = useDialectSdk();

  const { trigger, isMutating, error } = useSWRMutation(
    appId && clientKey ? CACHE_KEY_UNSUBSCRIBE_MUTATION(appId, channel) : null,
    async () => {
      if (!appId || !clientKey) {
        return;
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/unsubscribe`,
        {
          method: 'POST',
          body: JSON.stringify({
            appId,
            channel,
          }),
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<void>;
    },
  );

  return {
    unsubscribe: trigger,
    isLoading: isMutating,
    error,
  };
}
