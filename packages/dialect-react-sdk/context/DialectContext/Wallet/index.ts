import { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DialectWalletAdapter } from '../../../types';
import { createContainer } from '../../../utils/container';

export interface DialectWalletState {
  adapter: DialectWalletAdapter;
  connected: boolean;
  connectionInitiated: boolean;
  initiateConnection: () => void;
  hardwareWalletForced: boolean;
  setHardwareWalletForced: (
    arg: ((prev: boolean) => boolean) | boolean
  ) => void;
  isSigningFreeTransaction: boolean;
  isSigningMessage: boolean;
  isEncrypting: boolean;
}

function useDialectWallet({
  adapter,
  autoConnect = false,
}: {
  adapter?: DialectWalletAdapter;
  autoConnect?: boolean;
} = {}): DialectWalletState {
  if (!adapter) {
    throw new Error('dialect wallet adapter should be provided');
  }

  const [connectionInitiated, setConnectionInitiated] = useState(autoConnect);
  const [hardwareWalletForced, setHardwareWalletForced] = useState(false);

  const [isSigningFreeTransaction, setIsSigningFreeTransaction] =
    useState<boolean>(false);
  const [isSigningMessage, setIsSigningMessage] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  useEffect(
    function walletDisconnected() {
      if (!adapter.connected) {
        setConnectionInitiated(autoConnect);
      }
    },
    [adapter, autoConnect]
  );

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
          !hardwareWalletForced && adapter.signMessage
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
    [hardwareWalletForced]
  );

  const wrappedAdapter = useMemo(
    () => wrapDialectWallet(adapter),
    [adapter, wrapDialectWallet]
  );

  const initiateConnection = useCallback(() => {
    setConnectionInitiated(true);
  }, []);

  return {
    adapter: wrappedAdapter,
    connected: connectionInitiated && wrappedAdapter.connected,
    connectionInitiated,
    initiateConnection,
    hardwareWalletForced,
    setHardwareWalletForced,
    isSigningFreeTransaction,
    isSigningMessage,
    isEncrypting,
  };
}

export const DialectWallet = createContainer(useDialectWallet);
