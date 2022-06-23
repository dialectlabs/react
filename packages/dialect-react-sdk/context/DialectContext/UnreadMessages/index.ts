import type { ThreadId } from '@dialectlabs/sdk';
import { createContainer } from '../../../utils/container';
import {
  InMemoryUnreadDMessagesStorage,
  LastSeenThreadDateStorage,
} from './storage';

export interface UnreadMessagesState {
  saveLastSeenDate: (thread: ThreadId, date: Date) => Promise<void>;
  getLastSeenDate: (thread: ThreadId) => Promise<Date>;
}

function useUnreadMessages(
  storage: LastSeenThreadDateStorage = new InMemoryUnreadDMessagesStorage()
): UnreadMessagesState {
  return { getLastSeenDate: storage.get, saveLastSeenDate: storage.put };
}

export const DialectUnreadMessages = createContainer(useUnreadMessages);
