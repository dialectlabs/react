import {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
  Dialect,
  DialectSdk as DialectSdkType,
} from '@dialectlabs/sdk';
import { useEffect, useMemo } from 'react';
import { createContainer } from '../container';
import { DialectWalletStatesHolder } from './DialectWalletStatesHolder';
interface DialectSdkProps {
  config: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<BlockchainSdk> | null;
}

interface DialectSdkState {
  sdk: DialectSdkType<BlockchainSdk> | null;
}

function useDialectSdk(
  { config, blockchainSdkFactory }: DialectSdkProps = {} as DialectSdkProps,
): DialectSdkState {
  const {
    walletConnected: { get: walletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
  } = DialectWalletStatesHolder.useContainer();

  const sdk = useMemo(() => {
    if (!blockchainSdkFactory || !walletConnected) {
      return null;
    }
    return Dialect.sdk(config, blockchainSdkFactory);
  }, [config, blockchainSdkFactory, walletConnected]);

  // The idea is to check if we already have token stored somewhere to skip NotAuthorized screen
  // so that we check if sdk is about to be configured with local storage
  // and if so, we validate the token
  // if token is valid, then NotAuthorized will be skipped
  useEffect(
    function preValidateSdkToken() {
      if (!sdk) return;
      if (sdk.info.hasValidAuthentication) {
        setConnectionInitiated(true);
      }
    },
    [sdk, setConnectionInitiated],
  );

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
