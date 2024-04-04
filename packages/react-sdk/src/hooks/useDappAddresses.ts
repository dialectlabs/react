import type { DappAddress, DialectSdkError } from '@dialectlabs/sdk';
import { useEffect } from 'react';
import useSWR from 'swr';
import { DAPP_ADDRESSES_CACHE_KEY_FN } from '../internal/swrCache';
import { EMPTY_ARR, EMPTY_OBJ } from '../internal/utils';
import useDapp from './useDapp';

interface UseDappAddressesValue {
  addresses: DappAddress[];
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappAddressesParams {
  refreshInterval?: number;
}

export function useDappAddresses({
  refreshInterval,
}: UseDappAddressesParams = EMPTY_OBJ): UseDappAddressesValue {
  const { dapp } = useDapp();
  const dappAddressesApi = dapp?.dappAddresses;

  const {
    data: addresses,
    error = null,
    mutate,
  } = useSWR(
    DAPP_ADDRESSES_CACHE_KEY_FN(dapp?.address),
    dappAddressesApi ? () => dappAddressesApi.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    },
  );

  useEffect(
    function invalidateAddresses() {
      mutate();
    },
    [mutate, dappAddressesApi],
  );

  return {
    addresses: addresses || EMPTY_ARR,
    isFetching: Boolean(dapp) && !error && addresses === undefined,
    errorFetching: error,
  };
}
