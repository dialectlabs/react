const RELIEABLE_DEVNET = 'devnet-solana';

export const getExplorerAddress = (
  address: string,
  cluster: string | null | undefined
): string => {
  if (!cluster || cluster === 'devnet') {
    cluster = RELIEABLE_DEVNET;
  } else if (cluster === 'mainnet') {
    cluster = '';
  }
  return `https://solana.fm/address/${address}${
    cluster ? `?cluster=${cluster}` : ''
  }`;
};
