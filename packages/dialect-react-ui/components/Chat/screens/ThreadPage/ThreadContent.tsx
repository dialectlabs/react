import {
  isOnChain,
  ThreadId,
  useIdentity,
  useThread,
} from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { shortenAddress } from '../../../../utils/displayUtils';
import Avatar from '../../../Avatar';
import { OnChainIndicator } from '../../../common';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';
import { Route, Router, useRoute } from '../../../common/providers/Router';
import { DisplayAddress } from '../../../DisplayAddress';
import { Header } from '../../../Header';
import { MainRouteName, RouteName, ThreadRouteName } from '../../constants';
import { useChatInternal } from '../../provider';
import EncryptionBadge from './EncryptionBadge';
import Settings from './Settings';
import Thread from './Thread';

type ThreadContentProps = {
  threadId: ThreadId;
};

const ThreadContent = ({ threadId }: ThreadContentProps) => {
  const { current, navigate } = useRoute();
  const { type, onChatOpen, onChatClose, dialectId, pollingInterval } =
    useChatInternal();
  const { thread, isAdminable } = useThread({
    findParams: { id: threadId },
    refreshInterval: pollingInterval,
  });
  const onChain = isOnChain(thread?.type || '');

  const { icons, xPaddedText } = useTheme();
  const { ui } = useDialectUiId(dialectId);

  const otherMemberAddress = thread?.otherMembers[0]?.address;
  const { identity } = useIdentity({ address: otherMemberAddress });

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
          <Header.Icons
            containerOnly
            position="left"
            className={clsx(
              current?.sub?.name !== ThreadRouteName.Settings &&
                type == 'inbox' &&
                'md:dt-hidden'
            )}
          >
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
          {current?.sub?.name === ThreadRouteName.Settings ? (
            <Header.Title align="center">Chat settings</Header.Title>
          ) : null}
          {otherMemberAddress &&
          current?.sub?.name !== ThreadRouteName.Settings ? (
            <Header.Title align="left">
              <div className="dt-flex dt-space-x-2">
                <Avatar size="extra-small" address={otherMemberAddress} />
                <div className="dt-flex dt-flex-col">
                  <div className="dt-flex dt-flex-row items-center">
                    <span className="dt-text-base dt-font-medium dt-text">
                      <DisplayAddress
                        address={otherMemberAddress}
                        isLinkable={true}
                      />
                    </span>
                    {onChain && <OnChainIndicator />}
                  </div>
                  <span className="dt-text-xs dt-flex dt-items-center dt-space-x-1">
                    {!identity && (
                      <span className="dt-opacity-60">
                        {shortenAddress(otherMemberAddress)}
                      </span>
                    )}
                    <EncryptionBadge
                      enabled={Boolean(thread?.encryptionEnabled)}
                    />
                  </span>
                </div>
              </div>
            </Header.Title>
          ) : null}
          <Header.Icons>
            <Header.Icon
              className={clsx({
                'dt-invisible':
                  current?.sub?.name === ThreadRouteName.Settings ||
                  (!isOnChain && !isAdminable),
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
