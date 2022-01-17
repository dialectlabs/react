import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/outline';
import NotificationCenter from '../NotificationCenter';

export function Bell(): JSX.Element {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    console.log('open', open);
  }, [open]);
  return (
    <div className='flex flex-col items-end'>
      <button
      className='flex items-center justify-center w-9 h-9 rounded-full bg-gray-200'
        onClick={() => setOpen(!open)}
      >
        <BellIcon
          className='w-5 h-5 text-gray-700 rounded-full' />
      </button>
      {open && (
        <div className='absolute top-14 w-96 h-96'>
          <NotificationCenter />
        </div>
      )}
    </div>
  );
}
