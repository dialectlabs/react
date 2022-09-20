import {
  Backend,
  DialectSdkError,
  SendMessageCommand as DialectSdkSendMessageCommand,
  Thread,
  ThreadId,
  ThreadMessage as SdkThreadMessage,
} from '@dialectlabs/sdk';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { LocalMessages } from '../context/DialectContext/LocalMessages';
import type { LocalThreadMessage, ThreadMessage } from '../types';
import { EMPTY_ARR } from '../utils';
import {
  CACHE_KEY_MESSAGES_FN,
  CACHE_KEY_THREAD_SUMMARY_FN,
  CACHE_KEY_THREADS,
} from './internal/swrCache';
import useThread from './useThread';
import { nanoid } from 'nanoid';

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
    const localThreadMessages =
      localMessages[thread.id.toString()] || EMPTY_ARR;

    const filteredLocalMessages = localThreadMessages.filter((lm) => {
      const remoteMessage = remoteMessages.find(
        (rm) => rm.deduplicationId === lm.deduplicationId
      );

      if (remoteMessage) {
        deleteLocalMessage(thread.id.toString(), lm.deduplicationId);
      }

      return !remoteMessage;
    });

    const messageArray =
      thread?.backend === Backend.DialectCloud
        ? [...remoteMessages, ...filteredLocalMessages]
        : remoteMessages;

    return messageArray
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map((m) => ({
        ...m,
        deduplicationId: m.deduplicationId ?? m.timestamp.getTime().toString(),
      }));
  }, [remoteMessages, thread, localMessages, deleteLocalMessage]);

  const onChainSendMessage = useCallback(
    async (t: Thread, cmd: Omit<SendMessageCommand, 'deduplicationId'>) => {
      setErrorSendingMessage(null);
      setIsSendingMessage(true);

      try {
        await t.send(cmd);
        mutate();
        // Mutate threads to update threads sort
        globalMutate(CACHE_KEY_THREADS);
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorSendingMessage(e);
        }
        throw e;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [globalMutate, mutate]
  );

  const offChainSendMessage = useCallback(
    async (t: Thread, cmd: SendMessageCommand) => {
      setIsSendingMessage(true);
      setErrorSendingMessage(null);
      const threadAddr = t.id.toString();
      const deduplicationId = cmd.deduplicationId ?? nanoid();
      const optimisticMessage: LocalThreadMessage = {
        deduplicationId,
        text: cmd.text,
        timestamp: new Date(),
        author: t.me,
        isSending: true,
      };
      try {
        putLocalMessage(threadAddr, optimisticMessage);
        await t.send({ ...cmd, deduplicationId });
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
    [globalMutate, mutate, putLocalMessage]
  );

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!threadInternal) return;

      const sendMessageFn =
        threadInternal.backend === Backend.DialectCloud
          ? offChainSendMessage
          : onChainSendMessage;

      await sendMessageFn(threadInternal, cmd);
    },
    [threadInternal, offChainSendMessage, onChainSendMessage]
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
