import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import useDialectSdk from './useDialectSdk';

export interface ManageTopicRequest {
  topicId: string;
}

export interface UseManageTopicsValue {
  subscribe: (params: ManageTopicRequest) => Promise<void>;
  unsubscribe: (params: ManageTopicRequest) => Promise<void>;
  isSubscribing: boolean;
  isUnsubscribing: boolean;
  errorSubscribing: Error | null;
  errorUnsubscribing: Error | null;
}

export default function useManageTopics(): UseManageTopicsValue {
  const { clientKey } = useDialectContext();
  const sdk = useDialectSdk();

  const {
    trigger: subscribe,
    isMutating: isSubscribing,
    error: errorSubscribing,
  } = useSWRMutation(
    clientKey ? ['TOPIC_SUBSCRIBE'] : null,
    async (_, { arg }: { arg: ManageTopicRequest }) => {
      if (!clientKey) throw new Error('Client key not available');
      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/topics/subscribe`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
          headers: {
            'Content-Type': 'application/json',
          },
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
    clientKey ? ['TOPIC_UNSUBSCRIBE'] : null,
    async (_, { arg }: { arg: ManageTopicRequest }) => {
      if (!clientKey) throw new Error('Client key not available');
      const response = await fetch(
        `${sdk.config.dialectCloud.v2Url}/v2/topics/unsubscribe`,
        {
          method: 'POST',
          body: JSON.stringify(arg),
          headers: {
            'Content-Type': 'application/json',
          },
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