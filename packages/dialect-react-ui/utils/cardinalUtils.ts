import { fetchAddressFromTwitterHandle } from '../components/DisplayAddress';
import type { Connection, PublicKey } from '@solana/web3.js';

export const parseTwitterHandle = (
  handleString: string
): string | undefined => {
  handleString = handleString.trim();
  const isTwitter = handleString.startsWith('@');
  const handle = handleString.substring(1, handleString.length);
  if (!isTwitter || !handle) return;
  return handle;
};

export const tryFetchAddressFromTwitterHandle = async (
  connection: Connection,
  handle: string
): Promise<PublicKey | null> => {
  try {
    const { result } = await fetchAddressFromTwitterHandle(connection, handle);

    return result?.parsed.data;
  } catch (e) {
    return null;
  }
};
