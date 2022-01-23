import * as anchor from '@project-serum/anchor';
import { AnchorWallet, WalletContextState } from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { idl, programs } from '@dialectlabs/web3';

export const connected = (wallet: WalletType): boolean => {
  return (wallet || false) && ('connected' in wallet ? wallet?.connected : true);
};

type PropsType = {
  children: JSX.Element;
};

export type WalletType = WalletContextState | AnchorWallet | null | undefined;
export type ProgramType = anchor.Program | null;

type ValueType = {
    wallet: WalletType;
    setWallet: (_: WalletType) => void;
    program: anchor.Program | null;
}

const ApiContext = createContext<ValueType | null>(null);

export const ApiContextProvider = (props: PropsType): JSX.Element => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const [program, setProgram] = useState<ProgramType>(null);
  const value = {
    wallet,
    setWallet,
    program,
  };
  useEffect(() => {
    if (connected(wallet)) {
      console.log('CONNECTED', wallet);
      const connection = new Connection('https://api.devnet.solana.com', 'recent'); // TODO: Set this via props?
      const provider = new anchor.Provider(
        connection,
        wallet as anchor.Wallet, // TODO: Check that this cast is acceptable
        anchor.Provider.defaultOptions(),
      );
      anchor.setProvider(provider);
      const program = new anchor.Program(
        idl as anchor.Idl,
        programs['devnet'].programAddress, // TODO: Set network via props?
      );
      setProgram(program);
    } else {
      console.log('DISCONNECTED', wallet);
      setProgram(null);
    }
  }, [connected(wallet)]);
  return (
    <ApiContext.Provider value={value}>{props.children}</ApiContext.Provider>
  );
};

export function useApi(): ValueType {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useCount must be used within a WalletContextProvider');
  }
  return context;
}
