import type { Identity } from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import { IDENTITY_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseIdentityParams {
  publicKey: PublicKey;
}

interface UseIdentityValue {
  identity: Identity | null;
  loading: boolean;
}

const useIdentity = ({ publicKey }: UseIdentityParams): UseIdentityValue => {
  const sdk = useDialectSdk();

  const { data: identity, error: errorFetchingIdentity } = useSWR(
    IDENTITY_CACHE_KEY_FN(publicKey),
    () => sdk.identity.resolve(publicKey) // TODO support progressive resolution?
  );

  const loading = !errorFetchingIdentity && identity === undefined;

  return {
    identity: identity || null,
    loading,
  };
};

export default useIdentity;
