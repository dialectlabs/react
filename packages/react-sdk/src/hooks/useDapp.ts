import type {
  BlockchainType,
  Dapp,
  DialectSdkError,
  ReadOnlyDapp,
} from '@dialectlabs/sdk';
import { useMemo } from 'react';
import useSWR from 'swr';
import { DAPPS_CACHE_KEY, DAPP_CACHE_KEY_FN } from '../internal/swrCache';
import { EMPTY_ARR, EMPTY_OBJ } from '../internal/utils';
import { useDialectSdk } from './useDialectSdk';

interface UseDappValue {
  dapp: Dapp | null;
  isFetching: boolean;
  errorFetching: DialectSdkError | null;

  dapps: Record<string, ReadOnlyDapp>;
}

interface UseDappParams {
  refreshInterval?: number;
  verified?: boolean;
  blockchainType?: BlockchainType;
}

export function useDapp({
  refreshInterval,
  verified = true,
  blockchainType,
}: UseDappParams = EMPTY_OBJ): UseDappValue {
  const { dapps } = useDialectSdk();
  const {
    wallet: { address: walletAddress },
  } = useDialectSdk();
  const { data: dapp, error } = useSWR(
    DAPP_CACHE_KEY_FN(walletAddress),
    () => dapps.find(),
    { refreshInterval, refreshWhenOffline: true },
  );

  const { data: dappsList = EMPTY_ARR } = useSWR(
    DAPPS_CACHE_KEY,
    () => dapps.findAll({ verified, blockchainType }),
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    },
  );

  const allDapps = useMemo(
    () =>
      dappsList.reduce(
        (acc, dapp) => {
          const address = dapp.address;
          if (!acc[address]) {
            acc[address] = dapp;
          }
          return acc;
        },
        {} as Record<string, ReadOnlyDapp>,
      ),
    [dappsList],
  );

  return {
    dapp: dapp || null,
    isFetching: !error && dapp === undefined,
    errorFetching: error,

    dapps: allDapps,
  };
}
