import { Backend, Config } from '@dialectlabs/sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { EMPTY_ARR } from '../../utils';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';
import { DialectWallet } from './Wallet';

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
  connected: DialectConnectionInfo;
  dapp?: string;

  _updateConnectionInfo(
    fn: (prevInfo: DialectConnectionInfo) => DialectConnectionInfo
  ): void;
}

export const DialectContext = React.createContext<DialectContextType>(
  {} as DialectContextType
);

type DialectContextProviderProps = {
  config: Config;
  dapp?: string; // temporary until new dialect cloud api appear
};

export const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  config,
  dapp,
  children,
}) => {
  const { wallet, backends = EMPTY_ARR } = config;
  // TODO move to a sep container
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
      setConnectionInfo((prev) => {
        if (prev.wallet.connected && Boolean(wallet.publicKey)) {
          return prev;
        }
        if (!prev.wallet.connected && !Boolean(wallet.publicKey)) {
          return prev;
        }
        return {
          ...prev,
          wallet: {
            ...prev.wallet,
            connected: Boolean(wallet.publicKey),
          },
        };
      });
    },
    [wallet]
  );

  const ctx = useMemo(
    (): DialectContextType => ({
      connected: connectionInfo,
      dapp: dapp,

      _updateConnectionInfo: setConnectionInfo,
    }),
    [connectionInfo, dapp]
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
      <DialectWallet.Provider initialState={wallet}>
        <DialectSdk.Provider initialState={config}>
          <LocalMessages.Provider>{children}</LocalMessages.Provider>
        </DialectSdk.Provider>
      </DialectWallet.Provider>
    </DialectContext.Provider>
  );
};
