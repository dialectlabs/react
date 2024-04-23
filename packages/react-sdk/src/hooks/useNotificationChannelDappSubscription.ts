import type { AccountAddress, Address, AddressType } from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR } from '../utils';
import { WALLET_DAPP_ADDRESSES_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';
import useNotificationChannel from './useNotificationChannel';

interface UseNotificationChannelDappSubscriptionParams {
  addressType: AddressType;
  dappAddress: AccountAddress;
}

interface ToggleSubscriptionParams {
  enabled: boolean;
  address?: Address | null; // This is hack for telegram use case until it got refactored on backend
}

interface UseNotificationChannelDappSubscriptionValue {
  enabled: boolean;
  isToggling: boolean;
  isFetchingSubscriptions: boolean;
  toggleSubscription: (params: ToggleSubscriptionParams) => Promise<void>;
}

const useNotificationChannelDappSubscription = ({
  dappAddress,
  addressType,
}: UseNotificationChannelDappSubscriptionParams): UseNotificationChannelDappSubscriptionValue => {
  const { wallet: walletsApi } = useDialectSdk();
  const { globalAddress } = useNotificationChannel({ addressType });

  const [isToggling, setIsToggling] = useState(false);

  const {
    data: dappSubscriptions = EMPTY_ARR,
    error: errorFetchingDappAddresses = null,
    mutate: mutateDappAddresses,
  } = useSWR(
    WALLET_DAPP_ADDRESSES_CACHE_KEY_FN(walletsApi.address, dappAddress),
    () =>
      walletsApi.dappAddresses.findAll({
        dappAccountAddress: dappAddress,
      }),
  );

  const currentSubscription = globalAddress
    ? dappSubscriptions.find((it) => it.address.id === globalAddress.id)
    : null;

  const toggleSubscription = useCallback(
    async ({ enabled, address = globalAddress }: ToggleSubscriptionParams) => {
      if (!address || !dappAddress || isToggling) {
        return;
      }
      setIsToggling(true);
      try {
        await mutateDappAddresses(
          async () => {
            if (currentSubscription) {
              const updatedSub = await walletsApi.dappAddresses.update({
                dappAddressId: currentSubscription.id,
                enabled,
              });
              return dappSubscriptions.map((it) =>
                it.id === updatedSub.id ? updatedSub : it,
              );
            } else {
              const newSub = await walletsApi.dappAddresses.create({
                addressId: address.id,
                dappAccountAddress: dappAddress,
                enabled,
              });
              return [...dappSubscriptions, newSub];
            }
          },
          {
            optimisticData: dappSubscriptions.find(
              (it) => it.id === currentSubscription?.id,
            )
              ? dappSubscriptions.map((it) =>
                  it.id === currentSubscription?.id ? { ...it, enabled } : it,
                )
              : [
                  ...dappSubscriptions,
                  {
                    id: 'optimistic-dapp-subscription',
                    enabled,
                    address: address,
                    dappId: dappAddress,
                  },
                ],
            rollbackOnError: true,
          },
        );
      } finally {
        setIsToggling(false);
      }
    },
    [
      currentSubscription,
      dappAddress,
      dappSubscriptions,
      globalAddress,
      isToggling,
      mutateDappAddresses,
      walletsApi.dappAddresses,
    ],
  );

  const isFetchingSubscriptions =
    !errorFetchingDappAddresses && !dappSubscriptions;

  return {
    enabled: currentSubscription?.enabled || false,
    isToggling,
    isFetchingSubscriptions,
    toggleSubscription,
  };
};

export default useNotificationChannelDappSubscription;
