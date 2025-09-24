import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_READ_MUTATION } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

export default function useClearHistory() {
  const {
    clientKey,
    app: { id: appId },
  } = useDialectContext();
  const sdk = useDialectSdk();

  const { trigger, isMutating, error } = useSWRMutation(
    appId && clientKey ? CACHE_KEY_READ_MUTATION(appId) : null,
    async () => {
      if (!appId || !clientKey) {
        return;
      }

      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/history/clear`,
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
    clear: trigger,
    isLoading: isMutating,
    error,
  };
}
