import { AccountAddress, Identity, useIdentity } from '@dialectlabs/react-sdk';
import { TwitterIcon } from '../Icon/Twitter';

import { shortenAddress } from '../../utils/displayUtils';
import { Loader } from '../common';
import { A } from '../common/preflighted';

type DisplayAddressProps = {
  address: AccountAddress;
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
        <div className="dt-flex dt-flex-row dt-items-center">
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
  address,
  isLinkable = false,
}: DisplayAddressProps) {
  const { identity, loading } = useIdentity({ address });

  const renderIdentity = () => {
    if (!identity) {
      return <div>{shortenAddress(address)}</div>;
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
    <div className="dt-flex dt-flex-row dt-items-center">
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
