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
  config?: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<BlockchainSdk> | null;
}

interface DialectSdkState {
  sdk: DialectSdkType<BlockchainSdk> | null;
}

const DEFAULT_CONFIG: ConfigProps = {
  dialectCloud: {
    tokenStore: 'local-storage',
    tokenLifetimeMinutes: 43200, // 1 month
  },
};

function useDialectSdk(
  {
    config = DEFAULT_CONFIG,
    blockchainSdkFactory,
  }: DialectSdkProps = {} as DialectSdkProps,
): DialectSdkState {
  const {
    walletConnected: { get: walletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
  } = DialectWalletStatesHolder.useContainer();

  const sdk = useMemo(() => {
    if (!blockchainSdkFactory || !walletConnected) {
      return null;
    }
    return Dialect.sdk({ ...DEFAULT_CONFIG, ...config }, blockchainSdkFactory);
  }, [config, blockchainSdkFactory, walletConnected]);

  // The idea is to check if we already has token stored somewhere to skip NotAuthorized screen
  // so that we check if sdk is about to be configred with local storage
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
