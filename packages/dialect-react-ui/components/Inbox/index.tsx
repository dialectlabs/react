import { WalletIdentityProvider } from '@cardinal/namespaces-components';
import Chat from '../Chat';

interface InboxProps {
  dialectId: string;
  contentClassName?: string;
  wrapperClassName?: string;
}

const Inbox = (props: InboxProps) => {
  return (
    <WalletIdentityProvider>
      <Chat type="inbox" {...props} />
    </WalletIdentityProvider>
  );
};

export default Inbox;
