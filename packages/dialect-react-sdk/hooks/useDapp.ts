import type { Dapp, DialectSdkError, ReadOnlyDapp } from '@dialectlabs/sdk';
import { useMemo } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { DAPPS_CACHE_KEY, DAPP_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseDappValue {
  dapp: Dapp | null;
  isFetching: boolean;
  errorFetching: DialectSdkError | null;

  dapps: Record<string, ReadOnlyDapp>;
}

interface UseDappParams {
  refreshInterval?: number;
  verified?: boolean;
}

function useDapp({
  refreshInterval,
  verified = true,
}: UseDappParams = EMPTY_OBJ): UseDappValue {
  const { dapps } = useDialectSdk();
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();
  const { data: dapp, error } = useSWR(
    DAPP_CACHE_KEY_FN(walletAddress),
    () => dapps.find(),
    { refreshInterval, refreshWhenOffline: true }
  );

  const { data: dappsList = EMPTY_ARR } = useSWR(
    DAPPS_CACHE_KEY,
    () => dapps.findAll({ verified }),
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  const allDapps = useMemo(
    () =>
      dappsList.reduce((acc, dapp) => {
        const address = dapp.address;
        if (!acc[address]) {
          acc[address] = dapp;
        }
        return acc;
      }, {} as Record<string, ReadOnlyDapp>),
    [dappsList]
  );

  return {
    dapp: dapp || null,
    isFetching: !error && dapp === undefined,
    errorFetching: error,

    dapps: allDapps,
  };
}

export default useDapp;
