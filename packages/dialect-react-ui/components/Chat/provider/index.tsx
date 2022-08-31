import { createContext, FunctionComponent, useContext } from 'react';

// We are duplicating this type in order to have separation of concern: it may be different to what we have in props
type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface ChatContextValue {
  dialectId: string;
  type: ChatType;
  onChatClose?: () => void;
  onChatOpen?: () => void;
  pollingInterval?: number;
}

interface ChatProviderProps {
  dialectId: string;
  type: ChatType;
  onChatClose?: () => void;
  onChatOpen?: () => void;
  pollingInterval?: number;
}

export const DEFAULT_POLLING_INTERVAL = 2000;

export const ChatContext = createContext<ChatContextValue | null>(null);

export const ChatProvider: FunctionComponent<ChatProviderProps> = ({
  children,
  pollingInterval = DEFAULT_POLLING_INTERVAL,
  ...props
}) => {
  return (
    <ChatContext.Provider value={{ ...props, pollingInterval }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChatInternal = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error('useChatInternal must be used within ChatProvider');
  }

  return context;
};
