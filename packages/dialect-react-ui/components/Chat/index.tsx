import {
  useDialectConnectionInfo,
  useDialectWallet,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect } from 'react';
import NoConnectionError from '../../entities/errors/ui/NoConnectionError';
import NoWalletError from '../../entities/errors/ui/NoWalletError';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import { Header } from '../Header';
import { MainRouteName, RouteName } from './constants';
import {
  showCreateThread,
  showMain,
  showThread,
  showThreadSettings,
} from './navigation';
import { ChatProvider, useChatInternal } from './provider';
import EncryptionInfo from './screens/EncryptionInfo';
import Main from './screens/Main';
import SignMessageInfo from './screens/SignMessageInfo';
import type { ChatNavigationHelpers } from './types';

type ChatType = 'inbox' | 'popup' | 'vertical-slider';

interface InnerChatProps {
  dialectId: string;
  type: ChatType;
  wrapperClassName?: string;
  contentWrapperClassName?: string;
}

function InnerChat({ dialectId }: InnerChatProps): JSX.Element {
  const { configure, ui } = useDialectUiId(dialectId);
  const { type, onChatClose, onChatOpen } = useChatInternal();

  const { navigate } = useRoute();

  const { isSigning, isEncrypting } = useDialectWallet();

  // rendering header to avoid empty header in bottom chat
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

  useEffect(
    function pickRoute() {
      if (isSigning) {
        navigate(RouteName.SigningRequest);
      } else if (isEncrypting) {
        navigate(RouteName.EncryptionRequest);
      } else {
        navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
      }
    },
    [navigate, isSigning, isEncrypting]
  );

  return (
    <>
      <Route name={RouteName.SigningRequest}>
        {defaultHeader}
        <SignMessageInfo />
      </Route>
      <Route name={RouteName.EncryptionRequest}>
        {defaultHeader}
        <EncryptionInfo />
      </Route>
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
}

export default function Chat({
  wrapperClassName,
  contentWrapperClassName,
  onChatOpen,
  onChatClose,
  ...props
}: ChatProps) {
  const { dialectId, type } = props;
  const { ui } = useDialectUiId(dialectId);

  const { colors, modal, slider } = useTheme();

  const {
    connected: {
      solana: {
        connected: isSolanaConnected,
        shouldConnect: isSolanaShouldConnect,
      },
      dialectCloud: {
        connected: isDialectCloudConnected,
        shouldConnect: isDialectCloudShouldConnect,
      },
    },
  } = useDialectConnectionInfo();

  const { connected: isWalletConnected } = useDialectWallet();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  const hasError = !isWalletConnected || !someBackendConnected;

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
  const renderError = () => {
    if (!hasError) {
      return null;
    }
    if (!isWalletConnected) {
      return (
        <>
          {defaultHeader}
          <NoWalletError />
        </>
      );
    }
    if (!someBackendConnected) {
      return (
        <>
          {defaultHeader}
          <NoConnectionError />
        </>
      );
    }
  };

  return (
    <Router>
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
            {hasError ? renderError() : <InnerChat {...props} />}
          </div>
        </div>
      </ChatProvider>
    </Router>
  );
}
