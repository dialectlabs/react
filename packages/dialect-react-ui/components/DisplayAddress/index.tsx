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

type UseIdentityProps = {
  connection: Connection;
  otherMemberPK?: PublicKey;
};

export const useIdentity = ({
  connection,
  otherMemberPK,
}: UseIdentityProps) => {
  const { data: snsData, error: snsError } = useSWR(
    otherMemberPK ? [connection, otherMemberPK.toString(), 'sns'] : null,
    fetchSolanaNameServiceName
  );

  const { data: displayTwitterName, isLoading: isLoadingTwitterHandle } =
    useTwitterHandle(connection, otherMemberPK);

  return {
    sns: {
      displayName: snsData?.solanaDomain,
      isLoading: !snsData && !snsError,
    },
    cardinal: {
      displayName: displayTwitterName,
      isLoading: isLoadingTwitterHandle,
      isTwitter: displayTwitterName?.includes('@'),
    },
  };
};

type DisplayAddressProps = {
  connection: Connection;
  otherMemberPK: PublicKey;
  isLinkable?: boolean;
};

export function DisplayAddress({
  connection,
  otherMemberPK,
  isLinkable = false,
}: DisplayAddressProps) {
  const { sns, cardinal } = useIdentity({ connection, otherMemberPK });

  if (!otherMemberPK) return null;

  if (sns?.displayName) {
    return (
      <SolanaName
        address={otherMemberPK}
        displayName={sns?.displayName ?? ''}
      />
    );
  }

  if (!sns.isLoading && !cardinal.isLoading && cardinal.isTwitter) {
    return (
      <div className="dt-inline-flex items-center">
        <TwitterHandle
          address={otherMemberPK}
          displayName={cardinal.displayName}
          isLinkable={isLinkable}
        />
        {cardinal.isTwitter && (
          <div className="dt-flex dt-items-center dt-px-1">
            <TwitterIcon height={18} width={18} />
          </div>
        )}
      </div>
    );
  }

  return (
    <span className="dt-flex dt-items-center">{display(otherMemberPK)}</span>
  );
}
