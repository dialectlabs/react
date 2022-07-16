import type { DappAddress, DialectSdkError } from '@dialectlabs/sdk';
import { useEffect } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { DAPP_ADDRESSES_CACHE_KEY_FN } from './internal/swrCache';
import useDapp from './useDapp';

interface UseDappAddressesValue {
  addresses: DappAddress[];
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappAddressesParams {
  refreshInterval?: number;
}

function useDappAddresses({
  refreshInterval,
}: UseDappAddressesParams = EMPTY_OBJ): UseDappAddressesValue {
  const { dapp } = useDapp();
  const dappAddressesApi = dapp?.dappAddresses;

  const {
    data: addresses,
    error = null,
    mutate,
  } = useSWR(
    DAPP_ADDRESSES_CACHE_KEY_FN(dapp),
    dappAddressesApi ? () => dappAddressesApi.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  useEffect(
    function invalidateAddresses() {
      mutate();
    },
    [mutate, dappAddressesApi]
  );

  return {
    addresses: addresses || EMPTY_ARR,
    isFetching: Boolean(dapp) && !error && addresses === undefined,
    errorFetching: error,
  };
}

export default useDappAddresses;
