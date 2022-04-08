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
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <div
        className={clsx(
          'dt-flex dt-flex-1 dt-flex-col dt-border-neutral-600 dt-overflow-hidden dt-w-full',
          {
            'md:dt-max-w-xs md:dt-border-r md:dt-flex': inbox,
            'dt-hidden': dialectAddress || newThreadOpen,
          }
        )}
      >
        <div className="dt-px-2 dt-pt-2 dt-pb-4 dt-flex dt-justify-between dt-border-b dt-border-neutral-900 dt-font-bold">
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
          onThreadClick={(dialectAccount) => {
            setDialectAddress(dialectAccount.publicKey.toBase58());
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
        <ThreadPage
          inbox={inbox}
          onNewThreadClick={() => setNewThreadOpen(true)}
        />
      )}
    </div>
  );
};

export default Main;
