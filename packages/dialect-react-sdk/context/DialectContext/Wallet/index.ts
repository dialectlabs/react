import { useCallback, useMemo, useState } from 'react';
import type { DialectWalletAdapter } from '../../../types';
import { createContainer } from '../../../utils/container';

export interface DialectWalletState {
  adapter: DialectWalletAdapter;
  connected: boolean;
  isSigning: boolean;
  isEncrypting: boolean;
}

function useDialectWallet(adapter?: DialectWalletAdapter): DialectWalletState {
  if (!adapter) {
    throw new Error('dialect wallet adapter should be provided');
  }

  const [isSigning, setIsSigning] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  const wrapDialectWallet = useCallback(
    (adapter: DialectWalletAdapter): DialectWalletAdapter => {
      return {
        ...adapter,
        signMessage: adapter.signMessage
          ? async (msg) => {
              setIsSigning(true);
              try {
                return await adapter.signMessage!(msg);
              } finally {
                setIsSigning(false);
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
    isSigning,
    isEncrypting,
  };
}

export const DialectWallet = createContainer(useDialectWallet);
