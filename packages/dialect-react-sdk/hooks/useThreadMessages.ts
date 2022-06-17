import {
  DialectSdkError,
  Message,
  SendMessageCommand as DialectSdkSendMessageCommand,
  Thread,
} from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/errors';
import {
  LocalMessage,
  LocalMessages,
} from '../context/DialectContext/LocalMessages';
import { EMPTY_ARR } from '../utils';
import useThread from './useThread';

const CACHE_KEY = (addr: PublicKey) => `MESSAGES_${addr.toString()}`;

interface SendMessageCommand extends DialectSdkSendMessageCommand {
  id?: number;
}

interface CancelMessageCommand {
  id: number;
}

interface UseThreadMessagesParams {
  address: PublicKey;
  refreshInterval?: number;
}

interface UseThreadMessagesValue {
  // sdk
  messages: Message[];

  // react-lib
  send(command: SendMessageCommand): Promise<void>;
  cancel(cmd: CancelMessageCommand): Promise<void>;

  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
  isSendingMessage: boolean;
  errorSendingMessage: DialectSdkError | null;
}

const useThreadMessages = ({
  address,
  refreshInterval,
}: UseThreadMessagesParams): UseThreadMessagesValue => {
  const { thread } = useThread({
    findParams: {
      address,
    },
  });
  const threadInternal = thread as Thread | null;

  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [errorSendingMessage, setErrorSendingMessage] =
    useState<DialectSdkError | null>(null);

  const { localMessages, putLocalMessage, deleteLocalMessage } =
    LocalMessages.useContainer();

  const {
    data: remoteMessages = EMPTY_ARR,
    isValidating: isFetchingMessages,
    error: errorFetchingMessages = null,
    mutate,
  } = useSWR<Message[], DialectSdkError>(
    threadInternal ? CACHE_KEY(threadInternal.address) : null,
    () => threadInternal!.messages(),
    { refreshInterval, refreshWhenOffline: true }
  );

  const messages = useMemo(() => {
    return [
      ...remoteMessages,
      ...(thread
        ? localMessages[thread.address.toString()] || EMPTY_ARR
        : EMPTY_ARR),
    ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [remoteMessages, thread, localMessages]);

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!threadInternal) return;
      setIsSendingMessage(true);
      setErrorSendingMessage(null);
      const threadAddr = threadInternal.address.toString();
      const optimisticMessage: LocalMessage = {
        id: cmd.id || nanoid(),
        text: cmd.text,
        timestamp: new Date(),
        author: threadInternal.me,
        isSending: true,
      };
      try {
        putLocalMessage(threadAddr, optimisticMessage);
        await threadInternal.send(cmd);
        // Await mutate to delete localmessage only after remoteMessages were updated
        await mutate();
        deleteLocalMessage(threadAddr, optimisticMessage.id);
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorSendingMessage(e);
          putLocalMessage(threadAddr, {
            ...optimisticMessage,
            isSending: false,
            error: e,
          });
        }
        throw e;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [deleteLocalMessage, mutate, putLocalMessage, threadInternal]
  );

  const cancelMessage = useCallback(
    async ({ id }: CancelMessageCommand) => {
      if (!thread) return;
      deleteLocalMessage(thread.address.toString(), id);
    },
    [thread, deleteLocalMessage]
  );

  useDialectErrorsHandler(errorFetchingMessages, errorSendingMessage);

  return {
    messages,
    send: sendMessage,
    cancel: cancelMessage,

    isFetchingMessages,
    errorFetchingMessages,
    isSendingMessage,
    errorSendingMessage,
  };
};

export default useThreadMessages;
