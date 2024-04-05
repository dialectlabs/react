import {
  DialectSdkError,
  SendMessageCommand as DialectSdkSendMessageCommand,
  ThreadMessage as SdkThreadMessage,
  Thread,
  ThreadId,
} from '@dialectlabs/sdk';
import { nanoid } from 'nanoid';
import { useCallback, useMemo, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { LocalMessages } from '../context/DialectContext/LocalMessages';
import type { LocalThreadMessage } from '../types';
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
  markAsRead(): Promise<void>;

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
    data: remoteMessages,
    error: errorFetchingMessages = null,
    mutate,
  } = useSWR<SdkThreadMessage[], DialectSdkError>(
    threadInternal ? CACHE_KEY_MESSAGES_FN(threadInternal.id.toString()) : null,
    () => threadInternal!.messages(),
    { refreshInterval, refreshWhenOffline: true },
  );

  const messages: LocalThreadMessage[] | null = useMemo(() => {
    let messageArray: SdkThreadMessage[] = [];

    if (!thread) {
      return null;
    }

    const localThreadMessages = localMessages[thread.id.toString()];

    const filteredLocalMessages = localThreadMessages?.filter((lm) => {
      const remoteMessage = remoteMessages?.find(
        (rm) => rm.deduplicationId === lm.deduplicationId,
      );

      if (remoteMessage) {
        deleteLocalMessage(thread.id.toString(), lm.deduplicationId);
      }

      return !remoteMessage;
    });

    // If both local and remote messages have not been fetched yet return null to keep accurate `isFetching` state
    if (!filteredLocalMessages && !remoteMessages) {
      return null;
    }

    // If there are remote messages add them to the `messageArray`
    if (remoteMessages) {
      messageArray = messageArray.concat(remoteMessages);
    }

    // If there are local messages add them to the `messageArray` as well
    if (filteredLocalMessages) {
      messageArray = messageArray.concat(filteredLocalMessages);
    }

    return messageArray
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .map((m) => ({
        ...m,
        deduplicationId: m.deduplicationId ?? m.timestamp.getTime().toString(),
      }));
  }, [remoteMessages, thread, localMessages, deleteLocalMessage]);

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
    [globalMutate, mutate, putLocalMessage],
  );

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!threadInternal) return;

      const sendMessageFn = offChainSendMessage;

      await sendMessageFn(threadInternal, cmd);
    },
    [threadInternal, offChainSendMessage],
  );

  const cancelMessage = useCallback(
    async ({ id }: CancelMessageCommand) => {
      if (!thread) return;
      deleteLocalMessage(thread.id.toString(), id);
    },
    [thread, deleteLocalMessage],
  );

  const markAsRead = useCallback(async () => {
    if (!threadInternal) return;
    await threadInternal.markAsRead();
    globalMutate(
      CACHE_KEY_THREAD_SUMMARY_FN(
        threadInternal.otherMembers.map((it) => it.address),
      ),
    );
  }, [globalMutate, threadInternal]);

  return {
    messages: messages || EMPTY_ARR,
    send: sendMessage,
    cancel: cancelMessage,
    markAsRead,

    // Do not use `isValidating` since it will produce visual flickering
    isFetchingMessages: !messages && !errorFetchingMessages,
    errorFetchingMessages,
    isSendingMessage,
    errorSendingMessage,
  };
};

export default useThreadMessages;
