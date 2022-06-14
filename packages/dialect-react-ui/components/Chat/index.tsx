import { useEffect } from 'react';
import { useDialect } from '@dialectlabs/react';
import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import Error from './screens/Error';
import Main from './screens/Main';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { ChatProvider } from './provider';
import { Route, Router, useRoute } from '../common/providers/Router';
import { MainRouteName, RouteName } from './constants';
import type { ChatNavigationHelpers } from './types';
import {
  showCreateThread,
  showMain,
  showThread,
  showThreadSettings,
} from './navigation';

type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface ChatProps {
  dialectId: string;
  type: ChatType;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
  onChatClose?: () => void;
  onChatOpen?: () => void;
}

function InnerChat({
  dialectId,
  type,
  wrapperClassName,
  contentWrapperClassName,
  onChatClose,
  onChatOpen,
}: ChatProps): JSX.Element {
  const { configure } = useDialectUiId(dialectId);
  const { disconnectedFromChain, isWalletConnected } = useDialect();

  const { navigate } = useRoute();

  useEffect(() => {
    if (disconnectedFromChain || !isWalletConnected) {
      configure(null);
      return;
    }

    configure<ChatNavigationHelpers>({
      navigation: {
        navigate,
        showCreateThread: (receiver?: string) =>
          showCreateThread(navigate, receiver),
        showMain: () => showMain(navigate),
        showThread: (threadId: string) => showThread(navigate, threadId),
        showThreadSettings: (threadId: string) =>
          showThreadSettings(navigate, threadId),
      },
    });
  }, [configure, disconnectedFromChain, isWalletConnected, navigate]);

  useEffect(
    function pickRoute() {
      if (disconnectedFromChain) {
        navigate(RouteName.NoConnection);
      } else if (!isWalletConnected) {
        navigate(RouteName.NoWallet);
      } else {
        navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
      }
    },
    [navigate, disconnectedFromChain, isWalletConnected]
  );

  const { colors, modal, slider } = useTheme();

  return (
    <ChatProvider
      dialectId={dialectId}
      type={type}
      onChatOpen={onChatOpen}
      onChatClose={onChatClose}
    >
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
            { [modal]: type === 'popup' },
            { [slider]: type === 'vertical-slider' }
          )}
        >
          <Route name={RouteName.NoConnection}>
            <Error type="NoConnection" />
          </Route>
          <Route name={RouteName.NoWallet}>
            <Error type="NoWallet" />
          </Route>
          <Route name={RouteName.Main}>
            <Main />
          </Route>
        </div>
      </div>
    </ChatProvider>
  );
}

export default function Chat(props: ChatProps) {
  return (
    <Router initialRoute={RouteName.NoConnection}>
      <InnerChat {...props} />
    </Router>
  );
}
