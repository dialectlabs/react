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
  const { adapter, initiateConnection } = DialectWallet.useContainer();

  // The idea is to check if we already has token stored somewhere to skip NotAuthorized screen
  // so that we check if sdk is about to be configred with local storage
  // and if so, we validate the token
  // if token is valid, then NotAuthorized will be skipped
  useEffect(
    function preValidateSdkToken() {
      const { dialectCloud } = config;
      // checks if sdk configured to use local storage
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

      // validates token
      const token = tokenStore.get(adapter.publicKey);
      if (!token) return;
      const tokenValid = Auth.tokens.isValid(token);
      if (!tokenValid) return;
      // if token valid, initiate connections will skip NotAuthorized screen
      initiateConnection();
    },
    [config, adapter, initiateConnection]
  );

  const sdk = useMemo(() => {
    if (!adapter.connected) return null;
    const {
      environment,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends = EMPTY_ARR,
      identity,
    } = config;
    return Dialect.sdk({
      environment,
      wallet: adapter,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
      identity,
    });
  }, [config, adapter]);

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
