import { useCallback, useState } from 'react';
import type { LocalMessage } from '../../../types';
import { createContainer } from '../../../utils/container';

interface LocalMessagesState {
  localMessages: Record<string, LocalMessage[]>;
  putLocalMessage: (threadAddr: string, msg: LocalMessage) => void;
  deleteLocalMessage: (threadAddr: string, id: string) => void;
}

function useLocalMessages(): LocalMessagesState {
  const [localMessages, setLocalMessages] = useState<
    LocalMessagesState['localMessages']
  >({});

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
            msg,
            ...threadMessages.filter((prevMsg) => prevMsg.id !== msg.id),
          ],
        };
      });
    },
    []
  );

  const deleteLocalMessage = useCallback((threadAddr: string, id: string) => {
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
