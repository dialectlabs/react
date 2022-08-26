import { Identity, useIdentity } from '@dialectlabs/react-sdk';
import type { PublicKey } from '@solana/web3.js';
import { TwitterIcon } from '../Icon/Twitter';

import { shortenAddress } from '../../utils/displayUtils';
import { Loader } from '../common';
import { A } from '../common/preflighted';

type DisplayAddressProps = {
  publicKey: PublicKey;
  isLinkable?: boolean;
};

const displayCustomIdentityName = (identity: Identity) => {
  switch (identity.type) {
    case 'SNS': {
      return (
        <div className="dt-truncate dt-mr-0.5">{`${identity.name}.sol ◎`}</div>
      );
    }
    case 'CARDINAL_TWITTER': {
      return (
        <div className="flex flex-row items-center">
          <div>@{identity.name}</div>
          <div className="dt-pl-2">
            <TwitterIcon height={15} width={15} />
          </div>
        </div>
      );
    }
    default: {
      return <div>{identity.additionals?.displayName || identity.name}</div>;
    }
  }
};

export function DisplayAddress({
  publicKey,
  isLinkable = false,
}: DisplayAddressProps) {
  const { identity, loading } = useIdentity({ publicKey });

  const renderIdentity = () => {
    if (!identity) {
      return <div>{shortenAddress(publicKey)}</div>;
    }

    if (isLinkable && identity.additionals?.link) {
      return (
        <A
          href={identity.additionals.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {displayCustomIdentityName(identity)}
        </A>
      );
    }

    return displayCustomIdentityName(identity);
  };

  return (
    <div className="flex flex-row items-center">
      {loading ? (
        <div className="dt-pl-2">
          <Loader />
        </div>
      ) : (
        renderIdentity()
      )}
    </div>
  );
}
