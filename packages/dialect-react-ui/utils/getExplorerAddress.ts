export const getExplorerAddress = (
  address: string,
  cluster: string | null | undefined
): string => {
  if (!cluster) {
    cluster = 'devnet';
  } else if (cluster === 'mainnet') {
    cluster = '';
  }
  return `https://solscan.io/account/${address}${
    cluster ? `?cluster=${cluster}` : ''
  }`;
};
