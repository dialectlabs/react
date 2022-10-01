import { useState } from 'react';
import { createContainer } from '../../../utils/container';

interface State<T> {
  get: () => T;
  set: (arg: ((prev: T) => T) | T) => void;
}

export interface DialectWalletStatesHolderState {
  hardwareWalletForcedState: State<boolean>;
  connectionInitiatedState: State<boolean>;
  isSigningFreeTransactionState: State<boolean>;
  isSigningMessageState: State<boolean>;
  isEncryptingState: State<boolean>;
}

function useDialectWalletStatesHolder(): DialectWalletStatesHolderState {
  const [connectionInitiated, setConnectionInitiated] = useState(false);
  const [hardwareWalletForced, setHardwareWalletForced] = useState(false);

  const [isSigningFreeTransaction, setIsSigningFreeTransaction] =
    useState<boolean>(false);
  const [isSigningMessage, setIsSigningMessage] = useState<boolean>(false);
  const [isEncrypting, setIsEncrypting] = useState<boolean>(false);

  return {
    connectionInitiatedState: {
      get: () => connectionInitiated,
      set: setConnectionInitiated,
    },
    hardwareWalletForcedState: {
      get: () => hardwareWalletForced,
      set: setHardwareWalletForced,
    },
    isSigningFreeTransactionState: {
      get: () => isSigningFreeTransaction,
      set: setIsSigningFreeTransaction,
    },
    isSigningMessageState: {
      get: () => isSigningMessage,
      set: setIsSigningMessage,
    },
    isEncryptingState: {
      get: () => isEncrypting,
      set: setIsEncrypting,
    },
  };
}

export const DialectWalletStatesHolder = createContainer(
  useDialectWalletStatesHolder
);
