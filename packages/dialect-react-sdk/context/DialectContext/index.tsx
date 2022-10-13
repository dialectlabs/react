import type {
  AccountAddress,
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
} from '@dialectlabs/sdk';
import React from 'react';
import { DialectDapp } from './Dapp';
import { DialectGate, Gate } from './Gate';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';

export const DialectContext = React.createContext<null>(null);

export type DialectContextProviderProps<ChainSdk extends BlockchainSdk> = {
  config: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<ChainSdk> | null;
  dappAddress?: AccountAddress;
  gate?: Gate;
  children: React.ReactNode;
};

export const DialectContextProvider: React.FC<
  DialectContextProviderProps<BlockchainSdk>
> = ({ config, blockchainSdkFactory, dappAddress, gate, children }) => {
  return (
    <DialectContext.Provider value={null}>
      <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
        <DialectGate.Provider initialState={gate}>
          <DialectDapp.Provider initialState={{ dappAddress }}>
            <LocalMessages.Provider>{children}</LocalMessages.Provider>
          </DialectDapp.Provider>
        </DialectGate.Provider>
      </DialectSdk.Provider>
    </DialectContext.Provider>
  );
};
