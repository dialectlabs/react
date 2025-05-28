import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_SUBSCRIBE_MUTATION } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

export default function useSubscribe() {
  const {
    app: { id: appId },
    clientKey,
  } = useDialectContext();
  const sdk = useDialectSdk();

  const { trigger, isMutating, error } = useSWRMutation(
    appId && clientKey ? CACHE_KEY_SUBSCRIBE_MUTATION(appId) : null,
    async () => {
      if (!appId || !clientKey) {
        return;
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/subscribe`,
        {
          method: 'POST',
          body: JSON.stringify({
            appId,
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
    subscribe: trigger,
    isLoading: isMutating,
    error,
  };
}
