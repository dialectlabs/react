import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { getRequestHeaders } from './internal/api-v2-helpers';
import { CACHE_KEY_TOPICS } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

export interface ManageTopicRequest {
  topicId: string;
}

export default function useManageTopics() {
  const { clientKey } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    trigger: subscribe,
    isMutating: isSubscribing,
    error: errorSubscribing,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_TOPICS() : null,
    async (_, { arg }: { arg: ManageTopicRequest }) => {
      if (!clientKey) throw new Error('Client key not available');
      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/topics/subscribe`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
          headers: await getRequestHeaders(sdk, clientKey),
        },
      );

      if (!response.ok) {
        throw await response.json();
      }

      return response.json() as Promise<void>;
    },
  );

  const {
    trigger: unsubscribe,
    isMutating: isUnsubscribing,
    error: errorUnsubscribing,
  } = useSWRMutation(
    clientKey ? CACHE_KEY_TOPICS() : null,
    async (_, { arg }: { arg: ManageTopicRequest }) => {
      if (!clientKey) throw new Error('Client key not available');
      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/topics/unsubscribe`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
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
    subscribe,
    unsubscribe,
    isSubscribing,
    isUnsubscribing,
    errorSubscribing,
    errorUnsubscribing,
  };
}
