import { CreateThreadCommand, DialectSdkError, Thread } from '@dialectlabs/sdk';
import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/errors';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import useDialectSdk from './useDialectSdk';

const CACHE_KEY = 'THREADS';

interface UseThreadsParams {
  refreshInterval?: number;
}

interface UseThreadsValue {
  // sdk
  threads: Thread[];
  create(command: CreateThreadCommand): Promise<Thread>;
  // react
  isFetchingThreads: boolean;
  errorFetchingThreads: DialectSdkError | null;
  isCreatingThread: boolean;
  errorCreatingThread: DialectSdkError | null;
}

const useThreads = ({
  refreshInterval,
}: UseThreadsParams = EMPTY_OBJ): UseThreadsValue => {
  const { threads: threadsApi } = useDialectSdk();

  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [errorCreatingThread, setErrorCreatingThread] =
    useState<DialectSdkError | null>(null);

  const {
    data: threads = EMPTY_ARR,
    isValidating: isFetchingThreads,
    error: errorFetchingThreads,
    mutate,
  } = useSWR(CACHE_KEY, () => threadsApi.findAll(), {
    refreshInterval,
  });

  useEffect(
    function invalidateThreads() {
      mutate();
    },
    [mutate, threadsApi]
  );

  useDialectErrorsHandler(errorFetchingThreads, errorCreatingThread);

  const createThread = useCallback(
    async (cmd: CreateThreadCommand) => {
      setIsCreatingThread(true);
      setErrorCreatingThread(null);
      try {
        return await threadsApi.create(cmd);
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorCreatingThread(e);
        }
        throw e;
      } finally {
        setIsCreatingThread(false);
      }
    },
    [threadsApi]
  );

  return {
    threads,
    create: createThread,

    isFetchingThreads,
    errorFetchingThreads,
    isCreatingThread,
    errorCreatingThread,
  };
};

export default useThreads;
