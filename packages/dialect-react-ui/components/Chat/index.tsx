import {
  useDialectConnectionInfo,
  useDialectWallet,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useEffect } from 'react';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { Route, Router, useRoute } from '../common/providers/Router';
import { MainRouteName, RouteName } from './constants';
import {
  showCreateThread,
  showMain,
  showThread,
  showThreadSettings,
} from './navigation';
import { ChatProvider } from './provider';
import EncryptionInfo from './screens/EncryptionInfo';
import Error from './screens/Error';
import Main from './screens/Main';
import SignMessageInfo from './screens/SignMessageInfo';
import type { ChatNavigationHelpers } from './types';

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
    isSigning,
    isEncrypting,
    connected: isWalletConnected,
  } = useDialectWallet();

  const { navigate } = useRoute();

  const someBackendConnected =
    (isSolanaShouldConnect && isSolanaConnected) ||
    (isDialectCloudShouldConnect && isDialectCloudConnected);

  const hasError = !isWalletConnected || !someBackendConnected;

  useEffect(() => {
    if (hasError) {
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
  }, [configure, hasError, navigate]);

  // we should render errors immediatly right after error appears
  // that's why useEffect is not suitable to handle logic
  const renderError = () => {
    if (!hasError) {
      return null;
    }
    if (!isWalletConnected) {
      return <Error type="NoWallet" />;
    }
    if (!someBackendConnected) {
      return <Error type="NoConnection" />;
    }
  };

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
    [
      navigate,
      someBackendConnected,
      isSolanaConnected,
      isWalletConnected,
      isSigning,
      isEncrypting,
    ]
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
          {hasError ? (
            renderError()
          ) : (
            <>
              <Route name={RouteName.SigningRequest}>
                <SignMessageInfo />
              </Route>
              <Route name={RouteName.EncryptionRequest}>
                <EncryptionInfo />
              </Route>
              <Route name={RouteName.Main}>
                <Main />
              </Route>
            </>
          )}
        </div>
      </div>
    </ChatProvider>
  );
}

export default function Chat(props: ChatProps) {
  return (
    <Router>
      <InnerChat {...props} />
    </Router>
  );
}
