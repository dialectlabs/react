import React, { createContext, useCallback, useContext } from 'react';
import { getDialectForMembers, deleteDialect, Member } from '@dialectlabs/web3';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { useApi } from '../ApiContext';
import type { DialectAccount } from '@dialectlabs/web3';
import { createDialectForMembers } from '../../api';
import { ParsedError, withErrorParsing } from '../../utils/errors';

const fetchDialectForMembers = withErrorParsing(
  async (
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
  }
);

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
  creationError: ParsedError | null;
  deleteDialect: () => void;
  isDialectDeleting: boolean;
  isNoMessages: boolean;
  messages: Message[];
  notificationsThreadAddress: string | null;
};

const DialectContext = createContext<DialectContextType | null>(null);

const POLLING_INTERVAL_MS = 1000;

export const DialectProvider = (props: PropsType): JSX.Element => {
  const [creating, setCreating] = React.useState(false);
  const [creationError, setCreationError] = React.useState<ParsedError | null>(
    null
  );

  const [deleting, setDeleting] = React.useState(false);
  const [deletingError, setDeletingError] = React.useState<ParsedError | null>(
    null
  );

  const [disconnectedFromChain, setDisconnected] = React.useState(false);

  const { wallet, program } = useApi();

  const { data: dialect, mutate: mutateDialect } = useSWR<
    DialectAccount,
    ParsedError
  >(
    wallet && program
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
    fetchDialectForMembers,
    { refreshInterval: POLLING_INTERVAL_MS }
  );

  const createDialectWrapper = useCallback(async () => {
    if (!program || !wallet?.publicKey) {
      return;
    }

    setCreating(true);

    try {
      const data = await createDialectForMembers(
        program,
        wallet.publicKey?.toString(),
        props.publicKey.toString()
      );

      await mutateDialect(data, false);
      setCreationError(null);
    } catch (e) {
      // TODO: implement safer error handling
      setCreationError(e as ParsedError);

      // Passing through the error, in case for additional UI error handling
      throw e;
    } finally {
      setCreating(false);
    }
  }, [mutateDialect, program, props.publicKey, wallet?.publicKey]);

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
        setCreationError(null);
      },
      onError: (error) => {
        console.log('error deleting dialect', error);
        setDeleting(false);
      },
    }
  );

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
    createDialect: createDialectWrapper,
    isDialectCreating: creating,
    creationError,
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
    throw new Error('useDialect must be used within an DialectProvider');
  }
  return context;
}

export type MessageType = Message;
