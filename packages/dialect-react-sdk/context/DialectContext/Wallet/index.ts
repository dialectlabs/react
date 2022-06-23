import { useCallback, useMemo, useState } from 'react';
import type { DialectWalletAdapter } from '../../../types';
import { createContainer } from '../../../utils/container';

export interface DialectWalletState {
  adapter: DialectWalletAdapter;
  isSigning: boolean;
}

function useDialectWallet(adapter?: DialectWalletAdapter): DialectWalletState {
  if (!adapter) {
    throw new Error('dialect wallet adapter should be provided');
  }

  const [isSigning, setIsSigning] = useState<boolean>(false);

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
      };
    },
    []
  );

  const wrappedAdapter = useMemo(() => wrapDialectWallet(adapter), [adapter]);

  return {
    adapter: wrappedAdapter,
    isSigning,
  };
}

export const DialectWallet = createContainer(useDialectWallet);
