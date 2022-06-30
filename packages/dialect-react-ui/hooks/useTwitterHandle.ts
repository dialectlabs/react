import { PublicKey } from '@solana/web3.js';
import type { Connection } from '@solana/web3.js';
import { tryGetName } from '@cardinal/namespaces';
import useSWR from 'swr';

export const fetchTwitterHandleFromAddress = async (
  connection: Connection,
  publicKeyString: string
) => {
  const publicKey = new PublicKey(publicKeyString);
  const displayName = await tryGetName(connection, publicKey);
  if (!displayName) {
    throw new Error(`Failed fetching name for this PK:${publicKeyString}`);
  }
  return displayName;
};

function useTwitterHandle(connection: Connection, address?: PublicKey) {
  const result = useSWR(
    address ? [connection, address.toString(), 'twitter-handle'] : null,
    fetchTwitterHandleFromAddress
  );

  return { ...result, isLoading: !result.data && !result.error };
}

export default useTwitterHandle;
