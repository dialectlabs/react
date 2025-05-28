import type {
  BlockchainSdk,
  BlockchainSdkFactory,
  ConfigProps,
} from '@dialectlabs/sdk';
import React, { useContext } from 'react';
import { SWRConfig } from 'swr';
import { useDappMapper } from '../../hooks/internal/useDappMapper';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';

interface DialectContextValue {
  // dappAddress is the legacy way to identify the dapp. Gets mapped to the appId, will later be replaced with appId completely
  dappAddress: string;
  clientKey: string | null;
  app: {
    id: string | null;
    isLoading: boolean;
    refresh: () => void;
  };
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
};

export const useDialectContext = () => {
  return useContext(DialectContext);
};

export const DialectContextProvider: React.FC<
  DialectContextProviderProps<BlockchainSdk>
> = ({ config, blockchainSdkFactory, children, dappAddress }) => {
  return (
    <SWRConfig>
      <DialectSdk.Provider initialState={{ config, blockchainSdkFactory }}>
        <DialectContextWithLoader dappAddress={dappAddress}>
          <LocalMessages.Provider>{children}</LocalMessages.Provider>
        </DialectContextWithLoader>
      </DialectSdk.Provider>
    </SWRConfig>
  );
};

const DialectContextWithLoader = ({
  dappAddress,
  children,
}: {
  dappAddress: string;
  children: React.ReactNode;
}) => {
  const { appId, clientKey, isLoading, refresh } = useDappMapper(dappAddress);

  return (
    <DialectContext.Provider
      value={{ dappAddress, clientKey, app: { id: appId, isLoading, refresh } }}
    >
      {children}
    </DialectContext.Provider>
  );
};
