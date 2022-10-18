import type { AccountAddress } from '@dialectlabs/react-sdk';

export function shortenAddress(address: AccountAddress, chars = 4): string {
  const addr = address.toString();
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
}
