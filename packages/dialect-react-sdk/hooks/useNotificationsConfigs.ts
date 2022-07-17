import type { DialectSdkError, DappNotificationConfig } from '@dialectlabs/sdk';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { WALLET_CONFIGS_CACHE_KEY } from './internal/swrCache';
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

function useNotificationsConfigs({
  refreshInterval,
}: UseDappAddressesParams = EMPTY_OBJ): UseDappAddressesValue {
  const { wallet } = useDialectSdk();
  const [isUpserting, setUpserting] = useState(false);
  const configsApi = wallet?.dappNotificationSubscriptionConfigs;

  const {
    data: configs,
    error = null,
    mutate,
  } = useSWR(
    WALLET_CONFIGS_CACHE_KEY(wallet),
    configsApi ? () => configsApi.findAll() : null,
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
      if (!configsApi) {
        return;
      }
      const current = configs?.find(
        (config) => config.dappNotification.id === dappNotificationId
      );
      if (!current) {
        return;
      }
      setUpserting(true);
      try {
        await configsApi.upsert({
          dappNotificationId,
          config: { ...current.config, enabled },
        });
      } finally {
        setUpserting(false);
      }
    },
    [configs, configsApi]
  );

  return {
    notifications: configs || EMPTY_ARR,

    toggle,

    isFetching: Boolean(configsApi) && !error && configs === undefined,
    errorFetching: !configsApi
      ? new Error('Config API is not available')
      : error,
    isUpserting,
  };
}

export default useNotificationsConfigs;
