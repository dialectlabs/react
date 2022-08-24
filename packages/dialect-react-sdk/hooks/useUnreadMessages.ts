import type { PublicKey } from '@solana/web3.js';
import useSWR, { KeyedMutator } from 'swr';
import {
  CACHE_KEY_THREAD_SUMMARY_FN,
  CACHE_KEY_THREADS_SUMMARY,
} from './internal/swrCache';
import useDialectSdk from './useDialectSdk';
import type {
  ThreadsGeneralSummary,
  ThreadSummary,
} from '../../../../sdk/packages/sdk';
import { EMPTY_OBJ } from '../utils';

interface BaseUseUnreadMessagesParams {
  refreshInterval?: number;
}
interface PerThreadUseUnreadMessagesParams extends BaseUseUnreadMessagesParams {
  otherMembers: PublicKey[];
}

interface UseUnreadMessageValue {
  unreadCount: number;
  refresh: () => void;
  hasUnreadMessages: boolean;
}

const isParamsExtended = (
  params: BaseUseUnreadMessagesParams | PerThreadUseUnreadMessagesParams
): params is PerThreadUseUnreadMessagesParams =>
  Boolean((params as PerThreadUseUnreadMessagesParams).otherMembers);

const isDataPerThread = (
  data: ThreadSummary | ThreadsGeneralSummary | undefined | null
): data is ThreadSummary => !!(data as ThreadSummary)?.me;

function useUnreadMessages(
  params:
    | BaseUseUnreadMessagesParams
    | PerThreadUseUnreadMessagesParams = EMPTY_OBJ
): UseUnreadMessageValue {
  const { refreshInterval } = params;
  const sdk = useDialectSdk(true);

  const { data, mutate } = useSWR<
    ThreadSummary | ThreadsGeneralSummary | undefined | null
  >(
    isParamsExtended(params)
      ? CACHE_KEY_THREAD_SUMMARY_FN(params.otherMembers)
      : CACHE_KEY_THREADS_SUMMARY,
    () =>
      isParamsExtended(params)
        ? sdk?.threads.findSummary({
            otherMembers: params.otherMembers,
          })
        : sdk?.threads.findSummaryAll(),
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  if (isDataPerThread(data)) {
    return {
      hasUnreadMessages: data.me.hasUnreadMessages,
      refresh: mutate as KeyedMutator<ThreadSummary | undefined | null>,
      unreadCount: data.me.unreadMessagesCount,
    };
  }

  return {
    hasUnreadMessages: !!data?.unreadMessagesCount,
    unreadCount: data?.unreadMessagesCount ?? 0,
    refresh: mutate as KeyedMutator<ThreadsGeneralSummary | undefined | null>,
  };
}

export default useUnreadMessages;
