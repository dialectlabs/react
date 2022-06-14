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
import { ParsedErrorData, ParsedErrorType } from '../../utils/errors';
import {
  connected,
  getMessageHash,
  extractWalletAdapter,
  isAnchorWallet,
} from '../../utils/helpers';
import { Message, Member } from '@dialectlabs/web3';
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
  pollingInterval?: number;
};

type SendingMessagesMap = Record<string, Message[]> | Record<string, never>;

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
  sendingMessagesMap: SendingMessagesMap;
  sendingMessages: Message[];
  cancelSendingMessage: (id: string) => void;
  dialect: DialectAccount | undefined | null;
  dialects: DialectAccount[];
  setDialectAddress: (dialectAddress: string) => void;
  dialectAddress: string | null;
  sendMessage: (
    text: string,
    encrypted?: boolean,
    id?: number
  ) => Promise<void>;
  sendingMessage: boolean;
  isMessagesReady: boolean;
  sendMessageError: ParsedErrorData | null;
  isWritable: boolean;
  checkUnreadMessages: (threadId: string) => boolean;
};

const DialectContext = createContext<DialectContextType | null>(null);

const POLLING_INTERVAL_MS = 1000;

const getNull = () => null;

const mergeMessageToDialect = (
  dialect: DialectAccount,
  message?: MessageType
) => ({
  ...dialect,
  dialect: {
    ...dialect.dialect,
    messages: [
      message,
      ...dialect.dialect.messages.filter(
        (message: Message) => !message.isSending
      ),
    ].filter((m: Message) => Boolean(m)),
  },
});

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

  const { wallet, program, walletName, getLastReadMessage } = useApi();
  const isWalletConnected = connected(wallet);
  const [messages, setMessages] = React.useState<Message[]>([]);
  // Using isMessagesReady flag to show the correct messages after they fetched for selected thread
  const [isMessagesReady, setIsMessagesReady] = React.useState(false);
  const [sendingMessagesMap, setSendingMessagesMap] =
    React.useState<SendingMessagesMap>({});

  const [encryptionProps, setEncryptionProps] =
    React.useState<EncryptionProps | null>(null);

  const pollingInterval = props.pollingInterval || POLLING_INTERVAL_MS;

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
      refreshInterval: pollingInterval,
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
      refreshInterval: pollingInterval,
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
      refreshInterval: pollingInterval,
    }
  );

  useEffect(() => {
    if (program && props.publicKey) {
      getDialectAddressWithOtherMember(
        program as anchor.Program,
        props.publicKey
      ).then(([address, _]: [anchor.web3.PublicKey, number]) => {
        setDialectAddress(address.toBase58());
      });
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
    if (!wallet || !dialect?.dialect) return;
    const dialectMessages = dialect.dialect.messages;
    const messagesWithoutIds = messages.map(({ id, ...m }) => m);
    const hasNewMessage =
      // TODO: maybe refactor with clever mutateDialect, could be a perf issue with hash for long arrays?
      messagesWithoutIds.length !== dialectMessages.length ||
      getMessageHash(dialectMessages) !== getMessageHash(messagesWithoutIds);

    setIsMessagesReady(true);

    if (!hasNewMessage) return;
    // Set id on clients side to use in animations, because there is no id in message protocol right now. TODO: remove
    const messagesWithIds = dialect.dialect.messages.map(
      (m: Message, idx: number) => ({
        ...m,
        id:
          // Using anti-index to avoid updating id every time new message appears, cause we use reverted order
          getMessageHash(m.text) + (dialect.dialect.messages.length - 1 - idx),
      })
    );
    setMessages(messagesWithIds);
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

      await mutateDialects(
        dialects?.filter(
          (d) => dialect?.publicKey.toBase58() === d?.publicKey.toBase58()
        )
      );
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

  const pushOrUpdateSending = useCallback(
    (dialectAddress: string, payload: Message | null, messageId?: string) => {
      setSendingMessagesMap((map: SendingMessagesMap) => {
        const thread = map[dialectAddress] || [];

        // If there's no messages sending and payload is not null — set sending list to this message
        if (!thread || !thread?.length) {
          return {
            ...map,
            [dialectAddress]: payload !== null ? [payload] : thread,
          };
        }

        // If message id passed and there is no payload, remove message with such id from sending list
        if (messageId && payload == null) {
          return {
            ...map,
            [dialectAddress]: thread.filter((m) => m.id !== messageId),
          };
        }

        const isMessageExists = thread.find((m: Message) => m.id === messageId);

        // If there is messsage with such id, merge payload with it
        // If there is no message with such id, just append payload to sending list
        return {
          ...map,
          [dialectAddress]: isMessageExists
            ? thread.map((m: Message) =>
                m.id === messageId ? { ...m, ...payload } : m
              )
            : [...thread, payload],
        };
      });
    },
    []
  );

  const cancelSendingMessage = useCallback(
    (id: string) => {
      pushOrUpdateSending(dialectAddress, null, id);
    },
    [pushOrUpdateSending, dialectAddress]
  );

  const sendMessageWrapper = useCallback(
    async (text: string, encrypted = false, messageId?: string) => {
      if (!program || !isWalletConnected || !dialect) return;

      setSendingMessage(true);
      // TODO: pure id
      const id = messageId || getMessageHash(text) + messages.length;

      try {
        if (messageId) {
          pushOrUpdateSending(
            dialectAddress,
            {
              error: undefined,
              isSending: true,
            },
            id
          );
        } else {
          const messageMock = {
            id,
            text,
            owner: wallet?.publicKey,
            isSending: true,
          };
          pushOrUpdateSending(dialectAddress, messageMock, id);
        }

        const newMessage = await sendMessage(
          program,
          dialect,
          text,
          encrypted ? await getEncryptionProps() : null
        );

        await mutateDialect(mergeMessageToDialect(dialect, newMessage), false);
        pushOrUpdateSending(dialectAddress, null, id);
      } catch (e) {
        // TODO: implement safer error handling
        setSendMessageError(e as ParsedErrorData);

        pushOrUpdateSending(dialectAddress, { isSending: false, error: e }, id);

        // Passing through the error, in case for additional UI error handling
        throw e;
      } finally {
        setSendingMessage(false);
      }
    },
    [
      pushOrUpdateSending,
      getEncryptionProps,
      isWalletConnected,
      program,
      dialect,
      dialectAddress,
      wallet?.publicKey,
      mutateDialect,
      messages,
    ]
  );

  const setDialectAddressWrapper = useCallback((address: string) => {
    setDialectAddress(address);
    // Hide messages on selecting another thread to avoid weird animation
    setMessages([]);
    setSendingMessage(false);
    setIsMessagesReady(false);
    setDeleting(false);
  }, []);

  const sendingMessages = sendingMessagesMap[dialectAddress]
    ? sendingMessagesMap[dialectAddress]
    : [];

  const checkUnreadMessages = (threadId: string) => {
    const lastReadMessage = getLastReadMessage(threadId);
    return lastReadMessage !== messages[0]?.timestamp && messages.length > 0;
  };

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
    isMessagesReady,
    messages,
    sendingMessagesMap,
    sendingMessages,
    cancelSendingMessage,
    dialect,
    dialects: dialects || [],
    isNoMessages: messages?.length === 0,
    dialectAddress,
    setDialectAddress: setDialectAddressWrapper,
    sendMessage: sendMessageWrapper,
    sendingMessage,
    sendMessageError,
    checkUnreadMessages,
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
