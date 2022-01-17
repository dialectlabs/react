import React from 'react';

import { Bell } from '../components/Bell';

export default function Home(): JSX.Element {
  return (
    <div className='flex flex-col h-screen'>
      <div className='flex flex-row justify-end p-2'>
        <Bell />
      </div>
      <div className='h-full text-4xl flex flex-col justify-center'>
        <div className='text-center'>DeFi</div>
      </div>
    </div>
  );
}