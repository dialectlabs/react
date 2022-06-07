import { ReactNode, useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import Error from './screens/Error';
import Main from './screens/Main';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { ChatProvider } from './provider';
import { Header } from '../Header';
import ThreadsList from './screens/Main/ThreadsList';
import CreateThread from './screens/CreateThreadPage/CreateThread';
import ThreadPage from './screens/ThreadPage';

enum RouteName {
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
  CreateThread = 'create_thread',
  Thread = 'threads_list',
}

interface Route<P extends Record<string, any> | undefined | null = undefined> {
  params?: P;
}

interface Routes {
  [RouteName.NoConnection]: Route;
  [RouteName.NoWallet]: Route;
  [RouteName.CreateThread]: Route<{ receiver?: string }>;
  [RouteName.Thread]: Route<{ id?: string }>;
}

type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface ChatProps {
  id: string;
  type: ChatType;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
  onChatClose?: () => void;
  onChatOpen?: () => void;
}

export default function Chat({
  id,
  type,
  wrapperClassName,
  contentWrapperClassName,
  onChatClose,
  onChatOpen,
}: ChatProps): JSX.Element {
  const mgmt = useDialectUiId(id);
  const {
    dialectAddress,
    dialects,
    setDialectAddress,
    disconnectedFromChain,
    isWalletConnected,
  } = useDialect();

  const { icons } = useTheme();

  const inbox = type === 'inbox';

  const [activeRoute, setActiveRoute] = useState<RouteName>(
    RouteName.NoConnection
  );

  useEffect(
    function pickRoute() {
      if (disconnectedFromChain) {
        setActiveRoute(RouteName.NoConnection);
      } else if (!isWalletConnected) {
        setActiveRoute(RouteName.NoWallet);
      } else {
        setActiveRoute(RouteName.Thread);
      }
    },
    [disconnectedFromChain, isWalletConnected]
  );

  const { colors, modal } = useTheme();

  const routes: Record<RouteName, ReactNode> = {
    [RouteName.NoConnection]: <Error type="NoConnection" />,
    [RouteName.NoWallet]: <Error type="NoWallet" />,
    [RouteName.CreateThread]: (
      <CreateThread
        inbox={inbox}
        onModalClose={onChatClose}
        onCloseRequest={() => setActiveRoute(RouteName.Thread)}
      />
    ),
    [RouteName.Thread]: (
      <ThreadPage
        inbox={inbox}
        onModalClose={onChatClose}
        onNewThreadClick={() => setActiveRoute(RouteName.CreateThread)}
      />
    ),
  };

  return (
    <ChatProvider type={type} onChatOpen={onChatOpen} onChatClose={onChatClose}>
      <div
        className={clsx(
          'dialect',
          wrapperClassName ? wrapperClassName : 'dt-h-full'
        )}
      >
        <div
          className={clsx(
            'dt-flex dt-flex-col dt-h-full dt-shadow-md dt-overflow-hidden',
            colors.primary,
            colors.bg,
            contentWrapperClassName,
            { [modal]: !inbox }
          )}
        >
          <div className="dt-h-full">
            <div
              className={clsx(
                'dt-flex dt-flex-1 dt-flex-col dt-border-neutral-600 dt-overflow-hidden dt-w-full',
                {
                  'md:dt-max-w-xs md:dt-border-r md:dt-flex': inbox,
                  // TODO: until we have nested routing, we'll need to hack this
                  'dt-hidden': activeRoute !== RouteName.Thread,
                }
              )}
            >
              <Header
                inbox={inbox}
                onClose={onChatClose}
                onHeaderClick={onChatOpen}
              >
                <Header.Title>Messages</Header.Title>
                <Header.Icons>
                  <Header.Icon
                    icon={<icons.compose />}
                    onClick={() => setActiveRoute(RouteName.CreateThread)}
                  />
                </Header.Icons>
              </Header>
              <ThreadsList
                chatThreads={dialects}
                onThreadClick={(dialectAccount) => {
                  setDialectAddress(dialectAccount.publicKey.toBase58());
                }}
              />
            </div>
            {routes[activeRoute]}
          </div>
        </div>
      </div>
    </ChatProvider>
  );
}
