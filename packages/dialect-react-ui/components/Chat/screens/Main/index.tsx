import { useState } from 'react';
import clsx from 'clsx';
import { useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import CreateThread from './pages/CreateThreadPage/CreateThread';
import ThreadPage from './pages/ThreadPage/';
import ThreadsList from './ThreadsList';
import { Header } from '../../../Header';

interface MainProps {
  inbox?: boolean;
  onChatClose?: () => void;
  onChatOpen?: () => void;
}

const Main = ({ inbox, onChatClose, onChatOpen }: MainProps) => {
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
        <Header inbox={inbox} onClose={onChatClose} onHeaderClick={onChatOpen}>
          <Header.Icon
            icon={<icons.compose />}
            onClick={() => setNewThreadOpen(true)}
          />
        </Header>
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
          inbox={inbox}
          onModalClose={onChatClose}
          onCloseRequest={() => {
            setNewThreadOpen(false);
          }}
        />
      ) : (
        <ThreadPage
          inbox={inbox}
          onModalClose={onChatClose}
          onNewThreadClick={() => setNewThreadOpen(true)}
        />
      )}
    </div>
  );
};

export default Main;
