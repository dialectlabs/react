import {
  Evm,
  EvmSdkFactory,
  DialectEvmWalletAdapter,
} from '@dialectlabs/blockchain-sdk-evm';
import {
  DialectContextProvider,
  DialectContextProviderProps,
  DialectWalletStatesHolder,
} from '@dialectlabs/react-sdk';
import { useCallback, useEffect, useMemo } from 'react';
import type { EvmConfigProps } from './types';

interface DialectEvmSdkProps
  extends Omit<DialectContextProviderProps<Evm>, 'blockchainSdkFactory'> {
  evmConfig: EvmConfigProps;
}

const EvmBlockchainSdkWrapper = ({
  evmConfig,
  ...props
}: DialectEvmSdkProps) => {
  const {
    walletConnected: { set: setWalletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
    isSigningMessageState: { set: setIsSigningMessage },
  } = DialectWalletStatesHolder.useContainer();

  const wrapDialectWallet = useCallback(
    (adapter: DialectEvmWalletAdapter): DialectEvmWalletAdapter => {
      return {
        ...adapter,
        sign: adapter.sign
          ? async (msg: string | Uint8Array) => {
              setIsSigningMessage(true);
              try {
                return await adapter.sign!(msg);
              } catch (e) {
                // assumint sign message used only for auth
                setConnectionInitiated(false);
                throw e;
              } finally {
                setIsSigningMessage(false);
              }
            }
          : undefined,
      };
    },
    [setConnectionInitiated, setIsSigningMessage]
  );

  const blockchainSdkFactory = useMemo(() => {
    if (!evmConfig.wallet) {
      return null;
    }
    return EvmSdkFactory.create({
      ...evmConfig,
      wallet: wrapDialectWallet(evmConfig.wallet),
    });
  }, [evmConfig, wrapDialectWallet]);

  useEffect(() => {
    setWalletConnected(Boolean(evmConfig.wallet));
  }, [evmConfig, setWalletConnected, blockchainSdkFactory]);

  return (
    <DialectContextProvider
      {...props}
      blockchainSdkFactory={blockchainSdkFactory}
    >
      {props.children}
    </DialectContextProvider>
  );
};

export const DialectEvmSdk = (props: DialectEvmSdkProps) => {
  return (
    <DialectWalletStatesHolder.Provider
      initialState={{ autoConnect: props.autoConnect }}
    >
      <EvmBlockchainSdkWrapper {...props} />
    </DialectWalletStatesHolder.Provider>
  );
};
