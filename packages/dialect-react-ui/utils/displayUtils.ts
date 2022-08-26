import type { PublicKey } from '@solana/web3.js';

export function shortenAddress(address: PublicKey | string, chars = 4): string {
  const addr = address.toString();
  return `${addr.substring(0, chars)}...${addr.substring(addr.length - chars)}`;
}
