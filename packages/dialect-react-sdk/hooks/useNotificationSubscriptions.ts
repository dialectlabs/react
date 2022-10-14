import {
  AccountAddress,
  DialectSdkError,
  UpsertNotificationSubscriptionCommand,
  WalletNotificationSubscription,
} from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN } from './internal/swrCache';
import useDialectDapp from './useDialectDapp';
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
  dappAddress?: AccountAddress;
  refreshInterval?: number;
}

function useNotificationSubscriptions({
  dappAddress: dappAddressOverride,
  refreshInterval,
}: UseUseNotificationSubscriptions = EMPTY_OBJ): UseNotificationSubscriptionsValue {
  const { dappAddress: globalDappAddress } = useDialectDapp(true);
  const dappAddress = dappAddressOverride || globalDappAddress;
  if (!dappAddress) {
    throw new Error('No dapp address provided');
  }

  const {
    wallet: { address: walletAddress, notificationSubscriptions },
  } = useDialectSdk();

  const [isUpdating, setIsUpdating] = useState(false);
  const [errorUpdating, setErrorUpdating] = useState<DialectSdkError | null>(
    null
  );

  const {
    data: subscriptions,
    error: errorFetching = null,
    mutate,
  } = useSWR(
    WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN(walletAddress, dappAddress),
    notificationSubscriptions && dappAddress
      ? () =>
          notificationSubscriptions.findAll({ dappAccountAddress: dappAddress })
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
    [mutate, notificationSubscriptions]
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
