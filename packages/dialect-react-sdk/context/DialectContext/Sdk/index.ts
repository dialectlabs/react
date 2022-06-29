import {
  ConfigProps,
  Dialect,
  DialectSdk as DialectSdkType,
} from '@dialectlabs/sdk';
import { useMemo } from 'react';
import { EMPTY_ARR } from '../../../utils';
import { createContainer } from '../../../utils/container';
import { DialectWallet } from '../Wallet';

interface DialectSdkState {
  sdk: DialectSdkType | null;
}

function useDialectSdk(
  config: Omit<ConfigProps, 'wallet'> = {}
): DialectSdkState {
  const {
    environment,
    solana,
    dialectCloud,
    encryptionKeysStore,
    backends = EMPTY_ARR,
  } = config;
  const { adapter, connected } = DialectWallet.useContainer();
  const sdk = useMemo(() => {
    if (!connected) return null;
    return Dialect.sdk({
      environment,
      wallet: adapter,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
    });
  }, [config, adapter, connected]);

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
