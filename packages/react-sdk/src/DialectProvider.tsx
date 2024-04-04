import { ConfigProps } from '@dialectlabs/sdk';
import { PublicKey } from '@solana/web3.js';
import { createContext, PropsWithChildren } from 'react';
import { DialectSolanaSdk } from './internal/context/DialectSolanaSdk';

const DialectContext = createContext({});

interface DialectProviderProps {
  dappAddress: PublicKey;
  config?: ConfigProps;
}

const defaultConfig: ConfigProps = {
  environment: 'production', //TODO env var
  dialectCloud: {
    tokenStore: 'local-storage',
  },
};

export const DialectProvider = ({
  dappAddress,
  config = defaultConfig,
  children,
}: PropsWithChildren<DialectProviderProps>) => {
  return (
    <DialectContext.Provider value={{ dappAddress }}>
      <DialectSolanaSdk config={config}>{children}</DialectSolanaSdk>
    </DialectContext.Provider>
  );
};
