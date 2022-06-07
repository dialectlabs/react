import ThreadPage from '../ThreadPage/';
import { useChatInternal } from '../../provider';

const Main = () => {
  const { type, onChatClose } = useChatInternal();
  const inbox = type === 'inbox';

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <ThreadPage
        inbox={inbox}
        onModalClose={onChatClose}
        onNewThreadClick={() => setNewThreadOpen(true)}
      />
    </div>
  );
};

export default Main;
