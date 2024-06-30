import {
  DialectSolanaWalletAdapter as DialectSdkSolanaWalletAdapter,
  SolanaSdkFactory,
} from '@dialectlabs/blockchain-sdk-solana';
import {
  DialectContextProvider,
  DialectWalletStatesHolder,
} from '@dialectlabs/react-sdk';
import type { ConfigProps } from '@dialectlabs/sdk';
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import React, { useCallback, useEffect, useMemo } from 'react';

export type Props = {
  dappAddress: string;
  config?: ConfigProps;
  customWalletAdapter?: DialectSolanaWalletAdapter;
  children: React.ReactNode;
  customNotificationsUi?: React.ReactNode;
};

export interface DialectSolanaWalletAdapter {
  publicKey?: PublicKey | null;
  signTransaction?: <T extends Transaction | VersionedTransaction>(
    tx: T,
  ) => Promise<T>;
  signMessage?: (msg: Uint8Array) => Promise<Uint8Array>;
}

type UnifiedWallet = WalletContextState | DialectSolanaWalletAdapter;

const SolanaBlockchainSdkWrapper = (props: Props) => {
  const walletFromContext = useWallet();
  const isWalletFromContext = props.customWalletAdapter === undefined;
  const wallet = isWalletFromContext
    ? walletFromContext
    : props.customWalletAdapter;

  const {
    walletConnected: { set: setWalletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
    isSigningFreeTransactionState: { set: setIsSigningFreeTransaction },
    isSigningMessageState: { set: setIsSigningMessage },
    hardwareWalletForcedState: { get: isHardwareWalletForced },
  } = DialectWalletStatesHolder.useContainer();

  //used to pass solana wallet context state to internal state holder
  const wrapSolanaWallet = useCallback(
    (wallet: UnifiedWallet): DialectSdkSolanaWalletAdapter => {
      return {
        publicKey: wallet.publicKey ?? undefined,
        signTransaction: wallet.signTransaction
          ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
            async (tx: any) => {
              const isFreeTx =
                tx.recentBlockhash &&
                tx.recentBlockhash === PublicKey.default.toString();
              if (isFreeTx) {
                setIsSigningFreeTransaction(true);
              }
              try {
                return await wallet.signTransaction!(tx);
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
          !isHardwareWalletForced && wallet.signMessage
            ? async (msg) => {
                setIsSigningMessage(true);
                try {
                  return await wallet.signMessage!(msg);
                } catch (e) {
                  // assuming sign message used only for auth
                  setConnectionInitiated(false);
                  throw e;
                } finally {
                  setIsSigningMessage(false);
                }
              }
            : undefined,
      };
    },
    [
      isHardwareWalletForced,
      setConnectionInitiated,
      setIsSigningFreeTransaction,
      setIsSigningMessage,
    ],
  );

  const blockchainSdkFactory = useMemo(() => {
    if (!wallet || !wallet.publicKey) {
      return null;
    }
    return SolanaSdkFactory.create({
      wallet: wrapSolanaWallet(wallet),
    });
  }, [wallet, wrapSolanaWallet]);

  useEffect(() => {
    setWalletConnected(Boolean(wallet && wallet.publicKey));
  }, [setWalletConnected, wallet]);

  return (
    <DialectContextProvider
      {...props}
      blockchainSdkFactory={blockchainSdkFactory}
    />
  );
};

export const DialectSolanaSdk = (props: Props) => {
  return (
    <DialectWalletStatesHolder.Provider>
      <SolanaBlockchainSdkWrapper {...props} />
    </DialectWalletStatesHolder.Provider>
  );
};
