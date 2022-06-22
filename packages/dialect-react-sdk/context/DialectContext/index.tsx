import type { Config } from '@dialectlabs/sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { DialectConnectionInfo } from './ConnectionInfo';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';
import { DialectWallet } from './Wallet';

export interface DialectContextType {
  dapp?: string;
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
  const { wallet } = config;

  const ctx = useMemo(
    (): DialectContextType => ({
      dapp: dapp,
    }),
    [dapp]
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
          <DialectConnectionInfo.Provider initialState={config.backends}>
            <LocalMessages.Provider>{children}</LocalMessages.Provider>
          </DialectConnectionInfo.Provider>
        </DialectSdk.Provider>
      </DialectWallet.Provider>
    </DialectContext.Provider>
  );
};
