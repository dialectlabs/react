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

const useNotificationThreadMessages = (
  { refreshInterval }: UseNotificationThreadMessagesParams = {
    refreshInterval: 10000,
  },
) => {
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

  return {
    messages: messages ?? [],
    isMessagesLoading: isLoading || isThreadLoading,
    errorLoadingMessages: error,
    refreshMessages: mutate,
    markAsRead,
  };
};

export default useNotificationThreadMessages;
