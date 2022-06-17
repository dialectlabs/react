import { useEffect } from 'react';
import { useApi } from '@dialectlabs/react';
import { useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName } from '../../constants';
import ThreadContent from './ThreadContent';
import NoMessages from './NoMessages';

const ThreadPage = () => {
  const {
    navigate,
    params: { threadId },
  } = useRoute<{ threadId?: string }>();
  const { wallet } = useApi();

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

  return <ThreadContent threadId={threadId} />;
};

export default ThreadPage;
