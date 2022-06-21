import { Config, Dialect, DialectSdk } from '@dialectlabs/sdk';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { LocalMessages } from './LocalMessages';
import { PublicKey } from '@solana/web3.js';

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

const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  environment,
  wallet,
  solana,
  dialectCloud,
  encryptionKeysStore,
  backends,
  dapp,
  children,
}) => {
  const sdk = useMemo(
    () =>
      Dialect.sdk({
        environment,
        wallet,
        solana,
        dialectCloud,
        encryptionKeysStore,
        backends,
      }),
    // If wallet is really changed the publicKey would change, so we replace 'wallet' dep with 'wallet?.publicKey?.toBase58()'
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      environment,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      wallet?.publicKey?.toBase58(),
      solana,
      dialectCloud,
      encryptionKeysStore,
      backends,
    ]
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
      sdk,
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

export default DialectContextProvider;
