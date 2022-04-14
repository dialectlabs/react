import { useAddressName } from '@cardinal/namespaces-components';
import ContentLoader from "react-content-loader";
import { TwitterIcon } from '../Icon/Twitter';
import type { Connection } from '@project-serum/anchor';
import type { PublicKey } from '@solana/web3.js';

const formatTwitterLink = (handle: string | undefined, color: string) => {
    if (!handle) return <a></a>;
    return (
        <a
        href={`https://twitter.com/${handle}`}
        style={{ color: color }}
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
    connection,
    address,
    height = "13",
    width = "300",
    dark = false,
    style,
    color = "#FFFFFF",
  }: {
    connection: Connection;
    address: PublicKey | undefined;
    height?: string;
    width?: string;
    dark?: boolean;
    style?: React.CSSProperties;
    color?: string
  }) => {
    const { displayName, loadingName } = useAddressName(connection, address);
  
    if (!address) return <></>;
    return loadingName ? (
      <div
        style={{
          ...style,
          height,
          width,
          overflow: "hidden",
        }}
      >
        <ContentLoader
          backgroundColor={dark ? "#333" : undefined}
          foregroundColor={dark ? "#555" : undefined}
        >
          <rect style={{ ...style }} x={0} y={0} width={width} height={height} />
        </ContentLoader>
      </div>
    ) : (
      <div style={{ display: "flex", gap: "5px", ...style }}>
        {displayName?.includes("@")
          ? formatTwitterLink(displayName, color)
          : displayName || formatShortAddress(address)}
      </div>
    );
  };

export function CardinalDisplayAddress({
    connection,
    publicKey,
    showTwitterIcon,
  }: { connection: Connection, publicKey: PublicKey, showTwitterIcon: Boolean}) {

    const { displayName, loadingName } = useAddressName(connection, publicKey);

    console.log('useAddressName', displayName, loadingName)
    return (
      <div className='dt-flex dt-inline-flex items-center'>
        <DisplayAddressNew
          connection={connection}
          address={publicKey}
        />
        {showTwitterIcon &&
        <div className='dt-flex dt-items-center dt-px-1'>
          <TwitterIcon
            height={18}
            width={18}
          />
        </div>}
      </div>
    );
  }