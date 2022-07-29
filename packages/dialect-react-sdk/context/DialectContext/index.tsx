import type { PublicKey } from '@solana/web3.js';
import React from 'react';
import type { Config, DialectWalletAdapter } from '../../types';
import { DialectConnectionInfo } from './ConnectionInfo';
import { DialectDapp } from './Dapp';
import { DialectGate, Gate } from './Gate';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';
import { DialectWallet } from './Wallet';

export const DialectContext = React.createContext<null>(null);

type DialectContextProviderProps = {
  config: Config;
  wallet: DialectWalletAdapter;
  dapp?: PublicKey;
  gate?: Gate;
  autoConnect?: boolean;
  children?: React.ReactNode;
};

export const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  config,
  wallet,
  dapp,
  autoConnect,
  gate,
  children,
}) => {
  return (
    <DialectContext.Provider value={null}>
      <DialectWallet.Provider initialState={{ adapter: wallet, autoConnect }}>
        <DialectSdk.Provider initialState={config}>
          <DialectGate.Provider initialState={gate}>
            <DialectDapp.Provider initialState={dapp}>
              <DialectConnectionInfo.Provider initialState={config.backends}>
                <LocalMessages.Provider>{children}</LocalMessages.Provider>
              </DialectConnectionInfo.Provider>
            </DialectDapp.Provider>
          </DialectGate.Provider>
        </DialectSdk.Provider>
      </DialectWallet.Provider>
    </DialectContext.Provider>
  );
};
