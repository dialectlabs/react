import {
  DialectSdkError,
  Message,
  SendMessageCommand,
  Thread,
} from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import useDialectSdk from './useDialectSdk';

// TODO
type ThreadSearchParams = { address: PublicKey };
// | { twitterHandle: string }
// | { sns: string };

type UseThreadParams = ThreadSearchParams;

interface UseThreadValue {
  // sdk
  thread: Omit<Thread, 'messages' | 'send' | 'delete'> | null;

  send(command: SendMessageCommand): Promise<void>;
  delete(): Promise<void>;

  // react-lib
  isFetchingThread: boolean;
  errorFetchingThread: DialectSdkError | null;
  isSendingMessage: boolean;
  errorSendingMessage: DialectSdkError | null;
  isDeletingThread: boolean;
  errorDeletingThread: DialectSdkError | null;
}
// TODO: caching
// TODO: refresh interval
const useThread = ({ address }: UseThreadParams): UseThreadValue => {
  const { threads: threadsApi } = useDialectSdk();

  const [thread, setThread] = useState<Thread | null>(null);

  const [isFetchingThread, setIsFetchingThread] = useState<boolean>(false);
  const [errorFetchingThread, setErrorFetchingThread] =
    useState<DialectSdkError | null>(null);
  const [isSendingMessage, setIsSendingMessage] = useState<boolean>(false);
  const [errorSendingMessage, setErrorSendingMessage] =
    useState<DialectSdkError | null>(null);
  const [isDeletingThread, setIsDeletingThread] = useState<boolean>(false);
  const [errorDeletingThread, setErrorDeletingThread] =
    useState<DialectSdkError | null>(null);

  const fetchThread = useCallback(async () => {
    setIsFetchingThread(true);
    setErrorFetchingThread(null);
    try {
      const thread = await threadsApi.find({ address });
      setThread(thread);
      return thread;
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorFetchingThread(e);
      }
      throw e;
    } finally {
      setIsFetchingThread(false);
    }
  }, [address, threadsApi]);

  const deleteThread = useCallback(async () => {
    if (!thread) return;
    setIsDeletingThread(true);
    setErrorDeletingThread(null);
    try {
      return await thread.delete();
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorDeletingThread(e);
      }
      throw e;
    } finally {
      setIsDeletingThread(false);
    }
  }, [thread]);

  const sendMessage = useCallback(
    async (cmd: SendMessageCommand) => {
      if (!thread) return;
      setIsSendingMessage(true);
      setErrorSendingMessage(null);
      try {
        return await thread.send(cmd);
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorSendingMessage(e);
        }
        throw e;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [thread]
  );

  useEffect(
    function loadThreads() {
      fetchThread();
    },
    [fetchThread]
  );

  return {
    // sdk
    thread,
    send: sendMessage,
    delete: deleteThread,

    // react-lib
    isFetchingThread,
    errorFetchingThread,
    isSendingMessage,
    errorSendingMessage,
    isDeletingThread,
    errorDeletingThread,
  };
};

export default useThread;
