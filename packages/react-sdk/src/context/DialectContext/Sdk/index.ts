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

// TODO: move auth related functionality away from sdk hook
function useDialectSdk(
  {
    config = DEFAULT_CONFIG,
    blockchainSdkFactory,
  }: DialectSdkProps = {} as DialectSdkProps,
): DialectSdkState {
  const {
    walletConnected: { get: walletConnected },
    connectionInitiatedState: {
      get: isConnectionInitiated,
      set: setConnectionInitiated,
    },
    isAuthDataFetchingState: { set: setIsAuthDataFetching },
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
    function validateSdkToken() {
      async function innerValidateSdkToken() {
        if (!sdk) return;

        const info = await sdk.info();
        if (info.hasValidAuthentication) {
          setConnectionInitiated(true);
        }
      }

      innerValidateSdkToken();
    },
    [sdk, setConnectionInitiated],
  );

  // trigger auth check, on state changes
  // PSA: state changes the following way (for the tokenProvider.get()):
  // 1. initial:        authFetching: false, isSigning: false
  // 2. on sign press:  authFetching: true,  isSigning: false
  // 3. after prepare:  authFetching: true,  isSigning: true
  // 4. after sign:     authFetching: true,  isSigning: false
  // 5. after verify:   authFetching: false, isSigning: false
  useEffect(() => {
    if (!sdk) return;

    if (isConnectionInitiated) {
      setIsAuthDataFetching(true);
      sdk.tokenProvider.get().finally(() => setIsAuthDataFetching(false));
    }
    // eslint-disable-next-line
  }, [isConnectionInitiated, sdk]);

  return {
    sdk,
  };
}

export const DialectSdk = createContainer(useDialectSdk);
