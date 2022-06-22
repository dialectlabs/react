import {
  getHashedName,
  getNameAccountKey,
  NameRegistryState,
} from '@bonfida/spl-name-service';
import { PublicKey } from '@solana/web3.js';
import type { Connection } from '@solana/web3.js';

const SOL_TLD_AUTHORITY = new PublicKey(
  '58PwtjSDuFHuUkYjH9BYnnQKHfwo9reZhC2zMJv9JPkx'
);

const SNS_DOMAIN_EXT = '.sol';

export const parseSNSDomain = (domainString: string): string | undefined => {
  domainString = domainString.trim();
  const isSNSDomain = domainString.match(SNS_DOMAIN_EXT);
  const domainName = domainString.slice(0, domainString.length - 4);
  if (!isSNSDomain || !domainName) return;
  return domainName;
};

export const tryFetchSNSDomain = async (
  connection: Connection,
  domainName: string
): Promise<PublicKey | null> => {
  try {
    const hashedName = await getHashedName(domainName);

    const domainKey = await getNameAccountKey(
      hashedName,
      undefined,
      SOL_TLD_AUTHORITY
    );

    const { registry } = await NameRegistryState.retrieve(
      connection,
      domainKey
    );

    return registry?.owner;
  } catch (e) {
    return null;
  }
};
