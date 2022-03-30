import React from 'react';
import Chat from '../Chat';
import type { WalletType } from '@dialectlabs/react';

interface InboxProps {
  wallet: WalletType;
  contentClassName?: string;
  wrapperClassName: string;
}

const Inbox = (props: InboxProps) => {
  return <Chat inbox {...props} />;
};

export default Inbox;
