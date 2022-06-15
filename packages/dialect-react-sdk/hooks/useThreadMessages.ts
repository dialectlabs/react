import type { DialectSdkError, Message, Thread } from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import useSWR from 'swr';
import { useDialectErrorsHandler } from '../context/DialectContext/errors';
import { EMPTY_ARR } from '../utils';
import useThread from './useThread';

const CACHE_KEY = (addr: PublicKey) => `MESSAGES_${addr.toString()}`;

interface UseThreadMessagesParams {
  address: PublicKey;
  refreshInterval?: number;
}

interface UseThreadMessagesValue {
  // sdk
  messages: Message[];

  // react-lib
  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
}

const useThreadMessages = ({
  address,
  refreshInterval,
}: UseThreadMessagesParams): UseThreadMessagesValue => {
  const { thread } = useThread({
    findParams: {
      address,
    },
  });
  const threadInternal = thread as Thread | null;

  const {
    data: messages = EMPTY_ARR,
    isValidating: isFetchingMessages,
    error: errorFetchingMessages,
  } = useSWR(
    threadInternal ? CACHE_KEY(threadInternal.address) : null,
    () => threadInternal!.messages(),
    { refreshInterval, refreshWhenOffline: true }
  );

  useDialectErrorsHandler(errorFetchingMessages);

  return {
    messages,

    isFetchingMessages,
    errorFetchingMessages,
  };
};

export default useThreadMessages;
