import type { Dapp, DialectSdkError } from '@dialectlabs/sdk';
import useSWR from 'swr';
import { useDialectContext } from '../context';
import { EMPTY_OBJ } from '../utils';
import { DAPP_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseDappValue {
  dapp: Dapp | null;
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappParams {
  refreshInterval?: number;
}

function useNotificationDapp({
  refreshInterval,
}: UseDappParams = EMPTY_OBJ): UseDappValue {
  const { dappAddress } = useDialectContext();
  const { dapps } = useDialectSdk();

  const { data: dapp, error } = useSWR(
    DAPP_CACHE_KEY_FN(dappAddress),
    () => dapps.find({ address: dappAddress }),
    { refreshInterval, refreshWhenOffline: true },
  );

  return {
    dapp: dapp || null,
    isFetching: !error && dapp === undefined,
    errorFetching: error,
  };
}

export default useNotificationDapp;
