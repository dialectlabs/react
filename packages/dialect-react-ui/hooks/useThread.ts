import { useMemo } from 'react';
import type { ThreadId } from '@dialectlabs/sdk';
import { useThread as useThreadInternal } from '@dialectlabs/react-sdk';
import serializeThreadId from '../utils/serializeThreadId';

const useThread = (threadId: ThreadId) => {
  const findParams = useMemo(
    () => ({ id: threadId }),
    [serializeThreadId(threadId)]
  );

  // TODO: handle threadAddress null
  const threadContext = useThreadInternal({ findParams });
  return threadContext;
};

export default useThread;
