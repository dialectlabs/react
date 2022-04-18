import { useAddressName } from '@cardinal/namespaces-components';
import { TwitterIcon } from '../Icon/Twitter';
import type { Connection } from '@project-serum/anchor';
import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import cs from '../../utils/classNames';
import { A } from '../common/preflighted';

const formatTwitterLink = (
  handle: string | undefined,
  isLinkable: boolean,
  className?: string
) => {
  if (!handle) return <A></A>;
  return isLinkable ? (
    <A
      href={`https://twitter.com/${handle}`}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      {handle}
    </A>
  ) : (
    handle
  );
};

function shortenAddress(address: string, chars = 5): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

const formatShortAddress = (
  address: PublicKey | undefined,
  isLinkable: boolean
) => {
  if (!address) return <></>;
  return isLinkable ? (
    <A
      href={`https://explorer.solana.com/address/${address.toString()}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {shortenAddress(address.toString())}
    </A>
  ) : (
    shortenAddress(address.toString())
  );
};

const DisplayAddressNew = ({
  address,
  displayName,
  loadingName,
  dimensionClassName = '',
  colorClassName = 'dt-text-white',
  isLinkable = false,
}: {
  address: PublicKey | undefined;
  displayName: string | undefined;
  loadingName: boolean;
  dimensionClassName?: string;
  colorClassName?: string;
  className?: string;
  isLinkable?: boolean;
}) => {
  if (!address) return <></>;
  return loadingName ? (
    <div className={cs(dimensionClassName, 'dt-overflow-hidden')}>
      Loading...
    </div>
  ) : (
    <div className="dt-flex dt-gap-1.5">
      {displayName?.includes('@')
        ? formatTwitterLink(displayName, isLinkable, colorClassName)
        : displayName || formatShortAddress(address, isLinkable)}
    </div>
  );
};

export function CardinalDisplayAddress({
  connection,
  publicKey,
  isLinkable = false,
}: {
  connection: Connection;
  publicKey: PublicKey;
  isLinkable?: boolean;
}) {
  const { displayName, loadingName } = useAddressName(connection, publicKey);
  const showTwitterIcon = displayName?.includes('@');

  return (
    <div className="dt-flex dt-inline-flex items-center">
      <DisplayAddressNew
        address={publicKey}
        displayName={displayName}
        loadingName={loadingName}
        isLinkable={isLinkable}
      />
      {showTwitterIcon && (
        <div className="dt-flex dt-items-center dt-px-1">
          <TwitterIcon height={18} width={18} />
        </div>
      )}
    </div>
  );
}
