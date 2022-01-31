import React, { createContext, useContext } from 'react';
import { getDialectForMembers, createDialect, Member } from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { useApi } from '../ApiContext';
import { messages as mockedMessages } from './mock';

const fetchDialectForMembers = async (
  url: string,
  program: anchor.Program,
  pubkey1: string,
  pubkey2: string
) => {
  const member1: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey1),
    scopes: [true, false], //
  };
  const member2: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey2),
    scopes: [true, false], //
  };
  return await getDialectForMembers(
    program,
    [member1, member2],
    anchor.web3.Keypair.generate()
  );
};

const mutateDialectForMembers = async (
  _: string,
  program: anchor.Program,
  pubkey1: string,
  pubkey2: string
) => {
  const member1: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey1),
    scopes: [true, false], //
  };
  const member2: Member = {
    publicKey: new anchor.web3.PublicKey(pubkey2),
    scopes: [true, false], //
  };
  return await createDialect(program, program.provider.wallet, [
    member1,
    member2,
  ]);
};

interface Message {
  text: string;
  timestamp: number;
}

type PropsType = {
  children: JSX.Element;
  publicKey: anchor.web3.PublicKey;
};

type DialectContextType = {
  isWalletConnected: boolean;
  isDialectAvailable: boolean;
  isDialectCreating: boolean;
  createDialect: () => void;
  isNoMessages: boolean;
  messages: Message[];
};

const DialectContext = createContext<DialectContextType | null>(null);

export const DialectProvider = (props: PropsType): JSX.Element => {
  const [creating, setCreating] = React.useState(false);
  const { wallet, program } = useApi();

  const { data: dialect, mutate: mutateDialect } = useSWR(
    wallet && program
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
    fetchDialectForMembers
  );

  useSWR(
    creating
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
    mutateDialectForMembers,
    {
      onSuccess: (data) => {
        console.log('created dialect', data);
        mutateDialect(data);
        setCreating(false);
      },
      onError: (error) => {
        console.log('error creating dialect', error);
        setCreating(false);
      },
    }
  );

  const messages = wallet && dialect?.dialect ? dialect.dialect.messages : [];
  const isWalletConnected = Boolean(wallet);
  const isDialectAvailable = Boolean(dialect);

  // const isDialectAvailable = false;
  // const messages = mockedMessages;

  const value = {
    isWalletConnected,
    isDialectAvailable,
    createDialect: () => setCreating(true),
    isDialectCreating: creating,
    messages,
    isNoMessages: messages?.length === 0,
  };

  return (
    <DialectContext.Provider value={value}>
      {props.children}
    </DialectContext.Provider>
  );
};

export function useDialect(): DialectContextType {
  const context = useContext(DialectContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}

export type MessageType = Message;
