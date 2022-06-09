import { Config, Dialect, DialectSdk } from '@dialectlabs/sdk';
import React, { useEffect, useState } from 'react';

interface DialectContextType {
  sdk: DialectSdk;
}

export const DialectContext = React.createContext<DialectContextType>(
  {} as DialectContextType
);

const DialectContextProvider: React.FC<Config> = ({
  environment,
  wallet,
  solana,
  dialectCloud,
  encryptionKeysStore,
  backends,
  children,
}) => {
  const [ctxValue, setCtxValue] = useState<DialectContextType>(() => ({
    sdk: Dialect.sdk({
      environment,
      wallet,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
    }),
  }));

  useEffect(
    function init() {
      const sdk = Dialect.sdk({
        environment,
        wallet,
        solana,
        dialectCloud,
        encryptionKeysStore,
        backends,
      });
      setCtxValue({ sdk });
    },
    [environment, wallet, solana, dialectCloud, encryptionKeysStore, backends]
  );

  return (
    <DialectContext.Provider value={ctxValue}>
      {children}
    </DialectContext.Provider>
  );
};

export default DialectContextProvider;
