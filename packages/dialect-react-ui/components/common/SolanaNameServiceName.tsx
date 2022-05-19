import type { Connection } from '@solana/web3.js';
import { PublicKey } from '@solana/web3.js';
import { useMemo, useState } from 'react';
import { FavouriteDomain, NAME_OFFERS_ID } from '@bonfida/name-offers';
import { NAME_PROGRAM_ID, performReverseLookup } from '@bonfida/spl-name-service';

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
  const accounts = await connection.getProgramAccounts(
    NAME_PROGRAM_ID,
    {
      filters,
    }
  );
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
    console.log(err);
  }
};

export const SolanaNameServiceName = (
  connection: Connection,
  address: PublicKey | undefined
): { solanaDomain: string | undefined; loadingSolanaName: boolean } => {
  const [solanaDomain, setSolanaDomain] = useState<string | undefined>();
  const [loadingSolanaName, setLoadingSolanaName] = useState<boolean>(true);

  useMemo(() => {
    const fetchSolanaNameServiceName = async () => {
      try {
        if (address) {
          let domainName = await findFavoriteDomainName(connection, address);
          if (!domainName || domainName == '') {
            const domainKeys = await findOwnedNameAccountsForUser(
              connection,
              address
            );
            domainKeys.sort();
            if (domainKeys.length > 0 && domainKeys[0]) {
              domainName = await performReverseLookup(
                connection,
                domainKeys[0]
              );
            }
          }

          setSolanaDomain(domainName);
        }
      } finally {
        setLoadingSolanaName(false);
      }
    };

    fetchSolanaNameServiceName();
  }, [connection, address]);

  return { solanaDomain, loadingSolanaName };
};
