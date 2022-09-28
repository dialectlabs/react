import {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
  Dialect,
  DialectSdk as DialectSdkType,
} from '@dialectlabs/sdk';
import { useMemo } from 'react';
import { createContainer } from '../../../utils/container';

interface DialectSdkProps {
  config: ConfigProps;
  blockchainSdkFactory: BlockchainSdkFactory<BlockchainSdk>;
}

interface DialectSdkState {
  sdk: DialectSdkType<BlockchainSdk> | null;
}

function useDialectSdk(
  { config, blockchainSdkFactory }: DialectSdkProps = {} as DialectSdkProps
): DialectSdkState {
  // const { adapter, initiateConnection } = DialectWallet.useContainer();

  // The idea is to check if we already has token stored somewhere to skip NotAuthorized screen
  // so that we check if sdk is about to be configred with local storage
  // and if so, we validate the token
  // if token is valid, then NotAuthorized will be skipped
  // useEffect(
  //   function preValidateSdkToken() {
  //     const { dialectCloud } = config;
  //     // checks if sdk configured to use local storage
  //     if (!dialectCloud) return;
  //     if (!dialectCloud.tokenStore) return;
  //     if (!adapter.publicKey) return;
  //     // extract token store
  //     let tokenStore: TokenStore;
  //     if (typeof dialectCloud.tokenStore === 'string') {
  //       if (dialectCloud.tokenStore !== 'local-storage') return;
  //       tokenStore = TokenStore.createLocalStorage();
  //     } else {
  //       tokenStore = dialectCloud.tokenStore;
  //     }

  //     // validates token
  //     const token = tokenStore.get(adapter.publicKey);
  //     if (!token) return;
  //     const tokenValid = Auth.tokens.isValid(token);
  //     if (!tokenValid) return;
  //     // if token valid, initiate connections will skip NotAuthorized screen
  //     initiateConnection();
  //   },
  //   [config, adapter, initiateConnection]
  // );

  const sdk = useMemo(
    () => Dialect.sdk(config, blockchainSdkFactory),
    [config, blockchainSdkFactory]
  );

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
