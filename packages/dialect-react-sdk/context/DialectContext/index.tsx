import { Config, Dialect, DialectSdk } from '@dialectlabs/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface DialectConnectionInfo {
  wallet: boolean;
  solana: boolean;
  dialectCloud: boolean;
}

export interface DialectContextType {
  sdk: DialectSdk;
  connected: DialectConnectionInfo;
}

export const DialectContext = React.createContext<DialectContextType>(
  {} as DialectContextType
);

type DialectContextProviderProps = Config;

const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  environment,
  wallet,
  solana,
  dialectCloud,
  encryptionKeysStore,
  backends,
  children,
}) => {
  const sdk = useCallback(
    () =>
      Dialect.sdk({
        environment,
        wallet,
        solana,
        dialectCloud,
        encryptionKeysStore,
        backends,
      }),
    [environment, wallet, solana, dialectCloud, encryptionKeysStore, backends]
  );

  const connectionInfo = useCallback(
    (): DialectConnectionInfo => ({
      wallet: Boolean(wallet.publicKey),
      solana: false, // TODO
      dialectCloud: false,
    }),
    [wallet]
  );

  const ctx = useMemo(
    (): DialectContextType => ({
      sdk: sdk(),
      connected: connectionInfo(),
    }),
    [sdk, connectionInfo]
  );

  const [ctxValue, setCtxValue] = useState<DialectContextType>(ctx);

  useEffect(
    function initSdk() {
      setCtxValue(ctx);
    },
    [ctx]
  );

  return (
    <DialectContext.Provider value={ctxValue}>
      {children}
    </DialectContext.Provider>
  );
};

export default DialectContextProvider;
