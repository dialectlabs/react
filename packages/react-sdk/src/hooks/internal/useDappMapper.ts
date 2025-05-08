import useSWR from 'swr';
import useDialectSdk from '../useDialectSdk';

interface MappedApp {
  id: string;
  name: string;
}

export const useDappMapper = (dappAddress: string) => {
  const sdk = useDialectSdk(true);

  const { data, isLoading, error, mutate } = useSWR<MappedApp>(
    sdk ? ['DAPP_MAPPER', dappAddress] : null,
    async () => {
      if (!sdk) {
        return null;
      }

      const url = new URL(
        `${sdk.config.dialectCloud.v2Url}/v2/internal/find-app`,
      );
      url.searchParams.set('walletAddress', dappAddress);

      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw await response.json();
      }

      return await response.json();
    },
    {
      revalidateOnFocus: false,
      refreshWhenOffline: false,
      errorRetryCount: 0,
    },
  );

  return {
    appId: data?.id || null,
    isLoading,
    error,
    refresh: mutate,
  };
};
