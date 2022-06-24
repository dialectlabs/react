import { getNameEntry } from '@cardinal/namespaces';
import type { ThreadMember } from '@dialectlabs/react-sdk';
import { display } from '@dialectlabs/web3';
import type { Connection, PublicKey } from '@solana/web3.js';
import clsx from 'clsx';
import useSWR from 'swr';
import useTwitterHandle from '../../hooks/useTwitterHandle';
import { fetchSolanaNameServiceName, Loader } from '../common';
import { A } from '../common/preflighted';
import { TwitterIcon } from '../Icon/Twitter';

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

const TwitterHandle = ({
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
    <div className={clsx(dimensionClassName, 'dt-overflow-hidden')}>
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

const SolanaName = ({
  address,
  displayName,
  loadingName,
  dimensionClassName = '',
}: {
  address?: PublicKey;
  displayName: string;
  loadingName: boolean;
  dimensionClassName?: string;
  colorClassName?: string;
  className?: string;
  isLinkable?: boolean;
}) => {
  if (!address) return <></>;
  if (loadingName) {
    return (
      <div className={clsx(dimensionClassName, 'dt-overflow-hidden')}>
        Loading...
      </div>
    );
  }
  return <div className="dt-truncate dt-mr-0.5">{`${displayName}.sol ◎`}</div>;
};

export const fetchAddressFromTwitterHandle = async (
  connection: Connection,
  handle: string
) => {
  const NAMESPACE = 'twitter';
  try {
    const { parsed, pubkey } = await getNameEntry(
      connection,
      NAMESPACE,
      handle
    );
    return { result: { parsed, pubkey } };
  } catch (e) {
    return { result: null };
  }
};

type DisplayAddressProps = {
  connection: Connection;
  otherMembers: ThreadMember[];
  isLinkable?: boolean;
};

export function DisplayAddress({
  connection,
  otherMembers,
  isLinkable = false,
}: DisplayAddressProps) {
  const otherMemberPK = otherMembers[0]?.publicKey;

  const { data: displayName, error } = useTwitterHandle(
    connection,
    otherMemberPK
  );
  const loadingName = !displayName && !error;
  const showTwitterIcon = displayName?.includes('@');

  const { data } = useSWR(
    otherMemberPK ? [connection, otherMemberPK.toString(), 'sns'] : null,
    fetchSolanaNameServiceName
  );

  if (!otherMemberPK) return null;

  if (showTwitterIcon) {
    return (
      <div className="dt-inline-flex items-center">
        <TwitterHandle
          address={otherMemberPK}
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
  } else if (!data || data?.solanaDomain) {
    return (
      <SolanaName
        address={otherMemberPK}
        displayName={data?.solanaDomain ?? ''}
        loadingName={!data}
      />
    );
  }

  return (
    <span className="dt-flex dt-items-center">
      {display(otherMemberPK)}
      {!data && <Loader className="dt-ml-1" />}
    </span>
  );
}
