import { DialectUnreadMessages } from '../context/DialectContext/UnreadMessages';

const useUnreadMessages = () => {
  const unreadMessages = DialectUnreadMessages.useContainer();
  return unreadMessages;
};

export default useUnreadMessages;
