import { useEffect } from 'react';
import { ThreadId, useDialectSdk } from '@dialectlabs/react-sdk';
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
    info: { wallet },
  } = useDialectSdk();

  useEffect(() => {
    if (wallet) {
      return;
    }

    // In case wallet resets, we reset dialect address and navigate to main
    navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
  }, [navigate, wallet]);

  if (!threadId) {
    return <NoMessages />;
  }

  return <ThreadContent key={threadId.toString()} threadId={threadId} />;
};

export default ThreadPage;
