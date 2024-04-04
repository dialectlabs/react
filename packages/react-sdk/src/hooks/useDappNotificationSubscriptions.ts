import type {
  DappNotificationSubscription,
  DialectSdkError,
} from '@dialectlabs/sdk';
import useSWR from 'swr';
import { DAPP_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN } from '../internal/swrCache';
import { EMPTY_ARR, EMPTY_OBJ } from '../internal/utils';
import useDapp from './useDapp';

interface UseDappNotificationSubscriptionsValue {
  subscriptions: DappNotificationSubscription[];
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappNotificationSubscriptions {
  refreshInterval?: number;
}

export function useDappNotificationSubscriptions({
  refreshInterval,
}: UseDappNotificationSubscriptions = EMPTY_OBJ): UseDappNotificationSubscriptionsValue {
  const { dapp } = useDapp();
  const subscriptionsApi = dapp?.notificationSubscriptions;

  const { data: subscriptions, error: errorFetching = null } = useSWR(
    DAPP_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN(dapp?.address),
    subscriptionsApi ? () => subscriptionsApi.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    },
  );

  return {
    subscriptions: subscriptions || EMPTY_ARR,
    isFetching: Boolean(dapp) && !errorFetching && subscriptions === undefined,
    errorFetching,
  };
}
