import useDialectSdk from './useDialectSdk';
import useSWR from 'swr';
import { CACHE_KEY_THREADS_SUMMARY } from './internal/swrCache';

interface UseGlobalUnreadMessagesParams {
  refreshInterval?: number;
}

interface UseGlobalUnreadMessageValue {
  unreadCount: number;
}

const useGlobalUnreadMessages = ({
  refreshInterval,
}: UseGlobalUnreadMessagesParams): UseGlobalUnreadMessageValue => {
  const sdk = useDialectSdk(true);
  const { data } = useSWR(
    CACHE_KEY_THREADS_SUMMARY,
    () => sdk?.threads.findSummaryAll(),
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  return { unreadCount: data?.unreadMessagesCount ?? 0 };
};

export default useGlobalUnreadMessages;
