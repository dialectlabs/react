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

  const [newThreadOpen, setNewThreadOpen] = useState(false);

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-min-w-full">
      <div
        className={clsx(
          'dt-flex dt-flex-1 dt-flex-col dt-border-r border-neutral-600',
          {
            'md:dt-max-w-xs': inbox,
            'md:dt-block': inbox,
            'dt-hidden': dialectAddress || newThreadOpen,
          }
        )}
      >
        <div className="dt-px-2 dt-py-4 dt-mb-2 dt-flex dt-justify-between dt-border-b border-neutral-600 dt-font-bold">
          Messages
          <div
            className="dt-cursor-pointer"
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
