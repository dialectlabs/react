import { DialectSdkError, FindThreadQuery, Thread } from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { EMPTY_ARR } from '../utils';
import { isAdminable, isWritable } from '../utils/scopes';
import useDialectSdk from './useDialectSdk';
import { CACHE_KEY as THREADS_CACHE_KEY } from './useThreads';

// TODO support multiple ways to resolve thread, eg. twitter, sns
type ThreadSearchParams = FindThreadQuery;

const CACHE_KEY = (findParams: ThreadSearchParams): string => {
  const prefix = 'THREAD_';
  if ('id' in findParams) {
    return prefix + findParams.id.toString();
  }
  if ('otherMembers' in findParams) {
    return (
      prefix +
      findParams.otherMembers
        .filter((it) => it)
        .map((it) => it.toString())
        .join(':')
    );
  }
  throw new Error('should never happen');
};

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
    data: thread = null,
    isValidating: isFetchingThread,
    error: errorFetchingThread,
    mutate: mutateThread,
  } = useSWR([CACHE_KEY(findParams)], () => threadsApi.find(findParams), {
    refreshInterval,
    refreshWhenOffline: true,
  });

  useDialectErrorsHandler(errorFetchingThread, errorDeletingThread);

  const deleteThread = useCallback(async () => {
    if (!thread) return;
    setIsDeletingThread(true);
    setErrorDeletingThread(null);
    try {
      const result = await thread.delete();
      mutateThread();
      globalMutate(THREADS_CACHE_KEY);
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
