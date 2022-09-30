import {
  DialectSolanaWalletAdapter,
  SolanaConfigProps,
  SolanaSdkFactory,
} from '@dialectlabs/blockchain-sdk-solana';
import {
  ConfigProps,
  DialectContextProvider,
  DialectWalletStatesHolder,
} from '@dialectlabs/react-sdk';
import { PublicKey } from '@solana/web3.js';
import React, { useCallback, useMemo } from 'react';

type WalletOptional<T extends { wallet: DialectSolanaWalletAdapter }> = Omit<
  T,
  'wallet'
> & {
  wallet?: DialectSolanaWalletAdapter;
};

interface DialectSolanaSdkProps {
  config: ConfigProps;
  solanaConfig: WalletOptional<SolanaConfigProps>;
  children: React.ReactNode;
}

const SolanaBlockchainSdkWrapper = ({
  config,
  solanaConfig,
  ...props
}: DialectSolanaSdkProps) => {
  const {
    connectionInitiatedState: { set: setConnectionInitiated },
    isSigningFreeTransactionState: { set: setIsSigningFreeTransaction },
    isSigningMessageState: { set: setIsSigningMessage },
    hardwareWalletForcedState: { get: isHardwareWalletForced },
    isEncryptingState: { set: setIsEncrypting },
  } = DialectWalletStatesHolder.useContainer();

  const wrapDialectWallet = useCallback(
    (adapter: DialectSolanaWalletAdapter): DialectSolanaWalletAdapter => {
      return {
        ...adapter,
        signTransaction: adapter.signTransaction
          ? async (tx) => {
              const isFreeTx =
                tx.recentBlockhash === PublicKey.default.toString();
              if (isFreeTx) {
                setIsSigningFreeTransaction(true);
              }
              try {
                return await adapter.signTransaction!(tx);
              } catch (e) {
                if (isFreeTx) {
                  // assuming free tx is the tx for auth
                  setConnectionInitiated(false);
                }
                throw e;
              } finally {
                if (isFreeTx) {
                  setIsSigningFreeTransaction(false);
                }
              }
            }
          : undefined,
        signMessage:
          !isHardwareWalletForced() && adapter.signMessage
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
        diffieHellman: adapter.diffieHellman
          ? async (...args) => {
              setIsEncrypting(true);
              try {
                return await adapter.diffieHellman!(...args);
              } finally {
                setIsEncrypting(false);
              }
            }
          : undefined,
      };
    },
    [
      isHardwareWalletForced,
      setConnectionInitiated,
      setIsEncrypting,
      setIsSigningFreeTransaction,
      setIsSigningMessage,
    ]
  );

  const blockchainSdkFactory = useMemo(() => {
    if (!solanaConfig.wallet) {
      return null;
    }
    return SolanaSdkFactory.create({
      ...solanaConfig,
      wallet: wrapDialectWallet(solanaConfig.wallet),
    });
  }, [solanaConfig, wrapDialectWallet]);

  return (
    <DialectContextProvider
      config={config}
      blockchainSdkFactory={blockchainSdkFactory}
    >
      {props.children}
    </DialectContextProvider>
  );
};

export const DialectSolanaSdk = (props: DialectSolanaSdkProps) => {
  return (
    <DialectWalletStatesHolder.Provider>
      <SolanaBlockchainSdkWrapper {...props} />
    </DialectWalletStatesHolder.Provider>
  );
};
