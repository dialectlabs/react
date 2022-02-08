export const getExplorerAddress = (
  address: string,
  cluster = 'devnet'
): string => {
  return `https://solscan.io/account/${address}${
    cluster ? `?cluster=${cluster}` : ''
  }`;
};
