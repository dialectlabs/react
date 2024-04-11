import useSWR from 'swr';
import { CACHE_KEY_MESSAGES_FN } from './internal/swrCache';
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

  return {
    messages: messages ?? [],
    isMessagesLoading: isLoading || isThreadLoading,
    errorLoadingMessages: error,
    refreshMessages: mutate,
  };
};

export default useNotificationThreadMessages;
