import React from 'react';

import { Bell } from '../components/Bell';
import { WalletContext, Wallet } from '../components/Wallet';

function AuthedHome() {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-row justify-end p-2 items-center space-x-2'>
        <Bell />
        <Wallet />
      </div>
      <div className='h-full text-4xl flex flex-col justify-center'>
        <div className='text-center'>ngmi.biz</div>
      </div>
    </div>
  );
}

export default function Home() {
  // console.log('Wallet', Wallet);
  return (
    <WalletContext>
      <AuthedHome />
    </WalletContext>
  );
}
