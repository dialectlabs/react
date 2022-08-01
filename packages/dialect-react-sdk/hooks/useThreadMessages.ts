import {
  DialectSdkError,
  ThreadMessage as SdkThreadMessage,
  SendMessageCommand as DialectSdkSendMessageCommand,
  Thread,
  ThreadId,
} from '@dialectlabs/sdk';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { LocalMessages } from '../context/DialectContext/LocalMessages';
import type { LocalThreadMessage, ThreadMessage } from '../types';
import { EMPTY_ARR } from '../utils';
import {
  CACHE_KEY_MESSAGES_FN,
  CACHE_KEY_THREADS,
  CACHE_KEY_THREAD_SUMMARY_FN,
} from './internal/swrCache';
import useThread from './useThread';

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
  messages: LocalThreadMessage[];

  // react-lib
  send(command: SendMessageCommand): Promise<void>;
  cancel(cmd: CancelMessageCommand): Promise<void>;
  setLastReadMessageTime(time: Date): Promise<void>;

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
  const { mutate: globalMutate } = useSWRConfig();

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
  } = useSWR<SdkThreadMessage[], DialectSdkError>(
    threadInternal ? CACHE_KEY_MESSAGES_FN(threadInternal.id.toString()) : null,
    () => threadInternal!.messages(),
    { refreshInterval, refreshWhenOffline: true }
  );

  const messages: ThreadMessage[] = useMemo(() => {
    if (!thread) {
      return EMPTY_ARR;
    }
    let merged = false;
    const localThreadMessages =
      localMessages[thread.id.toString()] || EMPTY_ARR;
    const [firstRemote] = remoteMessages;
    const [firstLocal] = localThreadMessages;
    // we check if we can replace last local message with the remote one
    if (firstLocal?.text === firstRemote?.text && firstLocal?.isSending) {
      deleteLocalMessage(thread.id.toString(), firstLocal.id);
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
  }, [remoteMessages, thread, localMessages, deleteLocalMessage]);

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!threadInternal) return;
      setIsSendingMessage(true);
      setErrorSendingMessage(null);
      const threadAddr = threadInternal.id.toString();
      const optimisticMessage: LocalThreadMessage = {
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
        // Mutate threads to update threads sort
        globalMutate(CACHE_KEY_THREADS);
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
    [threadInternal, messages.length, putLocalMessage, mutate, globalMutate]
  );

  const cancelMessage = useCallback(
    async ({ id }: CancelMessageCommand) => {
      if (!thread) return;
      deleteLocalMessage(thread.id.toString(), id);
    },
    [thread, deleteLocalMessage]
  );

  useDialectErrorsHandler(errorFetchingMessages, errorSendingMessage);

  const setLastReadMessageTime = useCallback(
    async (time: Date) => {
      if (!thread) return;
      await thread.setLastReadMessageTime(time);
      globalMutate(
        CACHE_KEY_THREAD_SUMMARY_FN(
          thread.otherMembers.map((it) => it.publicKey)
        )
      );
    },
    [globalMutate, thread]
  );

  return {
    messages,
    send: sendMessage,
    cancel: cancelMessage,
    setLastReadMessageTime,

    isFetchingMessages,
    errorFetchingMessages,
    isSendingMessage,
    errorSendingMessage,
  };
};

export default useThreadMessages;
