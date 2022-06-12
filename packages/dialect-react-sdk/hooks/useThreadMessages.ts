import { DialectSdkError, Message, Thread } from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import useThread from './useThread';

interface UseThreadMessagesParams {
  address: PublicKey;
  refreshInterval?: number | null;
}

interface UseThreadMessagesValue {
  // sdk
  messages: Message[];

  // react-lib
  isFetchingMessages: boolean;
  errorFetchingMessages: DialectSdkError | null;
}

// TODO: caching
// TODO: polling
const useThreadMessages = ({
  address,
}: UseThreadMessagesParams): UseThreadMessagesValue => {
  const { thread } = useThread({
    findParams: {
      address,
    },
  });
  const threadInternal = thread as Thread | null;

  const [messages, setMessages] = useState<Message[]>([]);

  const [isFetchingMessages, setIsFetchingMessages] = useState<boolean>(false);
  const [errorFetchingMessages, setErrorFetchingMessages] =
    useState<DialectSdkError | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!threadInternal) return;
    setIsFetchingMessages(true);
    setErrorFetchingMessages(null);
    try {
      const messages = await threadInternal.messages();
      setMessages(messages);
      return messages;
    } catch (e) {
      if (e instanceof DialectSdkError) {
        setErrorFetchingMessages(e);
      }
      throw e;
    } finally {
      setIsFetchingMessages(false);
    }
  }, [threadInternal]);

  useEffect(
    function loadMessages() {
      fetchMessages();
    },
    [fetchMessages]
  );

  return {
    messages,

    isFetchingMessages,
    errorFetchingMessages,
  };
};

export default useThreadMessages;
