import type { DialectSdkError, Message } from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import { NOOP } from '../../../utils';
import { createContainer } from '../../../utils/container';

export interface LocalMessage extends Message {
  id: string;
  isSending?: boolean;
  error?: DialectSdkError | null;
}

interface LocalMessagesState {
  localMessages: Record<string, LocalMessage[]>;
  putLocalMessage: (threadAddr: string, msg: LocalMessage) => void;
  deleteLocalMessage: (threadAddr: string, id: string) => void;
}

function useLocalMessages(
  initialState: LocalMessagesState = {
    localMessages: {},
    putLocalMessage: NOOP,
    deleteLocalMessage: NOOP,
  }
): LocalMessagesState {
  const [localMessages, setLocalMessages] = useState<
    LocalMessagesState['localMessages']
  >(initialState.localMessages);

  const putLocalMessage = useCallback(
    (threadAddr: string, msg: LocalMessage) => {
      setLocalMessages((prev) => {
        const threadMessages = prev[threadAddr];
        if (!threadMessages) {
          return {
            ...prev,
            [threadAddr]: [msg],
          };
        }

        return {
          ...prev,
          [threadAddr]: [
            ...threadMessages.filter((prevMsg) => prevMsg.id !== msg.id),
            msg,
          ],
        };
      });
    },
    []
  );

  const deleteLocalMessage = useCallback((threadAddr: string, id: string) => {
    console.log('delete local message');

    setLocalMessages((prev) => {
      const threadMessages = prev[threadAddr];
      if (!threadMessages) {
        return {
          ...prev,
          [threadAddr]: [],
        };
      }
      return {
        ...prev,
        [threadAddr]: threadMessages.filter((prevMsg) => prevMsg.id !== id),
      };
    });
  }, []);

  return { localMessages, putLocalMessage, deleteLocalMessage };
}

export const LocalMessages = createContainer(useLocalMessages);
