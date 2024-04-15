import type { AccountAddress } from '@dialectlabs/sdk';

export function displayAddress(address: AccountAddress, chars = 4): string {
  const addr = address.toString();
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
}
