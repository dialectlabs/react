import { ReactNode, useEffect, useState } from 'react';
import { useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import Error from './screens/Error';
import Main from './screens/Main';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { ChatContext } from './provider';

enum Routes {
  Main = 'main',
  NoConnection = 'no_connection',
  NoWallet = 'no_wallet',
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
  const { disconnectedFromChain, isWalletConnected } = useDialect();
  const [activeRoute, setActiveRoute] = useState<Routes>(Routes.NoConnection);
  const inbox = type === 'inbox';

  useEffect(
    function pickRoute() {
      if (disconnectedFromChain) {
        setActiveRoute(Routes.NoConnection);
      } else if (!isWalletConnected) {
        setActiveRoute(Routes.NoWallet);
      } else {
        setActiveRoute(Routes.Main);
      }
    },
    [disconnectedFromChain, isWalletConnected]
  );

  const { colors, modal } = useTheme();

  const routes: Record<Routes, ReactNode> = {
    [Routes.NoConnection]: <Error type="NoConnection" />,
    [Routes.NoWallet]: <Error type="NoWallet" />,
    [Routes.Main]: (
      <Main onChatClose={onChatClose} onChatOpen={onChatOpen} inbox={inbox} />
    ),
  };

  return (
    <ChatContext.Provider value={{ type, onChatOpen, onChatClose }}>
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
          <div className="dt-h-full">{routes[activeRoute]}</div>
        </div>
      </div>
    </ChatContext.Provider>
  );
}
