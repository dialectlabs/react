import type React from 'react';
import { EMPTY_OBJ } from '../utils';
import { DialectContextProvider } from './DialectContext';
import { DialectWalletStatesHolder } from './DialectContext/Wallet';

export { DialectContextProvider } from './DialectContext';
export type { DialectContextProviderProps } from './DialectContext';
export { DialectWalletStatesHolder } from './DialectContext/Wallet';

export const DialectNoBlockchainSdk: React.FC<{ children: React.ReactNode }> = (
  props
) => {
  return (
    <DialectWalletStatesHolder.Provider>
      <DialectContextProvider config={EMPTY_OBJ} blockchainSdkFactory={null}>
        {props.children}
      </DialectContextProvider>
    </DialectWalletStatesHolder.Provider>
  );
};
