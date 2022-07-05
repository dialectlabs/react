import type { Dapp, DappAddress, DialectSdkError } from '@dialectlabs/sdk';
import { useEffect } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import useDapp from './useDapp';

const DAPP_ADDRESSES_CACHE_KEY = (dapp: Dapp | null) =>
  'DAPP_ADDRESSES_' + dapp?.publicKey;

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
    data: addresses = EMPTY_ARR,
    error = null,
    mutate,
  } = useSWR(
    DAPP_ADDRESSES_CACHE_KEY(dapp),
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
    addresses,
    isFetching: Boolean(dapp) && !error && addresses == EMPTY_ARR,
    errorFetching: error,
  };
}

export default useDappAddresses;
