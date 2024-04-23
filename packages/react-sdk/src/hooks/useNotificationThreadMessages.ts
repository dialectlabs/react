import { SmartMessageStateDto, ThreadMessage } from '@dialectlabs/sdk';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
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

  return [
    SmartMessageStateDto.ReadyForExecution,
    SmartMessageStateDto.Executing,
  ].includes(message.metadata.smartMessage.content.state);
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

    setRefreshInterval(
      executingAction ? FASTER_INTERVAL : initialRefreshInterval,
    );
  }, [messages, initialRefreshInterval]);

  return {
    messages: messages ?? [],
    isMessagesLoading: isLoading || isThreadLoading,
    errorLoadingMessages: error,
    refreshMessages: mutate,
    markAsRead,
  };
};

export default useNotificationThreadMessages;
