import React from 'react';
import { AnchorWallet } from '@solana/wallet-adapter-react';

type PropTypes = {
  wallet: AnchorWallet | undefined;
}
export default function NotificationCenter(props: PropTypes): JSX.Element {
  return (
    <div
      className='z-1000 bg-white h-full shadow-md p-4 rounded-lg border border-gray-100'
    >
      <div className='text-xl'>Notifications</div>
      <div className='h-full flex items-center justify-center'>
        <button className='bg-gray-200 hover:bg-gray-100 border border-gray-400 px-4 py-2 rounded-full'>
          {props.wallet ? 'Enable notifications' : 'Connect your wallet to enable notifications'}
        </button>
      </div>
    </div>
  );
}
