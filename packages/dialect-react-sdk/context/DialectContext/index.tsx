import type {
  AccountAddress,
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
} from '@dialectlabs/sdk';
import React from 'react';
import { DialectConnectionInfo } from './ConnectionInfo';
import { DialectDapp } from './Dapp';
import { DialectGate, Gate } from './Gate';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';

export const DialectContext = React.createContext<null>(null);

type DialectContextProviderProps<ChainSdk extends BlockchainSdk> = {
  config: ConfigProps;
  blockchainSdkFactory: BlockchainSdkFactory<ChainSdk>;
  dappAddress?: AccountAddress;
  gate?: Gate;
  // autoConnect?: boolean;
  children?: React.ReactNode;
};

export const DialectContextProvider: React.FC<
  DialectContextProviderProps<BlockchainSdk>
> = ({ config, blockchainSdkFactory, dappAddress, gate, children }) => {
  return (
    <DialectContext.Provider value={null}>
      {/* <DialectWallet.Provider initialState={{ adapter: wallet, autoConnect }}> */}
      <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
        <DialectGate.Provider initialState={gate}>
          <DialectDapp.Provider initialState={{ dappAddress }}>
            <DialectConnectionInfo.Provider initialState={config.backends}>
              <LocalMessages.Provider>{children}</LocalMessages.Provider>
            </DialectConnectionInfo.Provider>
          </DialectDapp.Provider>
        </DialectGate.Provider>
      </DialectSdk.Provider>
      {/* </DialectWallet.Provider> */}
    </DialectContext.Provider>
  );
};
