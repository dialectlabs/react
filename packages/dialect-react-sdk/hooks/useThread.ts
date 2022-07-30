import { DialectSdkError, FindThreadQuery, Thread } from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { EMPTY_ARR } from '../utils';
import { isAdminable, isWritable } from '../utils/scopes';
import { CACHE_KEY_THREADS, CACHE_KEY_THREAD_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

// TODO support multiple ways to resolve thread, eg. twitter, sns
type ThreadSearchParams = FindThreadQuery;

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
  const { mutate: globalMutate } = useSWRConfig();
  const { threads: threadsApi } = useDialectSdk();

  const [isDeletingThread, setIsDeletingThread] = useState<boolean>(false);
  const [errorDeletingThread, setErrorDeletingThread] =
    useState<DialectSdkError | null>(null);

  const {
    data: thread,
    error: errorFetchingThread,
    mutate: mutateThread,
  } = useSWR(
    CACHE_KEY_THREAD_FN(findParams),
    () => threadsApi.find(findParams),
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
      mutateThread();
      globalMutate(CACHE_KEY_THREADS);
      return result;
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorDeletingThread(e);
      }
      throw e;
    } finally {
      setIsDeletingThread(false);
    }
  }, [globalMutate, mutateThread, thread]);

  return {
    // sdk
    thread: thread || null,
    delete: deleteThread,
    // react-lib
    isFetchingThread: thread === undefined && !errorFetchingThread,
    errorFetchingThread,
    isDeletingThread,
    errorDeletingThread,
    isWritable: isWritable(thread?.me.scopes || EMPTY_ARR),
    isAdminable: isAdminable(thread?.me.scopes || EMPTY_ARR),
  };
};

export default useThread;
