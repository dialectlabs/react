import type { DialectSdkError } from '@dialectlabs/sdk';
import { useEffect } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { DAPP_ADDRESSES_CACHE_KEY_FN } from './internal/swrCache';
import useDapp from './useDapp';

interface UseDappAddressesValue {
  notifications: DappNotificationConfig[];
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappAddressesParams {
  refreshInterval?: number;
}

function useNotificationsConfigs({
  refreshInterval,
}: UseDappAddressesParams = EMPTY_OBJ): UseDappAddressesValue {
  const { dapp } = useDapp();
  const configsApi = dapp?.dappNotificationSubscriptionConfigs;

  const {
    data: configs,
    error = null,
    mutate,
  } = useSWR(
    DAPP_ADDRESSES_CACHE_KEY_FN(dapp),
    configsApi ? () => configsApi.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  useEffect(
    function invalidateConfigs() {
      mutate();
    },
    [mutate]
  );

  // TODO: upsert

  return {
    notifications: configs || EMPTY_ARR,
    isFetching: Boolean(dapp) && !error && configs === undefined,
    errorFetching: error,
  };
}

export default useNotificationsConfigs;
