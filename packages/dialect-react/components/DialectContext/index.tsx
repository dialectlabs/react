import { Wallet } from '@project-serum/anchor/src/provider';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import useSWR from 'swr';
import * as anchor from '@project-serum/anchor';
import { connected, useApi } from '../ApiContext';
import { createMetadata, DialectAccount, Metadata } from '@dialectlabs/web3';
import {
  createDialectForMembers,
  deleteDialect,
  deleteMetadata,
  fetchDialectForMembers,
  fetchMetadata,
} from '../../api';
import { ParsedErrorData, ParsedErrorType } from '../../utils/errors';
import { messages as mockMessages } from './mock';

const swrFetchDialect = (
  _: string,
  ...args: Parameters<typeof fetchDialectForMembers>
) => fetchDialectForMembers(...args);

const swrFetchMetadata = (
  _: string,
  ...args: Parameters<typeof fetchMetadata>
) => fetchMetadata(...args);

interface Message {
  text: string;
  timestamp: number;
}

type PropsType = {
  children: JSX.Element;
  publicKey: anchor.web3.PublicKey;
};

// TODO: revisit api functions and errors to be moved out from context
type DialectContextType = {
  disconnectedFromChain: boolean;
  cannotDecryptDialect: boolean;
  isWalletConnected: boolean;
  isMetadataAvailable: boolean; // done
  createMetadata: () => Promise<void>;
  isMetadataCreating: boolean;
  metadataCreationError: ParsedErrorData | null;
  deleteMetadata: () => Promise<void>;
  isMetadataDeleting: boolean;
  metadataDeletionError: ParsedErrorData | null;
  metadata: Metadata | null; // done
  isDialectAvailable: boolean;
  createDialect: () => Promise<void>;
  isDialectCreating: boolean;
  creationError: ParsedErrorData | null;
  deleteDialect: () => Promise<void>;
  isDialectDeleting: boolean;
  deletionError: ParsedErrorData | null;
  isNoMessages: boolean;
  messages: Message[];
  notificationsThreadAddress: string | null;
};

const DialectContext = createContext<DialectContextType | null>(null);

const POLLING_INTERVAL_MS = 1000;

export const DialectProvider = (props: PropsType): JSX.Element => {
  const [metadataCreating, setMetadataCreating] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [
    fetchingError,
    setFetchingError,
  ] = React.useState<ParsedErrorData | null>(null);
  const [
    metadataCreationError,
    setMetadataCreationError,
  ] = React.useState<ParsedErrorData | null>(null);
  const [
    creationError,
    setCreationError,
  ] = React.useState<ParsedErrorData | null>(null);

  const [metadataDeleting, setMetadataDeleting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [
    deletionError,
    setDeletionError,
  ] = React.useState<ParsedErrorData | null>(null);
  const [
    metadataDeletionError,
    setMetadataDeletionError,
  ] = React.useState<ParsedErrorData | null>(null);

  const [disconnectedFromChain, setDisconnected] = React.useState(false);
  const [cannotDecryptDialect, setCannotDecryptDialect] = React.useState(false);

  const { wallet, program } = useApi();
  const isWalletConnected = connected(wallet);

  const {
    data: metadata,
    mutate: mutateMetadata,
    error: fetchMetadataError,
  } = useSWR<Metadata | null, ParsedErrorData>(
    wallet && program ? ['metadata', program] : null,
    swrFetchMetadata,
    {
      refreshInterval: POLLING_INTERVAL_MS,
      onError: (err) => {
        console.log('error fetching metadata', err);
        setFetchingError(err as ParsedErrorData);
      },
    }
  );

  const { data: dialect, mutate: mutateDialect, error: fetchError } = useSWR<
    DialectAccount | null,
    ParsedErrorData
  >(
    wallet && program
      ? [
          'dialect',
          program,
          wallet?.publicKey?.toString(),
          props.publicKey.toString(),
        ]
      : null,
    swrFetchDialect,
    {
      refreshInterval: POLLING_INTERVAL_MS,
      onError: (err) => {
        console.log('error fetching', err);
        setFetchingError(err as ParsedErrorData);
      },
    }
  );

  useEffect(() => {
    const existingErrorType =
      fetchingError?.type ??
      fetchError?.type ??
      creationError?.type ??
      deletionError?.type;

    setCannotDecryptDialect(
      existingErrorType === ParsedErrorType.CannotDecrypt
    );
    setDisconnected(
      existingErrorType === ParsedErrorType.DisconnectedFromChain
    );
  }, [
    fetchingError?.type,
    creationError?.type,
    deletionError?.type,
    fetchError?.type,
  ]);

  const createMetadataWrapper = useCallback(async () => {
    if (!program || !isWalletConnected || !wallet?.publicKey) {
      return;
    }

    setMetadataCreating(true);

    try {
      const data = await createMetadata(program, wallet as Wallet);

      await mutateMetadata(data, false);
      setMetadataCreationError(null);
    } catch (e) {
      // TODO: implement safer error handling
      setMetadataCreationError(e as ParsedErrorData);

      // Passing through the error, in case for additional UI error handling
      throw e;
    } finally {
      setMetadataCreating(false);
    }
  }, [mutateMetadata, program, wallet, isWalletConnected]);

  const createDialectWrapper = useCallback(async () => {
    if (!program || !isWalletConnected || !wallet?.publicKey) {
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
      setCreationError(e as ParsedErrorData);

      // Passing through the error, in case for additional UI error handling
      throw e;
    } finally {
      setCreating(false);
    }
  }, [
    mutateDialect,
    program,
    props.publicKey,
    wallet?.publicKey,
    isWalletConnected,
  ]);

  const deleteMetadataWrapper = useCallback(async () => {
    if (!program || !isWalletConnected || !metadata) {
      return;
    }

    setMetadataDeleting(true);

    try {
      await deleteMetadata(program);

      await mutateMetadata(null);
      setMetadataDeletionError(null);
    } catch (e) {
      // TODO: implement safer error handling
      setDeletionError(e as ParsedErrorData);

      // Passing through the error, in case for additional UI error handling
      throw e;
    } finally {
      setDeleting(false);
    }
  }, [metadata, mutateMetadata, program, isWalletConnected]);

  const deleteDialectWrapper = useCallback(async () => {
    if (!program || !isWalletConnected || !dialect || !wallet?.publicKey) {
      return;
    }

    setDeleting(true);

    try {
      await deleteDialect(program, dialect, wallet.publicKey?.toString());

      await mutateDialect(null);
      setDeletionError(null);
    } catch (e) {
      // TODO: implement safer error handling
      setDeletionError(e as ParsedErrorData);

      // Passing through the error, in case for additional UI error handling
      throw e;
    } finally {
      setDeleting(false);
    }
  }, [dialect, mutateDialect, program, wallet?.publicKey, isWalletConnected]);

  const messages = wallet && dialect?.dialect ? dialect.dialect.messages : [];
  // const messages = mockMessages;
  const isDialectAvailable = Boolean(dialect);
  const isMetadataAvailable = Boolean(metadata);
  const notificationsThreadAddress =
    wallet && dialect?.publicKey ? dialect?.publicKey.toString() : null;

  const value = {
    disconnectedFromChain,
    cannotDecryptDialect,
    isWalletConnected,
    isMetadataAvailable,
    createMetadata: createMetadataWrapper,
    isMetadataCreating: metadataCreating,
    metadataCreationError,
    deleteMetadata: deleteMetadataWrapper,
    isMetadataDeleting: metadataDeleting,
    metadataDeletionError,
    metadata: metadata || null, // TODO: Fix type
    isDialectAvailable,
    createDialect: createDialectWrapper,
    isDialectCreating: creating,
    creationError,
    deleteDialect: deleteDialectWrapper,
    isDialectDeleting: deleting,
    deletionError,
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
