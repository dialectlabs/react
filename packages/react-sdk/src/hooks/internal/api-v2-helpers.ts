import { BlockchainSdk, DialectSdk } from '@dialectlabs/sdk';

export const DIALECT_CLIENT_KEY_HEADER = 'X-Dialect-Client-Key';

export const getRequestHeaders = async <Chain extends BlockchainSdk>(
  sdk: DialectSdk<Chain>,
  clientKey: string,
): Promise<HeadersInit> => {
  const token = await sdk.tokenProvider.get();

  return {
    Authorization: `Bearer ${token.rawValue}`,
    'Content-Type': 'application/json',
    [DIALECT_CLIENT_KEY_HEADER]: clientKey,
  };
};
