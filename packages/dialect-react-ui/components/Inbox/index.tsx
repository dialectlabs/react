import Chat from '../Chat';

interface InboxProps {
  dialectId: string;
  contentClassName?: string;
  wrapperClassName?: string;
}

const Inbox = (props: InboxProps) => {
  return <Chat type="inbox" {...props} />;
};

export default Inbox;
