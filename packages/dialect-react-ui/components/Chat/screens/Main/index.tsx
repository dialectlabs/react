import React, { useState } from 'react';
import clsx from 'clsx';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../common/ThemeProvider';
import IconButton from '../../../IconButton';
import CreateThread from './pages/CreateThreadPage/CreateThread';
import ThreadPage from './pages/ThreadPage/';
import ThreadsList from './ThreadsList';

interface MainProps {
  inbox?: boolean;
  onModalClose?: () => void;
}

const Main = ({ inbox, onModalClose }: MainProps) => {
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
          <div className="dt-flex">
            <div
              className="dt-cursor-pointer"
              onClick={() => {
                setNewThreadOpen(true);
              }}
            >
              <icons.compose />
            </div>
            {!inbox && onModalClose && (
              <div className="sm:dt-hidden dt-ml-3">
                <IconButton icon={<icons.x />} onClick={onModalClose} />
              </div>
            )}
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
          inbox={inbox}
          onModalClose={onModalClose}
          onCloseRequest={() => {
            setNewThreadOpen(false);
          }}
        />
      ) : (
        <ThreadPage
          inbox={inbox}
          onModalClose={onModalClose}
          onNewThreadClick={() => setNewThreadOpen(true)}
        />
      )}
    </div>
  );
};

export default Main;
