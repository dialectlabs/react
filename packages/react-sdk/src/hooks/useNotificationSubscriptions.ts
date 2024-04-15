import {
  AccountAddress,
  DialectSdkError,
  UpsertNotificationSubscriptionCommand,
  WalletNotificationSubscription,
} from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR } from '../utils';
import { WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

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
  dappAddress: AccountAddress;
  refreshInterval?: number;
}

function useNotificationSubscriptions({
  dappAddress,
  refreshInterval,
}: UseUseNotificationSubscriptions): UseNotificationSubscriptionsValue {
  const {
    wallet: { address: walletAddress, notificationSubscriptions },
  } = useDialectSdk();

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorUpdating, setErrorUpdating] = useState<DialectSdkError | null>(
    null,
  );

  const {
    data: subscriptions,
    error: errorFetching = null,
    mutate,
  } = useSWR(
    WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN(walletAddress, dappAddress),
    notificationSubscriptions
      ? () =>
          notificationSubscriptions.findAll({ dappAccountAddress: dappAddress })
      : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    },
  );

  const update = useCallback(
    async (command: UpsertNotificationSubscriptionCommand) => {
      setIsUpdating(true);
      setErrorUpdating(null);
      try {
        await mutate(
          (prev) => {
            if (prev) {
              return prev.map((it) =>
                it.notificationType.id === command.notificationTypeId
                  ? {
                      ...it,
                      subscription: {
                        ...it.subscription,
                        config: command.config,
                      },
                    }
                  : it,
              );
            }
            return prev;
          },
          { revalidate: false }, // optimistic change first
        );

        await notificationSubscriptions.upsert(command);
        await mutate();
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorUpdating(e);
        }
        throw e;
      } finally {
        setIsUpdating(false);
      }
    },
    [mutate, notificationSubscriptions],
  );

  return {
    subscriptions: subscriptions || EMPTY_ARR,
    update,
    isFetching: subscriptions === undefined && !errorFetching,
    errorFetching,
    isUpdating,
    errorUpdating,
  };
}

export default useNotificationSubscriptions;
