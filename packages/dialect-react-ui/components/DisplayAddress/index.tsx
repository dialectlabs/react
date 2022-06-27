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
  isLinkable = false,
}: {
  address: PublicKey | undefined;
  displayName: string | undefined;
  className?: string;
  isLinkable?: boolean;
}) => {
  if (!address) return <></>;
  return (
    <div className="dt-flex dt-gap-1.5">
      {displayName?.includes('@')
        ? formatTwitterLink(displayName, isLinkable)
        : displayName || formatShortAddress(address, isLinkable)}
    </div>
  );
};

const SolanaName = ({
  address,
  displayName,
}: {
  address?: PublicKey;
  displayName: string;
}) => {
  if (!address) return <></>;
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

  const { data: snsData, error: errorFetchingSNSdomain } = useSWR(
    otherMemberPK ? [connection, otherMemberPK.toString(), 'sns'] : null,
    fetchSolanaNameServiceName
  );
  const isLoadingSNSDomain = !snsData && !errorFetchingSNSdomain;

  const { data: displayName, isLoading: isLoadingTwitterHandle } =
    useTwitterHandle(connection, otherMemberPK);
  const showTwitterIcon = displayName?.includes('@');

  if (!otherMemberPK) return null;

  if (snsData?.solanaDomain) {
    return (
      <SolanaName
        address={otherMemberPK}
        displayName={snsData?.solanaDomain ?? ''}
      />
    );
  }

  if (!isLoadingSNSDomain && !isLoadingTwitterHandle && showTwitterIcon) {
    return (
      <div className="dt-inline-flex items-center">
        <TwitterHandle
          address={otherMemberPK}
          displayName={displayName}
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

  return (
    <span className="dt-flex dt-items-center">
      {display(otherMemberPK)}
      {isLoadingSNSDomain && <Loader className="dt-ml-1" />}
    </span>
  );
}
