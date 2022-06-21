import { Backend, Config, Dialect, DialectSdk } from '@dialectlabs/sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { EMPTY_ARR } from '../../utils';
import { LocalMessages } from './LocalMessages';

interface DialectBackendConnectionInfo {
  connected: boolean;
  shouldConnect: boolean;
}

interface DialectConnectionInfo {
  wallet: DialectBackendConnectionInfo;
  solana: DialectBackendConnectionInfo;
  dialectCloud: DialectBackendConnectionInfo;
}

export interface DialectContextType {
  sdk?: DialectSdk | null;
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
  backends = EMPTY_ARR,
  dapp,
  children,
}) => {
  const sdk = useMemo(() => {
    if (!wallet.publicKey) return null;
    return Dialect.sdk({
      environment,
      wallet,
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
    });
  }, [
    environment,
    wallet,
    solana,
    dialectCloud,
    encryptionKeysStore,
    backends,
  ]);

  const [connectionInfo, setConnectionInfo] = useState<DialectConnectionInfo>(
    () => ({
      wallet: {
        connected: Boolean(wallet.publicKey),
        shouldConnect: true,
      },
      solana: {
        connected: Boolean(backends.includes(Backend.Solana)),
        shouldConnect: Boolean(backends.includes(Backend.Solana)),
      },
      dialectCloud: {
        connected: Boolean(backends.includes(Backend.DialectCloud)),
        shouldConnect: Boolean(backends.includes(Backend.DialectCloud)),
      },
    })
  );

  useEffect(
    function updateWalletConnectionInfo() {
      setConnectionInfo((prev) => ({
        ...prev,
        wallet: {
          ...prev.wallet,
          connected: Boolean(wallet.publicKey),
        },
      }));
    },
    [wallet]
  );

  const ctx = useMemo(
    (): DialectContextType => ({
      sdk: sdk,
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
