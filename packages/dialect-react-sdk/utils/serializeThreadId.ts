import type { ThreadId } from '@dialectlabs/sdk';

const serializeThreadId = (threadId?: ThreadId) => {
  if (!threadId) {
    return '';
  }
  return [threadId?.backend, threadId.address.toBase58()].join(':');
};

export default serializeThreadId;
