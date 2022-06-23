import type { PublicKey } from '@solana/web3.js';
import React, { useEffect, useMemo, useState } from 'react';
import type { Config, DialectWalletAdapter } from '../../types';
import { DialectConnectionInfo } from './ConnectionInfo';
import { DialectDapp } from './Dapp';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';
import { DialectWallet } from './Wallet';

export interface DialectContextType {
  dapp?: object;
}

export const DialectContext = React.createContext<DialectContextType>(
  {} as DialectContextType
);

type DialectContextProviderProps = {
  config: Config;
  wallet: DialectWalletAdapter;
  dapp?: PublicKey;
  // temporary until new dialect cloud api appear
};

export const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  config,
  wallet,
  dapp,
  children,
}) => {
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
          <DialectDapp.Provider initialState={dapp}>
            <DialectConnectionInfo.Provider initialState={config.backends}>
              <LocalMessages.Provider>{children}</LocalMessages.Provider>
            </DialectConnectionInfo.Provider>
          </DialectDapp.Provider>
        </DialectSdk.Provider>
      </DialectWallet.Provider>
    </DialectContext.Provider>
  );
};
