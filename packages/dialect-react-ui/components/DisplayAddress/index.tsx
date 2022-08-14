import type { PublicKey } from '@solana/web3.js';
import { useIdentity } from '@dialectlabs/react-sdk';
import { TwitterIcon } from '../Icon/Twitter';

import { A } from '../common/preflighted';

type DisplayAddressProps = {
  publicKey: PublicKey;
  isLinkable?: boolean;
}

// TODO: Get Identity type from react-sdk
// TODO: Abstract this hardcoding away since we won't know types generally in the long run
const displayName = (identity: any) => {
  switch(identity.type) {
    case 'SNS': {
      return (
        <div className="dt-truncate dt-mr-0.5">{`${identity.name}.sol ◎`}</div>
      );
    }
    case 'CardinalTwitter': {
      return (
        <>
          <div>{identity.name}</div>
          <div className="dt-pl-2">
            <TwitterIcon height={15} width={15} />
          </div>
        </>
      );
    }
    default: {
      return (<div>{identity.name}</div>);
    }
  }
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
        displayName(identity)
      ) : (
        displayName(identity)
      )}
    </A>
  ) : loading ? (
    displayName(identity)
  ) : (
    displayName(identity)
  );
}
