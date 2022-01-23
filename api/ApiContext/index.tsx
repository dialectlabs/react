import * as anchor from '@project-serum/anchor';
import { AnchorWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { createContext, useContext, useEffect, useState } from 'react';

export const connected = (wallet: WalletType): boolean => {
  return (wallet || false) && ('connected' in wallet ? wallet?.connected : true);
};

type PropsType = {
  children: JSX.Element;
};

export type WalletType = WalletContextState | AnchorWallet | null | undefined;

type ValueType = {
    wallet: WalletType;
    setWallet: (_: WalletType) => void;
}

const ApiContext = createContext<ValueType | null>({
    wallet: null,
    setWallet: (_: WalletType) => { _; },
});

export const ApiContextProvider = (props: PropsType): JSX.Element => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const value = {
    wallet,
    setWallet,
  };
  useEffect(() => {
    if (connected(wallet)) {
      console.log('CONNECTED', wallet);
    } else {
      console.log('DISCONNECTED', wallet);
    }
  }, [connected(wallet)]);
  return (
    <ApiContext.Provider value={value}>{props.children}</ApiContext.Provider>
  );
};

export function useApi(): ValueType {
  const context = useContext(ApiContext) as ValueType;
  if (context === undefined) {
    throw new Error('useCount must be used within a WalletContextProvider');
  }
  return context;
}
