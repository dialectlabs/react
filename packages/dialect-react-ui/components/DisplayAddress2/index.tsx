import type { PublicKey } from '@solana/web3.js';
import { useIdentity } from '@dialectlabs/react-sdk';

import { A } from '../common/preflighted';

type DisplayAddressProps = {
  publicKey: PublicKey;
  isLinkable?: boolean;
}

export function DisplayAddress2({
  publicKey,
  isLinkable = false,
}: DisplayAddressProps) {
  const { identity, loading } = useIdentity({ publicKey });
  return isLinkable ? (
    <A
      href={identity.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      {loading ? (
        <>{identity.name}</>
      ) : (
        <>{identity.name}</>
      )}
      {identity.name}
    </A>
  ) : loading ? (
    <>{identity.name}</>
  ) : (
    <>{identity.name}</>
  );
}
