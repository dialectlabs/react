import clsx from 'clsx';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import Settings from './Settings';
import Thread from './Thread';
import { DisplayAddress } from '../../../DisplayAddress';
import { Header } from '../../../Header';
import { Route, Router, useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName, ThreadRouteName } from '../../constants';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { useChatInternal } from '../../provider';
import { useApi } from '@dialectlabs/react';
import useMemoThread from '../../../../hooks/useMemoThread';

type ThreadContentProps = {
  threadId: string;
};

const ThreadContent = ({ threadId }: ThreadContentProps) => {
  const { current, navigate } = useRoute();
  const { thread } = useMemoThread(threadId);
  const { program } = useApi();
  const { icons, xPaddedText } = useTheme();
  const { type, onChatOpen, onChatClose, dialectId } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const connection = program?.provider.connection;

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <div className="dt-flex dt-flex-col dt-flex-1 dt-min-w-[0px]">
        <Header
          type={type}
          onClose={onChatClose}
          onOpen={onChatOpen}
          onHeaderClick={onChatOpen}
          isWindowOpen={ui?.open}
        >
          <Header.Icons containerOnly position="left">
            <Header.Icon
              icon={<icons.back />}
              onClick={() => {
                if (current?.sub?.name === ThreadRouteName.Settings) {
                  navigate(RouteName.Main, {
                    sub: {
                      name: MainRouteName.Thread,
                      params: { threadId },
                      sub: { name: ThreadRouteName.Messages },
                    },
                  });
                  return;
                }

                navigate(RouteName.Main, {
                  sub: { name: MainRouteName.Thread },
                });
              }}
            />
          </Header.Icons>
          <Header.Title align="center">
            <div className="dt-flex dt-flex-col dt-items-center">
              <span className="dt-text-base dt-font-medium dt-text">
                {connection && thread?.otherMembers ? (
                  <DisplayAddress
                    connection={connection}
                    otherMembers={thread.otherMembers}
                    isLinkable={true}
                  />
                ) : (
                  'Loading...'
                )}
              </span>
              {thread?.encryptionEnabled ? (
                <span className="dt-text-xs dt-opacity-50">encrypted</span>
              ) : (
                <span className="dt-text-xs dt-opacity-50">unencrypted</span>
              )}
            </div>
          </Header.Title>
          <Header.Icons>
            <Header.Icon
              className={clsx({
                'dt-invisible': current?.sub?.name === ThreadRouteName.Settings,
              })}
              icon={<icons.settings />}
              onClick={() =>
                navigate(RouteName.Main, {
                  sub: {
                    name: MainRouteName.Thread,
                    params: { threadId },
                    sub: { name: ThreadRouteName.Settings },
                  },
                })
              }
            />
          </Header.Icons>
        </Header>
        <div
          className={clsx(
            xPaddedText,
            'dt-flex-1 dt-h-full dt-overflow-y-auto'
          )}
        >
          <Router initialRoute={ThreadRouteName.Messages}>
            <Route name={ThreadRouteName.Messages}>
              <Thread threadId={threadId} />
            </Route>
            <Route name={ThreadRouteName.Settings}>
              <Settings threadId={threadId} />
            </Route>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default ThreadContent;
