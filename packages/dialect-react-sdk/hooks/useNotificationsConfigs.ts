import type { DialectSdkError, DappNotificationConfig } from '@dialectlabs/sdk';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { WALLET_CONFIGS_CACHE_KEY } from './internal/swrCache';
import useDapp from './useDapp';
import useDialectSdk from './useDialectSdk';

interface ToggleParams {
  dappNotificationId: string;
  enabled: boolean;
}

interface UseDappAddressesValue {
  notifications: DappNotificationConfig[];

  toggle: (params: ToggleParams) => Promise<void>;

  isFetching: boolean;
  errorFetching: DialectSdkError | null;
  isUpserting: boolean;
}

interface UseDappAddressesParams {
  refreshInterval?: number;
}

const mockConfigs: DappNotificationConfig[] = [
  {
    dappNotification: {
      id: '0',
      code: 'announcements',
      name: '📢 Broadcast announcements',
      trigger:
        'Commonly used by Dapp to announce anything, currently only via off-chain.',
    },
    config: { enabled: true },
  },
  {
    dappNotification: {
      id: '1',
      code: 'negative-apy',
      name: 'Negative APY!',
      trigger:
        'The APY for the scnSOL vault is now -5.24% due to borrow rate on Solend being greater than the staking APY on Socean stake pool.',
    },
    config: { enabled: true },
  },
  {
    dappNotification: {
      id: '2',
      code: 'collateral',
      name: 'LOW Collateral-RATIO',
      trigger:
        'You will get notified when your Collateralization ratio falls to dangerous levels',
    },
    config: { enabled: false },
  },
  {
    dappNotification: {
      id: '3',
      code: 'rewards',
      name: 'Claim LM Rewards',
      trigger:
        'You have 103.56 SLND and 85.23 MNDE Liquidity Mining (LM) rewards ready to be claimed!',
    },
    config: { enabled: false },
  },
];

function useNotificationsConfigs({
  refreshInterval,
}: UseDappAddressesParams = EMPTY_OBJ): UseDappAddressesValue {
  const { wallet } = useDialectSdk();
  const { dapp } = useDapp();
  const [isUpserting, setUpserting] = useState(false);
  const configsFetchApi = dapp?.notifications;
  const configsChangeApi = wallet?.dappNotificationSubscriptionConfigs;

  const {
    data: configs = mockConfigs,
    error = null,
    mutate,
  } = useSWR(
    WALLET_CONFIGS_CACHE_KEY(wallet),
    configsFetchApi ? () => configsFetchApi.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  useEffect(
    function invalidateConfigs() {
      mutate();
    },
    [mutate]
  );

  const toggle = useCallback(
    async ({ dappNotificationId, enabled }) => {
      if (!configsChangeApi) {
        return;
      }
      const current = configs?.find(
        (config) => config.dappNotification.id === dappNotificationId
      );
      if (!current) {
        return;
      }
      setUpserting(true);
      const nextConfigs = configs.map((config) => ({
        ...config,
        config: { ...config.config, enabled },
      }));
      try {
        await mutate(
          async () => {
            const updatedConfig = configsChangeApi.upsert({
              dappNotificationId,
              config: { ...current.config, enabled },
            });

            return nextConfigs;
          },
          {
            optimisticData: nextConfigs,
            rollbackOnError: true,
          }
        );
      } finally {
        setUpserting(false);
      }
    },
    [configs, configsChangeApi]
  );

  return {
    notifications: configs || EMPTY_ARR,

    toggle,

    isFetching: Boolean(configsFetchApi) && !error && configs === undefined,
    // errorFetching: !configsChangeApi
    //   ? new Error('Config API is not available')
    //   : error,
    errorFetching: error,
    isUpserting,
  };
}

export default useNotificationsConfigs;
