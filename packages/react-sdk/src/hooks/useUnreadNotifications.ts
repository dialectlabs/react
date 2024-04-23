import type { ThreadSummary } from '@dialectlabs/sdk';
import useSWR, { KeyedMutator } from 'swr';
import { useDialectContext } from '../context';
import { EMPTY_OBJ } from '../utils';
import { CACHE_KEY_THREAD_SUMMARY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseUnreadNotificationsParams {
  refreshInterval?: number;
  revalidateOnMount?: boolean;
  revalidateOnFocus?: boolean;
}

interface UseUnreadMessageValue {
  hasNotificationsThread: boolean;
  unreadCount: number;
  refresh: () => void;
  hasUnreadMessages: boolean;
}

function useUnreadNotifications({
  refreshInterval,
  revalidateOnMount = true,
  revalidateOnFocus = true,
}: UseUnreadNotificationsParams = EMPTY_OBJ): UseUnreadMessageValue {
  const sdk = useDialectSdk(true);
  const { dappAddress } = useDialectContext();

  const { data, mutate } = useSWR<ThreadSummary | undefined | null>(
    CACHE_KEY_THREAD_SUMMARY_FN([dappAddress]),
    () =>
      sdk?.threads.findSummary({
        otherMembers: [dappAddress],
      }),
    {
      refreshInterval,
      refreshWhenOffline: true,
      revalidateOnMount,
      revalidateOnFocus,
    },
  );

  return {
    hasNotificationsThread: data !== null,
    hasUnreadMessages: Boolean(data?.me?.hasUnreadMessages),
    refresh: mutate as KeyedMutator<ThreadSummary | undefined | null>,
    unreadCount: data?.me?.unreadMessagesCount ?? 0,
  };
}

export default useUnreadNotifications;
