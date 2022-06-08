import { PublicKey } from '@solana/web3.js';
import type { Connection } from '@solana/web3.js';
import { tryGetName } from '@cardinal/namespaces';
import useSWR from 'swr';

export const fetchTwitterHandleFromAddress = async (
  connection: Connection,
  publicKeyString: string
) => {
  try {
    const publicKey = new PublicKey(publicKeyString);
    const displayName = await tryGetName(connection, publicKey);
    return displayName;
  } catch (e) {
    return undefined;
  }
};

function useTwitterHandle(connection: Connection, address?: PublicKey) {
  const result = useSWR(
    address ? [connection, address.toString(), 'twitter-handle'] : null,
    fetchTwitterHandleFromAddress
  );

  return result;
}

export default useTwitterHandle;
