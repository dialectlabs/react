import {
  DialectSdkError,
  UpsertNotificationSubscriptionCommand,
  WalletNotificationSubscription,
} from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';
import useDialectDapp from './useDialectDapp';

interface UseNotificationSubscriptionsValue {
  subscriptions: WalletNotificationSubscription[];

  update(params: UpdateNotificationSubscriptionCommand): Promise<void>;

  isFetching: boolean;
  errorFetching: DialectSdkError | null;
  isUpdating: boolean;
  errorUpdating: DialectSdkError | null;
}

type UpdateNotificationSubscriptionCommand =
  UpsertNotificationSubscriptionCommand;

interface UseUseNotificationSubscriptions {
  refreshInterval?: number;
}

function useNotificationSubscriptions({
  refreshInterval,
}: UseUseNotificationSubscriptions = EMPTY_OBJ): UseNotificationSubscriptionsValue {
  const { dappAddress: dappPublicKey } = useDialectDapp();
  const { wallet: walletsApi } = useDialectSdk();
  const subscriptionsApi = walletsApi.notificationSubscriptions;

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorUpdating, setErrorUpdating] = useState<DialectSdkError | null>(
    null
  );

  const {
    data: subscriptions,
    error: errorFetching = null,
    isValidating: isFetching,
    mutate,
  } = useSWR(
    WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN(walletsApi),
    subscriptionsApi && dappPublicKey
      ? () => {
          return subscriptionsApi.findAll({
            dappPublicKey,
          });
        }
      : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  const update = useCallback(
    async (command: UpsertNotificationSubscriptionCommand) => {
      setIsUpdating(true);
      setErrorUpdating(null);
      try {
        await subscriptionsApi.upsert(command);
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorUpdating(e);
        }
        throw e;
      } finally {
        setIsUpdating(false);
      }
      mutate();
    },
    [mutate, subscriptionsApi]
  );

  return {
    subscriptions: subscriptions || EMPTY_ARR,
    update,
    isFetching,
    errorFetching,
    isUpdating,
    errorUpdating,
  };
}

export default useNotificationSubscriptions;
