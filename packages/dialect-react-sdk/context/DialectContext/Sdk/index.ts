import {
  Auth,
  ConfigProps,
  Dialect,
  DialectSdk as DialectSdkType,
  TokenStore,
} from '@dialectlabs/sdk';
import { useEffect, useMemo } from 'react';
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
  const { adapter, connected, initiateConnection } =
    DialectWallet.useContainer();

  // checks if wallet is already authorized to skip not authorized screen
  useEffect(
    function preValidateSdkToken() {
      if (!dialectCloud) return;
      if (!dialectCloud.tokenStore) return;
      if (!adapter.publicKey) return;
      // extract token store
      let tokenStore: TokenStore;
      if (typeof dialectCloud.tokenStore === 'string') {
        if (dialectCloud.tokenStore !== 'local-storage') return;
        tokenStore = TokenStore.createLocalStorage();
      } else {
        tokenStore = dialectCloud.tokenStore;
      }

      const token = tokenStore.get(adapter.publicKey);
      if (!token) return;
      const tokenValid = Auth.tokens.isValid(token);
      if (!tokenValid) return;
      initiateConnection();
    },
    [dialectCloud, adapter, initiateConnection]
  );

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
