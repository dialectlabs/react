import type {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
} from '@dialectlabs/sdk';
import React from 'react';
import { DialectGate, Gate } from './Gate';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';

export const DialectContext = React.createContext<null>(null);

export type DialectContextProviderProps<ChainSdk extends BlockchainSdk> = {
  config: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<ChainSdk> | null;
  gate?: Gate;
  autoConnect?: boolean;
  children: React.ReactNode;
};

export const DialectContextProvider: React.FC<
  DialectContextProviderProps<BlockchainSdk>
> = ({ config, blockchainSdkFactory, gate, children }) => {
  return (
    <DialectContext.Provider value={null}>
      <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
        <DialectGate.Provider initialState={gate}>
          <LocalMessages.Provider>{children}</LocalMessages.Provider>
        </DialectGate.Provider>
      </DialectSdk.Provider>
    </DialectContext.Provider>
  );
};
