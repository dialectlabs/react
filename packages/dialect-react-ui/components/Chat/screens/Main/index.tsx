import React, { useState } from 'react';
import ThreadsList from './ThreadsList';
import { useDialect } from '@dialectlabs/react';
import ThreadPage from './pages/ThreadPage/';
import clsx from 'clsx';
import { useTheme } from '../../../common/ThemeProvider';
import CreateThread from './pages/CreateThreadPage/CreateThread';
import IconButton from '../../../IconButton';

interface MainProps {
  inbox?: boolean;
  toggleModal?: () => void;
}

const Main = ({ inbox, toggleModal }: MainProps) => {
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
            {!inbox && (
              <div className="sm:dt-hidden dt-ml-3">
                <IconButton icon={<icons.x />} onClick={toggleModal} />
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
          toggleModal={toggleModal}
          onCloseRequest={() => {
            setNewThreadOpen(false);
          }}
        />
      ) : (
        <ThreadPage
          inbox={inbox}
          toggleModal={toggleModal}
          onNewThreadClick={() => setNewThreadOpen(true)}
        />
      )}
    </div>
  );
};

export default Main;
