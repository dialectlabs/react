import type {
  Dapp,
  DialectSdkError,
  DialectWalletAdapter,
} from '@dialectlabs/sdk';
import useSWR from 'swr';
import { EMPTY_OBJ } from '../utils';
import useDialectSdk from './useDialectSdk';

const DAPP_CACHE_KEY = (wallet: DialectWalletAdapter) =>
  'DAPPS_' + wallet?.publicKey?.toBase58();

interface UseDappValue {
  dapp: Dapp | null;
  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseDappParams {
  refreshInterval?: number;
}

function useDapp({ refreshInterval }: UseDappParams = EMPTY_OBJ): UseDappValue {
  const { dapps } = useDialectSdk();
  const {
    info: { wallet },
  } = useDialectSdk();
  const { data: dapp = null, error } = useSWR(
    DAPP_CACHE_KEY(wallet),
    () => dapps.find(),
    { refreshInterval, refreshWhenOffline: true }
  );

  return {
    dapp,
    isFetching: !error && dapp == null,
    errorFetching: error,
  };
}

export default useDapp;
