import {
  DialectSdkError,
  Message as SdkMessage,
  SendMessageCommand as DialectSdkSendMessageCommand,
  Thread,
  ThreadId,
} from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import { useCallback, useMemo, useState } from 'react';
import useSWR from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { LocalMessages } from '../context/DialectContext/LocalMessages';
import type { LocalMessage, Message } from '../types';
import { EMPTY_ARR } from '../utils';
import serializeThreadId from '../utils/serializeThreadId';
import useThread from './useThread';

const CACHE_KEY = (id: string) => `MESSAGES_${id}`;

interface SendMessageCommand extends DialectSdkSendMessageCommand {
  id?: string;
}

interface CancelMessageCommand {
  id: string;
}

interface UseThreadMessagesParams {
  id: ThreadId;
  refreshInterval?: number;
}

interface UseThreadMessagesValue {
  // sdk
  messages: LocalMessage[];

  // react-lib
  send(command: SendMessageCommand): Promise<void>;
  cancel(cmd: CancelMessageCommand): Promise<void>;

  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
  isSendingMessage: boolean;
  errorSendingMessage: DialectSdkError | null;
}

const useThreadMessages = ({
  id,
  refreshInterval,
}: UseThreadMessagesParams): UseThreadMessagesValue => {
  const { thread } = useThread({
    findParams: {
      id,
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
  } = useSWR<SdkMessage[], DialectSdkError>(
    threadInternal ? CACHE_KEY(serializeThreadId(threadInternal.id)) : null,
    () => threadInternal!.messages(),
    { refreshInterval, refreshWhenOffline: true }
  );

  const messages: Message[] = useMemo(() => {
    if (!thread) {
      return EMPTY_ARR;
    }
    const threadIdStr = serializeThreadId(thread.id);
    let merged = false;
    const localThreadMessages = localMessages[threadIdStr] || EMPTY_ARR;
    const [firstRemote] = remoteMessages;
    const [firstLocal] = localThreadMessages;
    // we check if we can replace last local message with the remote one
    if (firstLocal?.text === firstRemote?.text && firstLocal?.isSending) {
      deleteLocalMessage(threadIdStr, firstLocal.id);
      merged = true;
    }

    const mergedMessages = [
      ...remoteMessages,
      ...(merged ? localThreadMessages.slice(1) : localThreadMessages),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map((msg, idx, arr) => ({
        ...msg,
        id: (arr.length - idx - 1).toString(),
      }));
    return mergedMessages;
  }, [remoteMessages, thread, localMessages]);

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!threadInternal) return;
      setIsSendingMessage(true);
      setErrorSendingMessage(null);
      const threadAddr = serializeThreadId(threadInternal.id);
      const optimisticMessage: LocalMessage = {
        id: cmd.id || messages.length.toString(),
        text: cmd.text,
        timestamp: new Date(),
        author: threadInternal.me,
        isSending: true,
      };
      try {
        putLocalMessage(threadAddr, optimisticMessage);
        await threadInternal.send(cmd);
        mutate();
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
    [deleteLocalMessage, mutate, putLocalMessage, threadInternal, messages]
  );

  const cancelMessage = useCallback(
    async ({ id }: CancelMessageCommand) => {
      if (!thread) return;
      deleteLocalMessage(serializeThreadId(thread.id), id);
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