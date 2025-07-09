import useSWR from 'swr';
import { useDialectContext } from '../context';
import { EMPTY_OBJ } from '../utils';
import { CACHE_KEY_HISTORY_SUMMARY } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseUnreadSummaryParams {
  refreshInterval?: number;
  revalidateOnMount?: boolean;
  revalidateOnFocus?: boolean;
}

export interface UnreadSummary {
  subscribed: boolean;
  unreadCount: number;
  lastRead?: {
    timestamp: string;
  };
}

export default function useUnreadSummary({
  refreshInterval,
  revalidateOnMount = true,
  revalidateOnFocus = true,
}: UseUnreadSummaryParams = EMPTY_OBJ) {
  const sdk = useDialectSdk(true);
  const {
    app: { id: appId },
  } = useDialectContext();
  const forAddress = sdk?.wallet.address;

  const { data, isLoading, isValidating, error, mutate } =
    useSWR<UnreadSummary>(
      appId && forAddress ? CACHE_KEY_HISTORY_SUMMARY(forAddress, appId) : null,
      async () => {
        if (!appId || !forAddress || !sdk) {
          return;
        }

        const url = new URL(
          `${sdk.config.dialectCloud.v2Url}/v2/internal/history/summary`,
        );
        url.searchParams.set('appId', appId);
        url.searchParams.set('walletAddress', forAddress);

        const response = await fetch(url, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw await response.json();
        }

        return response.json();
      },
      { refreshInterval, revalidateOnFocus, revalidateOnMount },
    );

  return {
    summary: data,
    error,
    refresh: mutate,
    isLoading,
    isValidating,
  };
}
