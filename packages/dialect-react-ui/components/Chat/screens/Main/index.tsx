import React, { useState } from 'react';
import ThreadsList from './ThreadsList';
import { useDialect } from '@dialectlabs/react';
import ThreadPage from './pages/ThreadPage/';
import clsx from 'clsx';
import { useTheme } from '../../../common/ThemeProvider';
import CreateThread from './pages/CreateThreadPage/CreateThread';

interface MainProps {
  inbox?: boolean;
}

const Main = ({ inbox }: MainProps) => {
  const { dialectAddress, dialects, setDialectAddress } = useDialect();

  const { icons } = useTheme();

  const [newThreadOpen, setNewThreadOpen] = useState<boolean>(false);

  return (
    <div className="h-full flex flex-1 justify-between min-w-full">
      <div
        className={clsx('flex flex-1 flex-col border-r border-neutral-600', {
          'md:max-w-xs': inbox,
          'md:block': inbox,
          hidden: dialectAddress || newThreadOpen,
        })}
      >
        <div className="px-2 py-4 mb-2 flex justify-between border-b border-neutral-600 font-bold">
          Messages
          <div
            className="cursor-pointer"
            onClick={() => {
              setNewThreadOpen(true);
            }}
          >
            <icons.compose />
          </div>
        </div>
        <ThreadsList
          chatThreads={dialects}
          onThreadClick={(dAddr) => {
            setDialectAddress(dAddr);
            setNewThreadOpen(false);
          }}
        />
      </div>
      {newThreadOpen ? (
        <CreateThread
          onCloseRequest={() => {
            setNewThreadOpen(false);
          }}
        />
      ) : (
        <ThreadPage />
      )}
    </div>
  );
};

export default Main;
