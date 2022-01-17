import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/outline';
import NotificationCenter from '../NotificationCenter';

export function Bell(): JSX.Element {
  const [open, setOpen] = useState(true);
  useEffect(() => {
    console.log('open', open);
  }, [open]);
  return (
    <div className='flex flex-col items-end'>
      <button onClick={() => setOpen(!open)}>
        <BellIcon
          className='p-2 h-9 w-9 bg-gray-200 text-gray-700 rounded-full' />
      </button>
      {open && (
        <div className='absolute top-14 w-1/3 h-1/2'>
          <NotificationCenter />
        </div>
      )}
    </div>
  );
}
