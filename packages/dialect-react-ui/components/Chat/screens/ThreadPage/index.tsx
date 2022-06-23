import { useEffect } from 'react';
import type { ThreadId } from '@dialectlabs/sdk';
import { useDialectSdk } from '@dialectlabs/react-sdk';
import { useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName } from '../../constants';
import NoMessages from './NoMessages';
import ThreadContent from './ThreadContent';
import serializeThreadId from '../../../../utils/serializeThreadId';

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

  return (
    <ThreadContent key={serializeThreadId(threadId)} threadId={threadId} />
  );
};

export default ThreadPage;
