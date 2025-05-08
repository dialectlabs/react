import { BlockchainSdk, DialectSdk } from '@dialectlabs/sdk';

export const getRequestHeaders = async <Chain extends BlockchainSdk>(
  sdk: DialectSdk<Chain>,
): Promise<HeadersInit> => {
  const token = await sdk.tokenProvider.get();

  return {
    Authorization: `Bearer ${token.rawValue}`,
    'Content-Type': 'application/json',
  };
};
