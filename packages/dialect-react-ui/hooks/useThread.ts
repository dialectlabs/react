import { useMemo } from 'react';
import type { ThreadId } from '@dialectlabs/sdk';
import { useThread as useThreadInternal } from '@dialectlabs/react-sdk';

const useThread = (threadId: ThreadId) => {
  const id = useMemo(
    () => threadId,
    [threadId.address.toBase58(), threadId?.backend]
  );
  const findParams = useMemo(() => ({ id }), [id]);

  // TODO: handle threadAddress null
  const threadContext = useThreadInternal({ findParams });
  return threadContext;
};

export default useThread;
