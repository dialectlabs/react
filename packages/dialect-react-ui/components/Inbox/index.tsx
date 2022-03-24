import React from 'react';
import Chat from '../Chat';
import { WalletType } from '@dialectlabs/react';

interface InboxProps {
  wallet: WalletType;
}

const Inbox = (props: InboxProps) => {
  return <Chat />;
};

export default Inbox;
