import React from 'react';
import ThreadsList from './ThreadsList';
import { useDialect } from '@dialectlabs/react';
import Thread from '../../Thread';
import clsx from 'clsx';

interface MainProps {}

const Main = ({}: MainProps) => {
  const { dialectAddress, dialects, setDialectAddress } = useDialect();

  return (
    <div className="h-full flex justify-between min-w-full">
      <div className={clsx({ hidden: dialectAddress, 'md:block': true })}>
        <ThreadsList
          chatThreads={dialects}
          onThreadClick={(dAddr) => setDialectAddress(dAddr)}
        />
      </div>
      {dialectAddress && (
        <div className="ml-4 flex-1">
          <Thread />
        </div>
      )}
    </div>
  );
};

export default Main;
