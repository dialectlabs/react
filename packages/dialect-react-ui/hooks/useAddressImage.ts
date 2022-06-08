import useTwitterHandle from './useTwitterHandle';
import type { Connection, PublicKey } from '@solana/web3.js';
import { breakName } from '@cardinal/namespaces';
import { tryGetImageUrl } from '@cardinal/namespaces-components';
import useSWR from 'swr';

export const fetchImageUrlFromTwitterHandle = async (handle: string) => {
  try {
    return await tryGetImageUrl(handle);
  } catch (e) {
    return;
  }
};

function useAddressImage(connection: Connection, address?: PublicKey) {
  const { data: twitterHandle } = useTwitterHandle(connection, address);
  const [_namespace, handle] = twitterHandle ? breakName(twitterHandle) : [];
  const { data: addressImage, error } = useSWR(
    handle ? [handle, 'twitter-avatar'] : null,
    fetchImageUrlFromTwitterHandle,
    // Since it's likely avatar wont change, increase dedupingInterval to 1 minute
    { dedupingInterval: 1000 * 60 }
  );

  const isLoading = typeof addressImage === 'undefined' && !error;

  return { src: addressImage, isLoading };
}

export default useAddressImage;
