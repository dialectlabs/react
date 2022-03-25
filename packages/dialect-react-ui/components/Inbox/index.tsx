import React from 'react';
import Chat from '../Chat';
import type { WalletType } from '@dialectlabs/react';

interface InboxProps {
  wallet: WalletType;
}

const Inbox = (props: InboxProps) => {
  return <Chat inbox />;
};

export default Inbox;
