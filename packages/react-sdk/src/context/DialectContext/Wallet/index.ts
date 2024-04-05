import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { useLocalStorage } from '../../../hooks/internal/useLocalStorage';
import { createContainer } from '../../../utils/container';
import { DIALECT_WALLET_CONFIG_STORAGE_KEY } from './constants';

interface State<T> {
  get: T;
  set: Dispatch<SetStateAction<T>>;
}

export interface DialectWalletStatesHolderState {
  walletConnected: State<boolean>;
  connectionInitiatedState: State<boolean>;
  hardwareWalletForcedState: State<boolean>;
  isSigningFreeTransactionState: State<boolean>;
  isSigningMessageState: State<boolean>;
}

export interface HardwareWalletConfig {
  hardwareWalletEnabled: boolean;
}

function useDialectWalletStatesHolder(): DialectWalletStatesHolderState {
  const [walletConnected, setWalletConnected] = useState(false);
  const [connectionInitiated, setConnectionInitiated] = useState(false);

  const [
    localStorageHardwareWalletConfig,
    setLocalStorageHardwareWalletConfig,
  ] = useLocalStorage<HardwareWalletConfig>(DIALECT_WALLET_CONFIG_STORAGE_KEY, {
    hardwareWalletEnabled: false,
  });
  const [hardwareWalletForced, setHardwareWalletForced] = useState(
    localStorageHardwareWalletConfig.hardwareWalletEnabled,
  );
  const handleSetHardwareWalletForced: Dispatch<SetStateAction<boolean>> =
    useCallback(
      (valOrFunc) => {
        const newState =
          typeof valOrFunc === 'function'
            ? valOrFunc(hardwareWalletForced)
            : valOrFunc;

        setHardwareWalletForced(newState);
        setLocalStorageHardwareWalletConfig({
          hardwareWalletEnabled: newState,
        });
      },
      [hardwareWalletForced, setLocalStorageHardwareWalletConfig],
    );

  const [isSigningFreeTransaction, setIsSigningFreeTransaction] =
    useState<boolean>(false);
  const [isSigningMessage, setIsSigningMessage] = useState<boolean>(false);

  return {
    walletConnected: {
      get: walletConnected,
      set: setWalletConnected,
    },
    connectionInitiatedState: {
      get: connectionInitiated,
      set: setConnectionInitiated,
    },
    hardwareWalletForcedState: {
      get: hardwareWalletForced,
      set: handleSetHardwareWalletForced,
    },
    isSigningFreeTransactionState: {
      get: isSigningFreeTransaction,
      set: setIsSigningFreeTransaction,
    },
    isSigningMessageState: {
      get: isSigningMessage,
      set: setIsSigningMessage,
    },
  };
}

export const DialectWalletStatesHolder = createContainer(
  useDialectWalletStatesHolder,
);
