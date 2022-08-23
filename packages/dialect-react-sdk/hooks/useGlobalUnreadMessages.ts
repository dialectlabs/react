import useDialectSdk from './useDialectSdk';
import useSWR from 'swr';
import { CACHE_KEY_THREADS_SUMMARY } from './internal/swrCache';
import { EMPTY_OBJ } from '../utils';

interface UseGlobalUnreadMessagesParams {
  refreshInterval?: number;
}

interface UseGlobalUnreadMessageValue {
  unreadCount: number;
  refresh: () => void;
}

const useGlobalUnreadMessages = ({
  refreshInterval,
}: UseGlobalUnreadMessagesParams = EMPTY_OBJ): UseGlobalUnreadMessageValue => {
  const sdk = useDialectSdk(true);
  const { data, mutate } = useSWR(
    CACHE_KEY_THREADS_SUMMARY,
    () => sdk?.threads.findSummaryAll(),
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  return { unreadCount: data?.unreadMessagesCount ?? 0, refresh: mutate };
};

export default useGlobalUnreadMessages;
