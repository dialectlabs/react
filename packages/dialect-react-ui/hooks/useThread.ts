import { useMemo } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useThread as useThreadInternal } from '@dialectlabs/react-sdk';

const useThread = (threadId: string) => {
  const threadAddress = useMemo(() => {
    try {
      return threadId ? new PublicKey(threadId) : null;
    } catch (e) {
      return null;
    }
  }, [threadId]);

  const findParams = useMemo(
    () => ({ address: threadAddress }),
    [threadAddress]
  );

  // TODO: handle threadAddress null
  const threadContext = useThreadInternal({ findParams });
  return threadContext;
};

export default useThread;
