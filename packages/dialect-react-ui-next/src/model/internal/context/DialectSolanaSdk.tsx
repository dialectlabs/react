import {
  DialectSolanaWalletAdapter,
  SolanaSdkFactory,
} from '@dialectlabs/blockchain-sdk-solana';
import { ConfigProps } from '@dialectlabs/sdk';
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import React, { useCallback, useEffect, useMemo } from 'react';
import { DialectSdk } from './DialectSdk';
import { DialectWalletStatesHolder } from './DialectWalletStatesHolder';

export type Props = {
  config: ConfigProps;
  autoConnect?: boolean;
  children: React.ReactNode;
};

const SolanaBlockchainSdkWrapper = ({ config, ...props }: Props) => {
  const wallet = useWallet();

  const {
    walletConnected: { set: setWalletConnected },
    connectionInitiatedState: { set: setConnectionInitiated },
    isSigningFreeTransactionState: { set: setIsSigningFreeTransaction },
    isSigningMessageState: { set: setIsSigningMessage },
    hardwareWalletForcedState: { get: isHardwareWalletForced },
  } = DialectWalletStatesHolder.useContainer();

  //used to pass solana wallet context state to internal state holder
  const wrapSolanaWallet = useCallback(
    (wallet: WalletContextState): DialectSolanaWalletAdapter => {
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
    if (
      !wallet ||
      !wallet.connected ||
      wallet.connecting ||
      wallet.disconnecting ||
      !wallet.publicKey
    ) {
      return null;
    }
    return SolanaSdkFactory.create({
      wallet: wrapSolanaWallet(wallet),
    });
  }, [wallet, wrapSolanaWallet]);

  useEffect(() => {
    setWalletConnected(Boolean(wallet.connected));
  }, [setWalletConnected, wallet.connected]);

  return (
    <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
      {props.children}
    </DialectSdk.Provider>
  );
};

export const DialectSolanaSdk = ({ autoConnect, ...props }: Props) => {
  return (
    <DialectWalletStatesHolder.Provider initialState={{ autoConnect }}>
      <SolanaBlockchainSdkWrapper {...props}>
        {props.children}
      </SolanaBlockchainSdkWrapper>
    </DialectWalletStatesHolder.Provider>
  );
};
