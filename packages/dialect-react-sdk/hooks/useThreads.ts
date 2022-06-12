import { CreateThreadCommand, DialectSdkError, Thread } from '@dialectlabs/sdk';
import { useCallback, useEffect, useState } from 'react';
import { EMPTY_OBJ } from '../utils';
import useDialectSdk from './useDialectSdk';

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

// TODO: refresh interval
const useThreads = (params: UseThreadsParams = EMPTY_OBJ): UseThreadsValue => {
  const { threads: threadsApi } = useDialectSdk();

  const [threads, setThreads] = useState<Thread[]>([]);
  const [isFetchingThreads, setIsFetchingThreads] = useState<boolean>(false);
  const [errorFetchingThreads, setErrorFetchingThreads] =
    useState<DialectSdkError | null>(null);
  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [errorCreatingThread, setErrorCreatingThread] =
    useState<DialectSdkError | null>(null);

  const fetchThreads = useCallback(async () => {
    setIsFetchingThreads(true);
    setErrorFetchingThreads(null);
    try {
      const threads = await threadsApi.findAll();
      setThreads(threads);
      return threads;
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorFetchingThreads(e);
      }
      throw e;
    } finally {
      setIsFetchingThreads(false);
    }
  }, [threadsApi]);

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

  useEffect(
    function loadThreads() {
      fetchThreads();
    },
    [fetchThreads]
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
