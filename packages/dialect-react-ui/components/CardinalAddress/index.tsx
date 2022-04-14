import { useAddressName } from '@cardinal/namespaces-components';
import { TwitterIcon } from '../Icon/Twitter';
import type { Connection } from '@project-serum/anchor';
import type { PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import cs from '../../utils/classNames';

const formatTwitterLink = (handle: string | undefined, className?: string) => {
  if (!handle) return <a></a>;
  return (
    <a
      href={`https://twitter.com/${handle}`}
      className={className}
      target="_blank"
      rel="noreferrer"
    >
      {handle}
    </a>
  );
};

function shortenAddress(address: string, chars = 5): string {
  return `${address.substring(0, chars)}...${address.substring(
    address.length - chars
  )}`;
}

const formatShortAddress = (address: PublicKey | undefined) => {
  if (!address) return <></>;
  return (
    <a
      href={`https://explorer.solana.com/address/${address.toString()}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {shortenAddress(address.toString())}
    </a>
  );
};

const DisplayAddressNew = ({
  address,
  displayName,
  loadingName,
  dimensionClassName = '',
  colorClassName = 'dt-text-white',
}: {
  address: PublicKey | undefined;
  displayName: string | undefined;
  loadingName: boolean;
  dimensionClassName?: string;
  colorClassName?: string;
  className?: string;
}) => {
  if (!address) return <></>;
  return loadingName ? (
    <div className={cs(dimensionClassName, 'dt-overflow-hidden')}>
      Loading...
    </div>
  ) : (
    <div className="dt-flex dt-gap-1.5">
      {displayName?.includes('@')
        ? formatTwitterLink(displayName, colorClassName)
        : displayName || formatShortAddress(address)}
    </div>
  );
};

export function CardinalDisplayAddress({
  connection,
  publicKey,
}: {
  connection: Connection;
  publicKey: PublicKey;
}) {
  const { displayName, loadingName } = useAddressName(connection, publicKey);
  const showTwitterIcon = displayName?.includes('@');

  return (
    <div className="dt-flex dt-inline-flex items-center">
      <DisplayAddressNew
        address={publicKey}
        displayName={displayName}
        loadingName={loadingName}
      />
      {showTwitterIcon && (
        <div className="dt-flex dt-items-center dt-px-1">
          <TwitterIcon height={18} width={18} />
        </div>
      )}
    </div>
  );
}
