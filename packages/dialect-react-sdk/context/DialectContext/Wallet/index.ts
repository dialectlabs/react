import { PublicKey } from '@solana/web3.js';
import { useCallback, useMemo, useState } from 'react';
import type { DialectWalletAdapter } from '../../../types';
import { createContainer } from '../../../utils/container';

export interface DialectWalletState {
  adapter: DialectWalletAdapter;
  connected: boolean;
  isSigningFreeTransaction: boolean;
  isSigningMessage: boolean;
  isEncrypting: boolean;
}

function useDialectWallet(adapter?: DialectWalletAdapter): DialectWalletState {
  if (!adapter) {
    throw new Error('dialect wallet adapter should be provided');
  }

  const [isSigningFreeTransaction, setIsSigningFreeTransaction] =
    useState<boolean>(false);
  const [isSigningMessage, setIsSigningMessage] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  const wrapDialectWallet = useCallback(
    (adapter: DialectWalletAdapter): DialectWalletAdapter => {
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
              } finally {
                if (isFreeTx) {
                  setIsSigningFreeTransaction(false);
                }
              }
            }
          : undefined,
        signMessage: adapter.signMessage
          ? async (msg) => {
              setIsSigningMessage(true);
              try {
                return await adapter.signMessage!(msg);
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
    []
  );

  const wrappedAdapter = useMemo(
    () => wrapDialectWallet(adapter),
    [adapter, wrapDialectWallet]
  );

  return {
    adapter: wrappedAdapter,
    connected: wrappedAdapter.connected,
    isSigningFreeTransaction,
    isSigningMessage,
    isEncrypting,
  };
}

export const DialectWallet = createContainer(useDialectWallet);
