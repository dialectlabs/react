import type { ThreadId } from '@dialectlabs/react-sdk';
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

  useEffect(() => {
    // In case wallet resets, we reset dialect address and navigate to main
    // TODO
    // return () => {
    //   navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
    // };
  }, [navigate]);

  if (!threadId) {
    return <NoMessages />;
  }

  return <ThreadContent key={threadId.toString()} threadId={threadId} />;
};

export default ThreadPage;
