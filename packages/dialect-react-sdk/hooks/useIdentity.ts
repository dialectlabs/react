import type { AccountAddress, Identity } from '@dialectlabs/sdk';
import useSWR from 'swr';
import { IDENTITY_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseIdentityParams {
  address?: AccountAddress;
}

interface UseIdentityValue {
  identity: Identity | null;
  loading: boolean;
}

const useIdentity = ({ address }: UseIdentityParams): UseIdentityValue => {
  const sdk = useDialectSdk();

  const { data: identity, error: errorFetchingIdentity } = useSWR(
    IDENTITY_CACHE_KEY_FN(address),
    () => (address ? sdk.identity.resolve(address) : null)
  );

  const loading = !errorFetchingIdentity && identity === undefined;

  return {
    identity: identity || null,
    loading,
  };
};

export default useIdentity;
