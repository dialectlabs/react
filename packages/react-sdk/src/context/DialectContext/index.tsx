import type {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
} from '@dialectlabs/sdk';
import React, { useContext } from 'react';
import { SWRConfig } from 'swr';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';

interface DialectContextValue {
  dappAddress: string;
  customNotificationsUi?: React.ReactNode;
}

export const DialectContext = React.createContext<DialectContextValue>(
  {} as DialectContextValue,
);

export type DialectContextProviderProps<ChainSdk extends BlockchainSdk> = {
  dappAddress: string;
  config?: ConfigProps;
  blockchainSdkFactory?: BlockchainSdkFactory<ChainSdk> | null;
  // gate?: Gate;
  children: React.ReactNode;
  customNotificationsUi?: React.ReactNode;
};

export const useDialectContext = () => {
  return useContext(DialectContext);
};

export const DialectContextProvider: React.FC<
  DialectContextProviderProps<BlockchainSdk>
> = ({
  config,
  blockchainSdkFactory,
  children,
  dappAddress,
  customNotificationsUi,
}) => {
  return (
    <SWRConfig>
      <DialectContext.Provider value={{ dappAddress, customNotificationsUi }}>
        <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
          {/* <DialectGate.Provider initialState={gate}> */}
          <LocalMessages.Provider>{children}</LocalMessages.Provider>
          {/* </DialectGate.Provider> */}
        </DialectSdk.Provider>
      </DialectContext.Provider>
    </SWRConfig>
  );
};
