import {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
  Dialect,
  DialectSdk as DialectSdkType,
} from '@dialectlabs/sdk';
import { useEffect, useMemo } from 'react';
import { createContainer } from '../../../utils/container';
import { DialectWalletStatesHolder } from '../Wallet';

interface DialectSdkProps {
  config: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<BlockchainSdk> | null;
}

interface DialectSdkState {
  sdk: DialectSdkType<BlockchainSdk> | null;
}

function useDialectSdk(
  { config, blockchainSdkFactory }: DialectSdkProps = {} as DialectSdkProps
): DialectSdkState {
  const { connectionInitiatedState } = DialectWalletStatesHolder.useContainer();

  const sdk = useMemo(() => {
    if (!blockchainSdkFactory) {
      return null;
    }
    return Dialect.sdk(config, blockchainSdkFactory);
  }, [config, blockchainSdkFactory]);

  // The idea is to check if we already has token stored somewhere to skip NotAuthorized screen
  // so that we check if sdk is about to be configred with local storage
  // and if so, we validate the token
  // if token is valid, then NotAuthorized will be skipped
  useEffect(
    function preValidateSdkToken() {
      if (!sdk) return;
      const token = sdk.tokenProvider.get();
      if (!token) return;
      connectionInitiatedState.set(true);
    },
    [sdk, connectionInitiatedState]
  );

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
