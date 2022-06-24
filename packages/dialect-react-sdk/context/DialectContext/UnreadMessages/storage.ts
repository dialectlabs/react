import type { ThreadId } from '@dialectlabs/sdk';

const EPOCH = new Date(0);

export interface LastSeenThreadDateStorage {
  put(thread: ThreadId, ts: Date): Promise<void>;
  get(thread: ThreadId): Promise<Date>;
}

export class InMemoryUnreadDMessagesStorage
  implements LastSeenThreadDateStorage
{
  readonly unreadMessages: Record<string, Date> = {};

  async put(thread: ThreadId, ts: Date): Promise<void> {
    this.unreadMessages[thread.toString()] = ts;
  }

  async get(thread: ThreadId): Promise<Date> {
    return this.unreadMessages[thread.toString()] || EPOCH;
  }
}

const LOCAL_STORAGE_KEY = 'dialectLastSeenThreadDateStorage';

type LocalStorageData = { version: number; data: Record<string, number> };

export class LocalStorageUreadMessagesStorage
  implements LastSeenThreadDateStorage
{
  readonly version = 1;

  async put(thread: ThreadId, ts: Date): Promise<void> {
    const rawData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) {
      window.localStorage.setItem(
        LOCAL_STORAGE_KEY,
        this.serializeDataObj({ [thread.toString()]: ts.getTime() })
      );
      return;
    }
    const deserializedData = this.deserializeDataObj(rawData);
    window.localStorage.setItem(
      LOCAL_STORAGE_KEY,
      this.serializeDataObj({
        ...deserializedData.data,
        [thread.toString()]: ts.getTime(),
      })
    );
  }
  async get(thread: ThreadId): Promise<Date> {
    const rawData = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!rawData) {
      return EPOCH;
    }
    const data = this.deserializeDataObj(rawData);
    return new Date(data.data[thread.toString()] || 0);
  }

  serializeDataObj(lastSeen: Record<string, number>) {
    return JSON.stringify({
      version: this.version,
      data: lastSeen,
    });
  }

  deserializeDataObj(data: string): LocalStorageData {
    try {
      return JSON.parse(data);
    } catch {
      return { version: this.version, data: {} };
    }
  }
}
