import { useMemo } from 'react';
import type { ThreadId } from '@dialectlabs/sdk';
import { useThread as useThreadInternal } from '@dialectlabs/react-sdk';

const useThread = (threadId: ThreadId) => {
  const findParams = useMemo(() => ({ id: threadId }), [threadId.toString()]);

  // TODO: handle threadAddress null
  const threadContext = useThreadInternal({ findParams });
  return threadContext;
};

export default useThread;
