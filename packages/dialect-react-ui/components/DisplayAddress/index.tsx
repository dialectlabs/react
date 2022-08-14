import type { PublicKey } from '@solana/web3.js';
import { useIdentity } from '@dialectlabs/react-sdk';
import { TwitterIcon } from '../Icon/Twitter';

import { A } from '../common/preflighted';
import { Loader } from '../common';

type DisplayAddressProps = {
  publicKey: PublicKey;
  isLinkable?: boolean;
};

// TODO: Get Identity type from react-sdk
// TODO: Abstract this hardcoding away since we won't know types generally in the long run
const displayName = (identity: any) => {
  switch (identity.type) {
    case 'SNS': {
      return (
        <div className="dt-truncate dt-mr-0.5">{`${identity.name}.sol ◎`}</div>
      );
    }
    case 'CardinalTwitter': {
      return (
        <div className="flex flex-row items-center">
          <div>{identity.name}</div>
          <div className="dt-pl-2">
            <TwitterIcon height={15} width={15} />
          </div>
        </div>
      );
    }
    default: {
      return <div>{identity.name}</div>;
    }
  }
};

export function DisplayAddress({
  publicKey,
  isLinkable = false,
}: DisplayAddressProps) {
  const { identity, loading } = useIdentity({ publicKey });
  return (
    <div className="flex flex-row items-center">
      {isLinkable ? (
        <A href={identity.link} target="_blank" rel="noopener noreferrer">
          {displayName(identity)}
        </A>
      ) : (
        displayName(identity)
      )}
      {loading && (
        <div className="dt-pl-2">
          <Loader />
        </div>
      )}
    </div>
  );
}
