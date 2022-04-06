import React from 'react';
import type { WalletType } from '@dialectlabs/react';
import Chat from '../Chat';

interface InboxProps {
  wallet: WalletType;
  contentClassName?: string;
  wrapperClassName?: string;
}

const Inbox = (props: InboxProps) => {
  return <Chat inbox {...props} />;
};

export default Inbox;
