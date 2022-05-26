import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
} from 'react';
import useSWR from 'swr';
import { useApi } from '../ApiContext';
import { createMetadata, DialectAccount, Metadata } from '@dialectlabs/web3';
import type * as anchor from '@project-serum/anchor';
import {
  createDialectForMembers,
  deleteDialect,
  deleteMetadata,
  fetchDialect,
  fetchDialects,
  fetchMetadata,
  getDialectAddressWithOtherMember,
  sendMessage,
} from '../../api';
import {
  noAccount,
  ParsedErrorData,
  ParsedErrorType,
} from '../../utils/errors';
import {
  connected,
  getMessageHash,
  extractWalletAdapter,
  isAnchorWallet,
} from '../../utils/helpers';
import type { Message, Member } from '@dialectlabs/web3';
import type SolWalletAdapter from '@project-serum/sol-wallet-adapter';
import type { BaseSolletWalletAdapter } from '@solana/wallet-adapter-sollet';
import type { EncryptionProps } from '@dialectlabs/web3/lib/es/api/text-serde';

const swrFetchDialect = async (
  _: string,
  program: anchor.Program,
  address: string,
  getEncryptionProps: () => Promise<EncryptionProps | null>
) => {
  return fetchDialect(program, address, await getEncryptionProps());
};

const swrFetchDialects = (
  _: string,
  ...args: Parameters<typeof fetchDialects>
) => fetchDialects(...args);

const swrFetchMetadata = (
  _: string,
  ...args: Parameters<typeof fetchMetadata>
) => fetchMetadata(...args);

type PropsType = {
  children: JSX.Element;
  publicKey?: anchor.web3.PublicKey;
};

// TODO: revisit api functions and errors to be moved out from context
type DialectContextType = {
  disconnectedFromChain: boolean;
  cannotDecryptDialect: boolean;
  isWalletConnected: boolean;
  // isMetadataAvailable: boolean;
  // createMetadata: () => Promise<void>;
  // isMetadataCreating: boolean;
  // metadataCreationError: ParsedErrorData | null;
  // deleteMetadata: () => Promise<void>;
  // isMetadataDeleting: boolean;
  // metadataDeletionError: ParsedErrorData | null;
  // metadata: Metadata | null;
  isDialectAvailable: boolean;
  createDialect: (
    publicKey?: string,
    scopes1?: [boolean, boolean],
    scopes2?: [boolean, boolean],
    encrypted?: boolean
  ) => Promise<void>;
  isDialectCreating: boolean;
  creationError: ParsedErrorData | null;
  deleteDialect: () => Promise<void>;
  isDialectDeleting: boolean;
  deletionError: ParsedErrorData | null;
  isNoMessages: boolean;
  messages: Message[];
  dialect: DialectAccount | undefined | null;
  dialects: DialectAccount[];
  setDialectAddress: (dialectAddress: string) => void;
  dialectAddress: string | null;
  sendMessage: (text: string, encrypted?: boolean) => Promise<void>;
  sendingMessage: boolean;
  sendMessageError: ParsedErrorData | null;
  isWritable: boolean;
};

const DialectContext = createContext<DialectContextType | null>(null);

const POLLING_INTERVAL_MS = 1000;

const getNull = () => null;

export const DialectProvider = (props: PropsType): JSX.Element => {
  const [metadataCreating, setMetadataCreating] = React.useState(false);
  const [creating, setCreating] = React.useState(false);
  const [dialectAddress, setDialectAddress] = React.useState('');

  const [metadataCreationError, setMetadataCreationError] =
    React.useState<ParsedErrorData | null>(null);
  const [creationError, setCreationError] =
    React.useState<ParsedErrorData | null>(null);

  const [metadataDeleting, setMetadataDeleting] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [deletionError, setDeletionError] =
    React.useState<ParsedErrorData | null>(null);
  const [metadataDeletionError, setMetadataDeletionError] =
    React.useState<ParsedErrorData | null>(null);

  const [disconnectedFromChain, setDisconnected] = React.useState(false);
  const [cannotDecryptDialect, setCannotDecryptDialect] = React.useState(false);

  const [sendingMessage, setSendingMessage] = React.useState(false);
  const [sendMessageError, setSendMessageError] =
    React.useState<ParsedErrorData | null>(null);

  const { wallet, program, walletName } = useApi();
  const isWalletConnected = connected(wallet);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const [encryptionProps, setEncryptionProps] =
    React.useState<EncryptionProps | null>(null);

  const getEncryptionProps =
    useCallback(async (): Promise<EncryptionProps | null> => {
      if (!wallet || isAnchorWallet(wallet) || walletName !== 'Sollet') {
        return null;
      }

      // If cached encrypted props exist, return them
      if (encryptionProps) {
        return encryptionProps;
      }

      const adapter: BaseSolletWalletAdapter = extractWalletAdapter(
        wallet
      ) as BaseSolletWalletAdapter;

      // TODO: needs to be improved with better tooling/solutions
      const solWalletAdapter: SolWalletAdapter =
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - accessing a protected property
        adapter._wallet as unknown as SolWalletAdapter;

      const publicKey = wallet.publicKey?.toBytes();

      if (!publicKey) {
        return null;
      }

      const keypair = await solWalletAdapter.diffieHellman(publicKey);
      const freshEncryptionProps = {
        diffieHellmanKeyPair: keypair,
        ed25519PublicKey: publicKey,
      };

      setEncryptionProps(freshEncryptionProps);
      return freshEncryptionProps;
    }, [encryptionProps, wallet, walletName]);

  useEffect(() => {
    if (!isWalletConnected) {
      setEncryptionProps(null);
    }
  }, [isWalletConnected]);

  const {
    data: metadata,
    mutate: mutateMetadata,
    error: fetchMetadataError,
  } = useSWR<Metadata | null, ParsedErrorData>(
    false && wallet && program ? ['metadata', program] : null,
    swrFetchMetadata,
    {
      refreshInterval: POLLING_INTERVAL_MS,
    }
  );

  const {
    data: dialects,
    mutate: mutateDialects,
    error: fetchDialectsError,
  } = useSWR<DialectAccount[], ParsedErrorData>(
    wallet && program && !props.publicKey?.toString()
      ? ['dialects', program, wallet?.publicKey?.toString()]
      : null,
    swrFetchDialects,
    {
      refreshInterval: POLLING_INTERVAL_MS,
    }
  );

  const dialectFromList = dialects?.find(
    (d) => d.publicKey.toBase58() === dialectAddress
  );

  const {
    data: dialect,
    mutate: mutateDialect,
    error: fetchError,
  } = useSWR<DialectAccount | null, ParsedErrorData>(
    wallet && program && dialectAddress
      ? [
          'dialect',
          program,
          dialectAddress,
          // Find the dialect from the fetched list and get the encrypted property
          // TODO: Definitely a subject for refactor
          dialectFromList?.dialect.encrypted ? getEncryptionProps : getNull,
        ]
      : null,
    swrFetchDialect,
    {
      refreshInterval: POLLING_INTERVAL_MS,
    }
  );

  useEffect(() => {
    if (program && props.publicKey) {
      getDialectAddressWithOtherMember(
        program as anchor.Program,
        props.publicKey
      ).then(([address, _]: [anchor.web3.PublicKey, number]) => {
            setDialectAddress(address.toBase58())
          }
      );
    }
    return;
  }, [program, props.publicKey]);

  useEffect(() => {
    const existingErrorType =
      fetchDialectsError?.type ??
      fetchError?.type ??
      fetchMetadataError?.type ??
      creationError?.type ??
      deletionError?.type;
    setCannotDecryptDialect(
      existingErrorType === ParsedErrorType.CannotDecrypt
    );
    setDisconnected(
      existingErrorType === ParsedErrorType.DisconnectedFromChain
    );
  }, [
    fetchDialectsError?.type,
    fetchMetadataError?.type,
    creationError?.type,
    deletionError?.type,
    fetchError?.type,
  ]);

  useEffect(() => {
    const hasNewMessage =
      wallet &&
      dialect?.dialect &&
      (messages.length !== dialect.dialect.messages.length ||
        // Could be there a performance issue to calc hash for long array?
        // TODO: maybe refactor with clever mutateDialect
        getMessageHash(dialect.dialect.messages) !== getMessageHash(messages));
    if (hasNewMessage) {
      setMessages(dialect.dialect.messages);
    }
  }, [wallet, dialect?.dialect, messages, messages.length]);

  useEffect(() => {
    // If there are some messages loaded, but wallet disconnected — erase them
    if (!isWalletConnected && messages.length) {
      setMessages([]);
      return;
    }
  }, [isWalletConnected, messages.length]);

  const createMetadataWrapper = useCallback(async () => {
    if (!program || !isWalletConnected || !wallet?.publicKey) {
      return;
    }

    setMetadataCreating(true);

    try {
      const data = await createMetadata(program, wallet as anchor.Wallet);

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

  const createDialectWrapper = useCallback(
    async (
      publicKey?: string,
      scopes1 = [true, false],
      scopes2 = [false, true],
      encrypted = false
    ) => {
      if (
        !program ||
        !isWalletConnected ||
        !wallet?.publicKey ||
        (!props.publicKey && !publicKey)
      ) {
        return;
      }

      setCreating(true);

      try {
        const data = await createDialectForMembers(
          program,
          wallet.publicKey?.toString(),
          props.publicKey?.toString() || publicKey,
          scopes1,
          scopes2,
          encrypted ? await getEncryptionProps() : null
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
    },
    [
      mutateDialect,
      program,
      props.publicKey,
      wallet?.publicKey,
      isWalletConnected,
      getEncryptionProps,
    ]
  );

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

  const sendMessageWrapper = useCallback(
    async (text: string, encrypted = false) => {
      if (!program || !isWalletConnected || !dialect) return;

      setSendingMessage(true);

      try {
        await sendMessage(
          program,
          dialect,
          text,
          encrypted ? await getEncryptionProps() : null
        );

        await mutateDialect(null);
      } catch (e) {
        // TODO: implement safer error handling
        setSendMessageError(e as ParsedErrorData);

        // Passing through the error, in case for additional UI error handling
        throw e;
      } finally {
        setSendingMessage(false);
      }
    },
    [getEncryptionProps, isWalletConnected, program, dialect, mutateDialect]
  );

  // const messages = mockMessages;
  const isWritable = dialect?.dialect.members.some(
    (m: Member) => m.publicKey.equals(wallet?.publicKey) && m.scopes[1] // is not admin but does have write privilages
  );
  const isDialectAvailable = Boolean(dialect);
  const isMetadataAvailable = Boolean(metadata);

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
    // TODO: handle if targeting cluster with no deployed program
    createDialect: createDialectWrapper,
    isDialectCreating: creating,
    creationError,
    deleteDialect: deleteDialectWrapper,
    isDialectDeleting: deleting,
    isWritable,
    deletionError,
    messages,
    dialect,
    dialects: dialects || [],
    isNoMessages: messages?.length === 0,
    dialectAddress,
    setDialectAddress,
    sendMessage: sendMessageWrapper,
    sendingMessage,
    sendMessageError,
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
export type { DialectAccount };
