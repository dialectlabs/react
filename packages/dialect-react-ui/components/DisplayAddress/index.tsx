import { useAddressName } from '@cardinal/namespaces-components';
import { getNameEntry } from '@cardinal/namespaces';
import { TwitterIcon } from '../Icon/Twitter';
import type { Connection, PublicKey } from '@solana/web3.js';
import { Loader, fetchSolanaNameServiceName } from '../common';
import { useApi } from '@dialectlabs/react';
import cs from '../../utils/classNames';
import { A } from '../common/preflighted';
import { display, Member } from '@dialectlabs/web3';
import useSWR from 'swr';

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

const formatSolanaDomain = (domain: string): string => {
  if (domain.length <= 6) {
    return domain;
  }
  return `${domain.slice(0, 4)}...${domain.slice(domain.length - 2)}`;
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
      <div className={cs(dimensionClassName, 'dt-overflow-hidden')}>
        Loading...
      </div>
    );
  }
  return (
    <div className="dt-flex dt-gap-1.5">
      {`${formatSolanaDomain(displayName)}.sol ◎`}
    </div>
  );
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

export function DisplayAddress({
  connection,
  dialectMembers,
  isLinkable = false,
}: {
  connection: Connection;
  dialectMembers: Member[] | undefined;
  isLinkable?: boolean;
}) {
  const { wallet } = useApi();

  if (!dialectMembers.length) {
    return null;
  }

  const otherMembers = dialectMembers.filter(
    (member) => member.publicKey.toString() !== wallet?.publicKey?.toString()
  );

  const publicKey = otherMembers[0].publicKey;
  const { displayName, loadingName } = useAddressName(connection, publicKey);
  const showTwitterIcon = displayName?.includes('@');

  const { data } = useSWR([connection, publicKey], fetchSolanaNameServiceName);

  if (connection && showTwitterIcon) {
    return (
      <div className="dt-flex dt-inline-flex items-center">
        <TwitterHandle
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
  } else if (connection && (!data || data?.solanaDomain)) {
    return (
      <SolanaName
        address={publicKey}
        displayName={data?.solanaDomain ?? ''}
        loadingName={!data}
      />
    );
  }

  return (
    <span className="dt-flex dt-items-center">
      {display(publicKey)}
      {!data && <Loader className="dt-ml-1" />}
    </span>
  );
}
