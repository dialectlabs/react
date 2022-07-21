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
import EncryptionInfo from '../../entities/wallet-states/EncryptionInfo';
import SignMessageInfo from '../../entities/wallet-states/SignMessageInfo';
import Main from './screens/Main';
import type { ChatNavigationHelpers } from './types';
import SignTransactionInfo from '../../entities/wallet-states/SignTransactionInfo';
import NotAuthorizedError from '../../entities/errors/ui/NotAuthorizedError';

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

  const { isSigningFreeTransaction, isSigningMessage, isEncrypting } =
    useDialectWallet();

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
      if (isSigningMessage) {
        navigate(RouteName.SigningRequest);
      } else if (isSigningFreeTransaction) {
        navigate(RouteName.SigningTransaction);
      } else if (isEncrypting) {
        navigate(RouteName.EncryptionRequest);
      } else {
        navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
      }
    },
    [navigate, isSigningMessage, isSigningFreeTransaction, isEncrypting]
  );

  return (
    <>
      <Route name={RouteName.SigningRequest}>
        {defaultHeader}
        <SignMessageInfo />
      </Route>
      <Route name={RouteName.SigningTransaction}>
        {defaultHeader}
        <SignTransactionInfo />
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

  const {
    connectionInitiated,
    adapter: { connected: isWalletConnected },
  } = useDialectWallet();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

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
    if (!isWalletConnected) {
      return (
        <>
          {defaultHeader}
          <NoWalletError />
        </>
      );
    }

    if (!connectionInitiated) {
      return (
        <>
          {defaultHeader}
          <NotAuthorizedError />
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

    return null;
  };

  const renderedError = renderError();

  const hasError = Boolean(renderedError);

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
            {hasError ? renderedError : <InnerChat {...props} />}
          </div>
        </div>
      </ChatProvider>
    </Router>
  );
}
