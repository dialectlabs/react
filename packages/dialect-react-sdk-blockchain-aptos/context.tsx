import {
  Aptos,
  AptosSdkFactory,
  DialectAptosWalletAdapter,
} from '@dialectlabs/blockchain-sdk-aptos';
import {
  DialectContextProvider,
  DialectContextProviderProps,
  DialectWalletStatesHolder,
} from '@dialectlabs/react-sdk';
import { useCallback, useEffect, useMemo } from 'react';
import type { AptosConfigProps } from './types';

interface DialectAptosSdkProps
  extends Omit<DialectContextProviderProps<Aptos>, 'blockchainSdkFactory'> {
  aptosConfig: AptosConfigProps;
}

const AptosBlockchainSdkWrapper = ({
  aptosConfig,
  ...props
}: DialectAptosSdkProps) => {
  const {
    walletConnected: { set: setWalletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
    isSigningMessageState: { set: setIsSigningMessage },
  } = DialectWalletStatesHolder.useContainer();

  const wrapDialectWallet = useCallback(
    (adapter: DialectAptosWalletAdapter): DialectAptosWalletAdapter => {
      return {
        ...adapter,
        signMessage: adapter.signMessage
          ? async (msg) => {
              setIsSigningMessage(true);
              try {
                return await adapter.signMessage!(msg);
              } catch (e) {
                // assumint sign message used only for auth
                setConnectionInitiated(false);
                throw e;
              } finally {
                setIsSigningMessage(false);
              }
            }
          : undefined,
        signMessagePayload: adapter.signMessagePayload
          ? async (payload) => {
              setIsSigningMessage(true);
              try {
                return await adapter.signMessagePayload!(payload);
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
    if (!aptosConfig.wallet) {
      return null;
    }
    return AptosSdkFactory.create({
      ...aptosConfig,
      wallet: wrapDialectWallet(aptosConfig.wallet),
    });
  }, [aptosConfig, wrapDialectWallet]);

  useEffect(() => {
    setWalletConnected(Boolean(aptosConfig.wallet));
  }, [aptosConfig, setWalletConnected, blockchainSdkFactory]);

  return (
    <DialectContextProvider
      {...props}
      blockchainSdkFactory={blockchainSdkFactory}
    >
      {props.children}
    </DialectContextProvider>
  );
};

export const DialectAptosSdk = (props: DialectAptosSdkProps) => {
  return (
    <DialectWalletStatesHolder.Provider>
      <AptosBlockchainSdkWrapper {...props} />
    </DialectWalletStatesHolder.Provider>
  );
};
