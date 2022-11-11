import {
  DialectSolanaWalletAdapter,
  Solana,
  SolanaSdkFactory,
} from '@dialectlabs/blockchain-sdk-solana';
import {
  DialectContextProvider,
  DialectContextProviderProps,
  DialectWalletStatesHolder,
} from '@dialectlabs/react-sdk';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useMemo } from 'react';
import type { SolanaConfigProps } from './types';

interface DialectSolanaSdkProps
  extends Omit<DialectContextProviderProps<Solana>, 'blockchainSdkFactory'> {
  solanaConfig: SolanaConfigProps;
}

const SolanaBlockchainSdkWrapper = ({
  solanaConfig,
  ...props
}: DialectSolanaSdkProps) => {
  const {
    walletConnected: { set: setWalletConnected },
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
          ? async (tx: any) => {
              const isFreeTx =
                (tx.recentBlockhash &&
                  tx.recentBlockhash === PublicKey.default.toString()) ===
                PublicKey.default.toString();
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
          !isHardwareWalletForced && adapter.signMessage
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

  useEffect(() => {
    setWalletConnected(Boolean(solanaConfig.wallet));
  }, [solanaConfig, setWalletConnected, blockchainSdkFactory]);

  return (
    <DialectContextProvider
      {...props}
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
