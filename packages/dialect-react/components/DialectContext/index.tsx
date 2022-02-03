import React, { createContext, useContext } from 'react';
import {
  getDialectForMembers,
  createDialect,
  deleteDialect,
  Member,
} from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { useApi } from '../ApiContext';
import { messages as mockedMessages } from './mock';
import type { DialectAccount } from '@dialectlabs/web3';

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

const mutateDeleteDialect = async (
  _: string,
  program: anchor.Program,
  dialect: DialectAccount,
  ownerPKString: string
) => {
  const owner: Member = {
    publicKey: new anchor.web3.PublicKey(ownerPKString),
    scopes: [true, false], //
  };
  return await deleteDialect(program, dialect, owner);
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
  createDialect: () => void;
  isDialectCreating: boolean;
  deleteDialect: () => void;
  isDialectDeleting: boolean;
  isNoMessages: boolean;
  messages: Message[];
  notificationsThreadAddress: string | null;
};

const DialectContext = createContext<DialectContextType | null>(null);

export const DialectProvider = (props: PropsType): JSX.Element => {
  const [creating, setCreating] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

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

  useSWR(
    deleting
      ? ['dialect', program, dialect, wallet?.publicKey?.toString()]
      : null,
    mutateDeleteDialect,
    {
      onSuccess: (data) => {
        console.log('deleted dialect', data);
        mutateDialect(null);
        setDeleting(false);
      },
      onError: (error) => {
        console.log('error deleting dialect', error);
        setDeleting(false);
      },
    }
  );

  // TODO: useSWR to delete Dialect

  const messages = wallet && dialect?.dialect ? dialect.dialect.messages : [];
  const isWalletConnected = Boolean(wallet);
  const isDialectAvailable = Boolean(dialect);
  const notificationsThreadAddress =
    wallet && dialect?.publicKey ? dialect?.publicKey.toString() : null;

  // const isDialectAvailable = false;
  // const messages = mockedMessages;

  const value = {
    isWalletConnected,
    isDialectAvailable,
    createDialect: () => setCreating(true),
    isDialectCreating: creating,
    deleteDialect: () => setDeleting(true),
    isDialectDeleting: deleting,
    messages,
    isNoMessages: messages?.length === 0,
    notificationsThreadAddress,
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
