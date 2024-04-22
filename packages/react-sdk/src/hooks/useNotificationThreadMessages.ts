import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { ThreadMessage } from '../../../../../sdk/packages/sdk';
import {
  CACHE_KEY_MESSAGES_FN,
  CACHE_KEY_THREAD_SUMMARY_FN,
} from './internal/swrCache';
import useNotificationThread from './useNotificationThread';

interface UseNotificationThreadMessagesParams {
  refreshInterval?: number;
}

const DEFAULT_INTERVAL = 10000;
const FASTER_INTERVAL = 3000;

const hasRunningAction = (message: ThreadMessage): boolean => {
  if (!message.metadata?.smartMessage?.content.state) {
    return false;
  }

  // TODO: get actual state enum from sdk
  return ['READY_FOR_EXECUTION', 'EXECUTING'].includes(
    message.metadata.smartMessage.content.state,
  );
};

const useNotificationThreadMessages = (
  {
    refreshInterval: initialRefreshInterval = DEFAULT_INTERVAL,
  }: UseNotificationThreadMessagesParams = {
    refreshInterval: DEFAULT_INTERVAL,
  },
) => {
  const [refreshInterval, setRefreshInterval] = useState<number>(
    initialRefreshInterval,
  );
  const { thread, isThreadLoading } = useNotificationThread();

  const {
    data: messages,
    isLoading,
    error,
    mutate,
  } = useSWR(
    thread ? CACHE_KEY_MESSAGES_FN(thread.id.toString()) : null,
    () => thread?.messages() ?? [],
    {
      refreshInterval,
    },
  );

  const { trigger: markAsRead } = useSWRMutation(
    thread
      ? CACHE_KEY_THREAD_SUMMARY_FN(
          thread.otherMembers.map((member) => member.address),
        )
      : null,
    async () => {
      if (!thread) {
        return;
      }

      await thread.markAsRead();
    },
  );

  useEffect(() => {
    if (!messages) {
      return;
    }

    let executingAction = false;
    for (const message of messages) {
      if (hasRunningAction(message)) {
        executingAction = true;
        break;
      }
    }

    setRefreshInterval(executingAction ? FASTER_INTERVAL : DEFAULT_INTERVAL);
  }, [messages]);

  return {
    messages: messages ?? [],
    isMessagesLoading: isLoading || isThreadLoading,
    errorLoadingMessages: error,
    refreshMessages: mutate,
    markAsRead,
  };
};

export default useNotificationThreadMessages;
