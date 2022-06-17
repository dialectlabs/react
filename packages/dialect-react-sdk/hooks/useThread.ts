import { DialectSdkError, Thread } from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/errors';
import { EMPTY_ARR } from '../utils';
import { isAdminable, isWritable } from '../utils/scopes';
import useDialectSdk from './useDialectSdk';
import { CACHE_KEY as THREADS_CACHE_KEY } from './useThreads';

const CACHE_KEY = 'THREAD';

// TODO
type ThreadSearchParams =
  | { address: PublicKey }
  | { otherMembers: PublicKey[] };
// | { twitterHandle: string }
// | { sns: string };

type UseThreadParams = {
  findParams: ThreadSearchParams;
  refreshInterval?: number;
};

interface UseThreadValue {
  // sdk
  thread: Omit<Thread, 'messages' | 'send' | 'delete'> | null;

  delete(): Promise<void>;

  // react-lib
  isFetchingThread: boolean;
  errorFetchingThread: DialectSdkError | null;
  isDeletingThread: boolean;
  errorDeletingThread: DialectSdkError | null;
  isWritable: boolean;
  isAdminable: boolean;
}

const useThread = ({
  findParams,
  refreshInterval,
}: UseThreadParams): UseThreadValue => {
  const { mutate } = useSWRConfig();
  const { threads: threadsApi } = useDialectSdk();

  const [isDeletingThread, setIsDeletingThread] = useState<boolean>(false);
  const [errorDeletingThread, setErrorDeletingThread] =
    useState<DialectSdkError | null>(null);

  const {
    data: thread = null,
    isValidating: isFetchingThread,
    error: errorFetchingThread,
  } = useSWR(
    [CACHE_KEY, findParams],
    (_, findParams) => threadsApi.find(findParams),
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  useDialectErrorsHandler(errorFetchingThread, errorDeletingThread);

  const deleteThread = useCallback(async () => {
    if (!thread) return;
    setIsDeletingThread(true);
    setErrorDeletingThread(null);
    try {
      const result = await thread.delete();
      mutate(CACHE_KEY);
      mutate(THREADS_CACHE_KEY);
      return result;
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorDeletingThread(e);
      }
      throw e;
    } finally {
      setIsDeletingThread(false);
    }
  }, [mutate, thread]);

  return {
    // sdk
    thread,
    delete: deleteThread,

    // react-lib
    isFetchingThread,
    errorFetchingThread,
    isDeletingThread,
    errorDeletingThread,
    isWritable: isWritable(thread?.me.scopes || EMPTY_ARR),
    isAdminable: isAdminable(thread?.me.scopes || EMPTY_ARR),
  };
};

export default useThread;
