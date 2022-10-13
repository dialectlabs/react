import { ThreadId, useDialectWallet } from '@dialectlabs/react-sdk';
import { useEffect } from 'react';
import { useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName } from '../../constants';
import NoMessages from './NoMessages';
import ThreadContent from './ThreadContent';

const ThreadPage = () => {
  const {
    navigate,
    params: { threadId },
  } = useRoute<{ threadId?: ThreadId }>();
  const {
    walletConnected: { get: isWalletConnected },
  } = useDialectWallet();

  useEffect(() => {
    if (isWalletConnected) {
      return;
    }
    // In case wallet resets, we reset dialect address and navigate to main
    navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
  }, [isWalletConnected, navigate]);

  if (!threadId) {
    return <NoMessages />;
  }

  return <ThreadContent key={threadId.toString()} threadId={threadId} />;
};

export default ThreadPage;
