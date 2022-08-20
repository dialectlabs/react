import { breakName, tryGetName } from '@cardinal/namespaces';
import { tryGetImageUrl } from '@cardinal/namespaces-components';
import { Connection, PublicKey } from '@solana/web3.js';
import useDapp from './useDapp';
import useDialectSdk from './useDialectSdk';

import useSWR from 'swr';

function shortenAddress(address: string, chars = 4): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

type UseIdentityParams = {
  publicKey: PublicKey;
};

enum Types {
  Dapp = 'Dapp',
  PublicKey = 'PublicKey',
  SNS = 'SNS',
  CardinalTwitter = 'CardinalTwitter',
}

type Identity = {
  avatarUrl?: string;
  name: string;
  link?: string;
  publicKey: PublicKey;
  type: Types;
};

type UseIdentityValue = {
  identity?: Identity;
  loading: boolean;
};

/*
  Cardinal / Twitter
*/

const fetchTwitterHandleFromAddress = async (
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

const useTwitterHandle = (connection: Connection, address?: PublicKey) => {
  const result = useSWR(
    address ? [connection, address.toString(), 'twitter-handle'] : null,
    fetchTwitterHandleFromAddress
  );

  return { ...result, isLoading: !result.data && !result.error };
};

const fetchImageUrlFromTwitterHandle = async (handle: string) => {
  const url = await tryGetImageUrl(handle);
  if (!url) {
    throw new Error(`Failed fetch image url for this handle: ${handle}`);
  }
  return url;
};

function useTwitterAvatar(connection: Connection, publicKey: PublicKey) {
  const { data: twitterHandle } = useTwitterHandle(connection, publicKey);
  const [_namespace, handle] = twitterHandle ? breakName(twitterHandle) : [];
  const {
    data: addressImage,
    error,
    isValidating,
  } = useSWR(
    handle ? [handle, 'twitter-avatar'] : null,
    fetchImageUrlFromTwitterHandle,
    // Since it's likely avatar wont change, increase dedupingInterval to 1 minute
    { dedupingInterval: 1000 * 60 }
  );

  const isLoading = isValidating;

  return { src: addressImage, error, isLoading };
}

const useCardinalIdentity = ({
  publicKey,
}: UseIdentityParams): UseIdentityValue => {
  const {
    info: {
      solana: { dialectProgram },
    },
  } = useDialectSdk();
  const connection = dialectProgram.provider.connection;
  const { data: name, isLoading: isHandleLoading } = useTwitterHandle(
    connection,
    publicKey
  );
  const { src, isLoading: isAvatarLoading } = useTwitterAvatar(
    connection,
    publicKey
  );
  const loading = isHandleLoading || isAvatarLoading;
  // TODO: determine if !name is sufficient
  if (!name) return { identity: undefined, loading };

  return {
    identity: {
      avatarUrl: src,
      link: `https://twitter.com/${name}`,
      name,
      publicKey,
      type: Types.CardinalTwitter,
    },
    loading,
  };
};

/*
 SNS / Bonfida
*/

import { FavouriteDomain, NAME_OFFERS_ID } from '@bonfida/name-offers';
import {
  NAME_PROGRAM_ID,
  performReverseLookup,
} from '@bonfida/spl-name-service';

async function findOwnedNameAccountsForUser(
  connection: Connection,
  userAccount: PublicKey
): Promise<PublicKey[]> {
  const filters = [
    {
      memcmp: {
        offset: 32,
        bytes: userAccount.toBase58(),
      },
    },
  ];
  const accounts = await connection.getProgramAccounts(NAME_PROGRAM_ID, {
    filters,
  });
  return accounts.map((a) => a.pubkey);
}

const findFavoriteDomainName = async (
  connection: Connection,
  owner: PublicKey
) => {
  try {
    const [favKey] = await FavouriteDomain.getKey(
      NAME_OFFERS_ID,
      new PublicKey(owner)
    );

    const favourite = await FavouriteDomain.retrieve(connection, favKey);

    const reverse = await performReverseLookup(
      connection,
      favourite.nameAccount
    );

    return reverse;
  } catch (err) {
    // console.log('Error finding favorite domain name', err);
  }
};

const fetchSolanaNameServiceName = async (
  connection: Connection,
  publicKeyString: string
): Promise<{ solanaDomain: string | undefined }> => {
  try {
    if (publicKeyString) {
      const address = new PublicKey(publicKeyString);
      let domainName = await findFavoriteDomainName(connection, address);
      if (!domainName || domainName == '') {
        const domainKeys = await findOwnedNameAccountsForUser(
          connection,
          address
        );
        domainKeys.sort();
        if (domainKeys.length > 0 && domainKeys[0]) {
          domainName = await performReverseLookup(connection, domainKeys[0]);
        }
      }

      return { solanaDomain: domainName };
    }
  } catch (err) {
    // console.log(err);
  }

  return { solanaDomain: undefined };
};

const useSNSIdentity = ({ publicKey }: UseIdentityParams): UseIdentityValue => {
  const {
    info: {
      solana: { dialectProgram },
    },
  } = useDialectSdk();
  const connection = dialectProgram.provider.connection;
  const { data, error } = useSWR(
    publicKey ? [connection, publicKey.toString(), 'sns'] : null,
    fetchSolanaNameServiceName
  );
  const isLoading = !data && !error;
  if (isLoading || !data?.solanaDomain)
    return {
      identity: undefined,
      loading: isLoading,
    };
  return {
    identity: {
      link: `https://explorer.solana.com/address/${publicKey.toString()}`,
      name: data.solanaDomain,
      publicKey,
      type: Types.SNS,
    },
    loading: isLoading,
  };
};

/*
  Dialect verified dapps
*/

const useDappIdentity = ({
  publicKey,
}: UseIdentityParams): UseIdentityValue => {
  const { dapps, isFetching: loading } = useDapp();
  const dapp = dapps[publicKey.toString()];
  if (!dapp) return { identity: undefined, loading };
  return {
    identity: {
      avatarUrl: dapp.avatarUrl,
      name: dapp.name,
      publicKey,
      type: Types.Dapp,
    },
    loading,
  };
};

const useIdentity = ({ publicKey }: UseIdentityParams): UseIdentityValue => {
  const defaultIdentity = {
    link: `https://explorer.solana.com/address/${publicKey.toString()}`,
    name: shortenAddress(publicKey.toBase58()),
    publicKey,
    type: Types.PublicKey,
  };

  const { identity: dappIdentity, loading: dappLoading } = useDappIdentity({
    publicKey,
  });
  const { identity: cardinalIdentity, loading: cardinalLoading } =
    useCardinalIdentity({ publicKey });
  const { identity: snsIdentity, loading: snsLoading } = useSNSIdentity({
    publicKey,
  });

  // If dappIdentity exists we prioritize it over everything else
  const loading =
    !dappIdentity && (dappLoading || cardinalLoading || snsLoading);

  if (loading) return { identity: defaultIdentity, loading };

  if (dappIdentity) {
    return {
      identity: dappIdentity,
      loading,
    };
  }
  if (snsIdentity) {
    return {
      identity: { ...cardinalIdentity, ...snsIdentity },
      loading: false,
    };
  }
  if (cardinalIdentity) {
    return { identity: cardinalIdentity, loading: false };
  }
  return {
    identity: defaultIdentity,
    loading: false,
  };
};

export default useIdentity;
