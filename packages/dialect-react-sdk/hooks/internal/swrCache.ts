import type { FindThreadQuery } from '@dialectlabs/sdk';

export const CACHE_KEY_THREADS = 'THREADS';

export const CACHE_KEY_THREAD_FN = (findParams: FindThreadQuery): string => {
  const prefix = 'THREAD_';
  if ('id' in findParams) {
    return prefix + findParams.id.toString();
  }
  if ('otherMembers' in findParams) {
    return (
      prefix +
      findParams.otherMembers
        .filter((it) => it)
        .map((it) => it.toString())
        .join(':')
    );
  }
  throw new Error('should never happen');
};

export const CACHE_KEY_MESSAGES = (id: string) => `MESSAGES_${id}`;
