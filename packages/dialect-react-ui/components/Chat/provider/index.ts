import { createContext, useContext } from 'react';

// We are duplicating this type in order to have separation of concern: it may be different to what we have in props
type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface ChatContextValue {
  type: ChatType;
  onChatClose?: () => void;
  onChatOpen?: () => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export const useChatInternal = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatInternal must be used within ChatContext.Provider');
  }

  return context;
};
