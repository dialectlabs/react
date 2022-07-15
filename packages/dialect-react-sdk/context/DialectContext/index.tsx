import type { PublicKey } from '@solana/web3.js';
import React from 'react';
import type { Config, DialectWalletAdapter } from '../../types';
import { DialectConnectionInfo } from './ConnectionInfo';
import { DialectDapp } from './Dapp';
import { DialectGate, Gate } from './Gate';
import { LocalMessages } from './LocalMessages';
import { DialectSdk } from './Sdk';
import { DialectUnreadMessages } from './UnreadMessages';
import { DialectWallet } from './Wallet';

export const DialectContext = React.createContext<null>(null);

type DialectContextProviderProps = {
  config: Config;
  wallet: DialectWalletAdapter;
  dapp?: PublicKey;
  gate?: Gate;
  // temporary until new dialect cloud api appear
};

export const DialectContextProvider: React.FC<DialectContextProviderProps> = ({
  config,
  wallet,
  dapp,
  gate,
  children,
}) => {
  return (
    <DialectContext.Provider value={null}>
      <DialectWallet.Provider initialState={wallet}>
        <DialectSdk.Provider initialState={config}>
          <DialectGate.Provider initialState={gate}>
            <DialectDapp.Provider initialState={dapp}>
              <DialectConnectionInfo.Provider initialState={config.backends}>
                <DialectUnreadMessages.Provider>
                  <LocalMessages.Provider>{children}</LocalMessages.Provider>
                </DialectUnreadMessages.Provider>
              </DialectConnectionInfo.Provider>
            </DialectDapp.Provider>
          </DialectGate.Provider>
        </DialectSdk.Provider>
      </DialectWallet.Provider>
    </DialectContext.Provider>
  );
};
