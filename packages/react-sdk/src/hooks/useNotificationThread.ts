import { CreateThreadCommand } from '@dialectlabs/sdk';
import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { useDialectContext } from '../context';
import { CACHE_KEY_THREAD_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface UseNotificationThreadParams {
  refreshInterval?: number;
}

const useNotificationThread = ({
  refreshInterval,
}: UseNotificationThreadParams = {}) => {
  const { threads: threadsApi } = useDialectSdk();
  const { dappAddress } = useDialectContext();

  const {
    data: thread,
    isLoading,
    error,
    mutate,
  } = useSWR(
    CACHE_KEY_THREAD_FN({ otherMembers: [dappAddress] }),
    () => threadsApi.find({ otherMembers: [dappAddress] }),
    {
      refreshInterval,
    },
  );

  const {
    trigger: createThread,
    isMutating: isCreatingThread,
    error: errorCreatingThread,
  } = useSWRMutation(
    CACHE_KEY_THREAD_FN({ otherMembers: [dappAddress] }),
    (_, { arg }: { arg: CreateThreadCommand }) => threadsApi.create(arg),
  );

  const {
    trigger: deleteThread,
    isMutating: isDeletingThread,
    error: errorDeletingThread,
  } = useSWRMutation(
    CACHE_KEY_THREAD_FN({ otherMembers: [dappAddress] }),
    async () => {
      await thread?.delete();
    },
  );

  return {
    thread: thread ?? null,
    isThreadLoading: isLoading,
    errorLoadingThread: error,
    refreshThread: mutate,

    // todo: consider splitting into atomic hooks?
    create: createThread,
    isCreatingThread,
    errorCreatingThread,

    delete: deleteThread,
    isDeletingThread,
    errorDeletingThread,
  };
};

export default useNotificationThread;
