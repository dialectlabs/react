import {
  Config,
  Dialect,
  DialectCloudUnreachableError,
  DialectSdk,
  DialectSdkError,
  DisconnectedFromChainError,
} from '@dialectlabs/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

interface DialectConnectionInfo {
  wallet: boolean;
  solana: boolean;
  dialectCloud: boolean;
}

export interface DialectContextType {
  sdk: DialectSdk;
  connected: DialectConnectionInfo;

  _updateConnectionInfo(
    fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  ): void;
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

  const [connectionInfo, setConnectionInfo] = useState<DialectConnectionInfo>(
    () => ({
      wallet: Boolean(wallet.publicKey),
      solana: false,
      dialectCloud: false,
    })
  );

  const ctx = useMemo(
    (): DialectContextType => ({
      sdk: sdk(),
      connected: connectionInfo,
      _updateConnectionInfo: setConnectionInfo,
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
