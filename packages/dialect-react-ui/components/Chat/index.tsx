import clsx from 'clsx';
import { useEffect } from 'react';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import { Header } from '../Header';
import { RouteName } from './constants';
import {
  showCreateThread,
  showMain,
  showThread,
  showThreadSettings,
} from './navigation';
import { ChatProvider } from './provider';
import Main from './screens/Main';
import type { ChatNavigationHelpers } from './types';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';

type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface InnerChatProps {
  dialectId: string;
}

function InnerChat({ dialectId }: InnerChatProps): JSX.Element {
  const { configure } = useDialectUiId(dialectId);

  const { navigate } = useRoute();

  useEffect(() => {
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
  }, [configure, navigate]);

  return (
    <>
      <Route name={RouteName.Main}>
        <Main />
      </Route>
    </>
  );
}

interface ChatProps {
  dialectId: string;
  type: ChatType;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
  onChatClose?: () => void;
  onChatOpen?: () => void;
  pollingInterval?: number;
}

export default function Chat({
  wrapperClassName,
  contentWrapperClassName,
  onChatOpen,
  onChatClose,
  pollingInterval,
  ...props
}: ChatProps) {
  const { dialectId, type } = props;
  const { ui } = useDialectUiId(dialectId);

  const { colors, modal, slider } = useTheme();

  const defaultHeader = (
    <Header
      type={type}
      onClose={onChatClose}
      onOpen={onChatOpen}
      onHeaderClick={onChatOpen}
      isWindowOpen={ui?.open}
    >
      <Header.Title>Messages</Header.Title>
      <Header.Icons />
    </Header>
  );

  // we should render errors immediatly right after error appears
  // that's why useEffect is not suitable to handle logic
  // rendering header to avoid empty header in bottom chat

  return (
    <Router initialRoute={RouteName.Main}>
      <ChatProvider
        dialectId={dialectId}
        type={type}
        onChatOpen={onChatOpen}
        onChatClose={onChatClose}
        pollingInterval={pollingInterval}
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
              colors.textPrimary,
              colors.bg,
              contentWrapperClassName,
              { [modal]: type === 'popup' },
              { [slider]: type === 'vertical-slider' }
            )}
          >
            <WalletStatesWrapper header={defaultHeader}>
              <ConnectionWrapper
                header={defaultHeader}
                pollingInterval={pollingInterval}
              >
                <InnerChat {...props} />
              </ConnectionWrapper>
            </WalletStatesWrapper>
          </div>
        </div>
      </ChatProvider>
    </Router>
  );
}
