import type { WalletType } from '@dialectlabs/react';
import Chat from '../Chat';
import { WalletIdentityProvider } from '@cardinal/namespaces-components';

interface InboxProps {
  wallet: WalletType;
  contentClassName?: string;
  wrapperClassName?: string;
}

const Inbox = (props: InboxProps) => {
  return (
    <WalletIdentityProvider>
      <Chat inbox {...props} />
    </WalletIdentityProvider>
  );
};

export default Inbox;
