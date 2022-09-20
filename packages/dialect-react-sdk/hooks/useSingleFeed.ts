import type { DappMessage, FindDappMessageQuery } from '@dialectlabs/sdk';
import useSWR from 'swr';
import { EMPTY_ARR } from '../utils';
import { SINGLE_FEED_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseSingleFeedParams {
  nonVerifiedDapps?: boolean;
  take?: number;
  skip?: number;
  pollingInterval?: number;
}

interface UseSingleFeedValue {
  data: DappMessage[];
  isLoading: boolean;
}

const useSingleFeed = ({
  nonVerifiedDapps = false,
  take = 25,
  skip = 0,
  pollingInterval,
}: UseSingleFeedParams = {}): UseSingleFeedValue => {
  const sdk = useDialectSdk();

  const query: FindDappMessageQuery = {
    dappVerified: !nonVerifiedDapps,
    take,
    skip,
  };

  const { data, error } = useSWR(
    SINGLE_FEED_CACHE_KEY_FN(query),
    () => sdk.wallet.messages.findAllFromDapps(query),
    { refreshInterval: pollingInterval }
  );

  const isLoading = !data && !error;

  return {
    data: data || EMPTY_ARR,
    isLoading,
  };
};

export default useSingleFeed;
