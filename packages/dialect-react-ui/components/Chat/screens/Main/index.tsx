import { useCallback, useState } from 'react';
import clsx from 'clsx';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import ThreadsList from './ThreadsList';
import { Header } from '../../../Header';
import CreateThread from '../CreateThreadPage/CreateThread';
import ThreadPage from '../ThreadPage';
import { useChatInternal } from '../../provider';
import { Route, Router, useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName, ThreadRouteName } from '../../constants';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { useIsomorphicLayoutEffect } from '../../../../hooks/useIsomorphicLayoutEffect';

const Main = () => {
  const { navigate, current } = useRoute();
  const { type, onChatClose, onChatOpen, dialectId } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const [hideList, setHideList] = useState(false);
  const inbox = type === 'inbox';

  const { icons } = useTheme();

  const navigateToCreateThread = useCallback(
    () =>
      navigate(RouteName.Main, {
        sub: { name: MainRouteName.CreateThread },
      }),
    [navigate]
  );

  // Running this inside useLayoutEffect in order to make necessary style changes, since otherwise there is a visual bug
  useIsomorphicLayoutEffect(() => {
    const shouldHideList =
      current?.sub?.name === MainRouteName.CreateThread ||
      current?.sub?.params?.threadId;

    setHideList(shouldHideList);
  }, [current?.sub?.name, current?.sub?.params]);

  return (
    <Router initialRoute={MainRouteName.Thread}>
      <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
        <div
          className={clsx(
            'dt-flex dt-flex-1 dt-flex-col dt-border-neutral-600 dt-overflow-hidden dt-w-full',
            {
              'md:dt-max-w-xs md:dt-border-r md:dt-flex': inbox,
              'dt-hidden': hideList,
            }
          )}
        >
          <Header
            type={type}
            onClose={onChatClose}
            onOpen={onChatOpen}
            onHeaderClick={onChatOpen}
            isWindowOpen={ui?.open}
          >
            <Header.Title>Messages</Header.Title>
            <Header.Icons>
              <Header.Icon
                icon={<icons.compose />}
                onClick={() =>
                  navigate(RouteName.Main, {
                    sub: { name: MainRouteName.CreateThread },
                  })
                }
              />
            </Header.Icons>
          </Header>
          <ThreadsList
            onThreadClick={(thread) => {
              navigate(RouteName.Main, {
                sub: {
                  name: MainRouteName.Thread,
                  params: { threadId: thread.address.toBase58() },
                  sub: { name: ThreadRouteName.Messages },
                },
              });
            }}
          />
        </div>
        <Route name={MainRouteName.CreateThread}>
          <CreateThread
            onModalClose={onChatClose}
            onNewThreadCreated={(threadId) => {
              navigate(RouteName.Main, {
                sub: {
                  name: MainRouteName.Thread,
                  params: { threadId },
                  sub: { name: ThreadRouteName.Messages },
                },
              });
            }}
            onCloseRequest={() => {
              navigate(RouteName.Main, {
                sub: { name: MainRouteName.Thread },
              });
            }}
          />
        </Route>
        <Route name={MainRouteName.Thread}>
          <ThreadPage
            onModalClose={onChatClose}
            onNewThreadClick={navigateToCreateThread}
          />
        </Route>
      </div>
    </Router>
  );
};

export default Main;
