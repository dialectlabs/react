import { CreateThreadCommand, DialectSdkError, Thread } from '@dialectlabs/sdk';
import { useCallback, useEffect, useState } from 'react';
import useSWR, { useSWRConfig } from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/ConnectionInfo/errors';
import { EMPTY_ARR, EMPTY_OBJ } from '../utils';
import { CACHE_KEY_THREADS, CACHE_KEY_THREAD_FN } from './internal/swrCache';
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

const useThreads = ({
  refreshInterval,
}: UseThreadsParams = EMPTY_OBJ): UseThreadsValue => {
  const { threads: threadsApi } = useDialectSdk();
  const { mutate: globalMutate } = useSWRConfig();

  const [isCreatingThread, setIsCreatingThread] = useState<boolean>(false);
  const [errorCreatingThread, setErrorCreatingThread] =
    useState<DialectSdkError | null>(null);

  const {
    data: threads = EMPTY_ARR,
    isValidating: isFetchingThreads,
    error: errorFetchingThreads,
    mutate,
  } = useSWR(CACHE_KEY_THREADS, () => threadsApi.findAll(), {
    refreshInterval,
    refreshWhenOffline: true,
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
        const res = await threadsApi.create(cmd);
        await mutate();
        await globalMutate(CACHE_KEY_THREAD_FN({ id: res.id }), res);
        await globalMutate(
          CACHE_KEY_THREAD_FN({
            otherMembers: cmd.otherMembers.map((it) => it.publicKey),
          }),
          res
        );
        return res;
      } catch (e) {
        if (e instanceof DialectSdkError) {
          setErrorCreatingThread(e);
        }
        throw e;
      } finally {
        setIsCreatingThread(false);
      }
    },
    [threadsApi, mutate, globalMutate]
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
