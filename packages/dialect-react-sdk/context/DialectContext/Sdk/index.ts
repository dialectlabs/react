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
  const wallet = DialectWallet.useContainer();
  const sdk = useMemo(() => {
    if (!wallet.adapter.publicKey) return null;
    return Dialect.sdk({
      environment,
      wallet: wallet.adapter,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
    });
  }, [config, wallet.adapter]);

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
