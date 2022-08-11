import type { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import { CACHE_KEY_THREAD_SUMMARY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseUnreadMessagesParams {
  otherMembers: PublicKey[];
  refreshInterval?: number;
}

interface UseUnreadMessagesValue {
  hasUnreadMessages: boolean;
}

const useUnreadMessages = ({
  otherMembers,
  refreshInterval,
}: UseUnreadMessagesParams): UseUnreadMessagesValue => {
  const sdk = useDialectSdk(true);
  const { data } = useSWR(
    CACHE_KEY_THREAD_SUMMARY_FN(otherMembers),
    () =>
      sdk?.threads.findSummary({
        otherMembers: otherMembers,
      }),
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  return {
    hasUnreadMessages: data?.me?.hasUnreadMessages || false,
  };
};

export default useUnreadMessages;
