import { Config, Dialect, DialectSdk } from '@dialectlabs/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalMessages } from './LocalMessages';

interface DialectConnectionInfo {
  wallet: boolean;
  solana: boolean;
  dialectCloud: boolean;
}

export interface DialectContextType {
  sdk: DialectSdk;
  connected: DialectConnectionInfo;
  dapp?: string;

  _updateConnectionInfo(
    fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  ): void;
}

export const DialectContext = React.createContext<DialectContextType>(
  {} as DialectContextType
);

type DialectContextProviderProps = Config & {
  dapp?: string; // temporary until new dialect cloud api appear
};

export const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  environment,
  wallet,
  solana,
  dialectCloud,
  encryptionKeysStore,
  backends,
  dapp,
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
      dapp: dapp,

      _updateConnectionInfo: setConnectionInfo,
    }),
    [sdk, connectionInfo, dapp]
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
      <LocalMessages.Provider>{children}</LocalMessages.Provider>
    </DialectContext.Provider>
  );
};
