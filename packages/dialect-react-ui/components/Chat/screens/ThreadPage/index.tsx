import { useEffect } from 'react';
import clsx from 'clsx';
import { useApi, useDialect } from '@dialectlabs/react';
import { useTheme } from '../../../common/providers/DialectThemeProvider';
import { P } from '../../../common/preflighted';
import Settings from './Settings';
import Thread from './Thread';
import { DisplayAddress } from '../../../DisplayAddress';
import { Header } from '../../../Header';
import { Route, Router, useRoute } from '../../../common/providers/Router';
import { MainRouteName, RouteName, ThreadRouteName } from '../../constants';
import { useChatInternal } from '../../provider';
import { useDialectUiId } from '../../../common/providers/DialectUiManagementProvider';

interface ThreadPageProps {
  onNewThreadClick?: () => void;
  onModalClose?: () => void;
}

const ThreadPage = ({ onNewThreadClick, onModalClose }: ThreadPageProps) => {
  const {
    navigate,
    current,
    params: { threadId },
  } = useRoute<{ threadId?: string }>();
  const { wallet, program } = useApi();
  const { dialect, setDialectAddress } = useDialect();
  const { icons, xPaddedText } = useTheme();
  const { type, onChatOpen, dialectId } = useChatInternal();
  const { ui } = useDialectUiId(dialectId);
  const inbox = type === 'inbox';
  const connection = program?.provider.connection;

  useEffect(() => {
    if (wallet) {
      return;
    }

    // In case wallet resets, we reset dialect address and navigate to main
    setDialectAddress('');
    navigate(RouteName.Main, { sub: { name: MainRouteName.Thread } });
  }, [navigate, setDialectAddress, wallet]);

  useEffect(() => {
    setDialectAddress(threadId ?? '');
  }, [setDialectAddress, threadId]);

  if (!threadId) {
    if (!inbox) {
      return null;
    }
    return (
      <div className="dt-hidden md:dt-flex dt-flex-1 dt-justify-center dt-items-center">
        {/* TODO: replace with Button to be sematic */}
        <div
          className="dt-flex dt-cursor-pointer dt-opacity-30"
          onClick={onNewThreadClick}
        >
          <icons.compose className="dt-mr-2" />
          <P>Send a new message</P>
        </div>
      </div>
    );
  }

  return (
    <div className="dt-h-full dt-flex dt-flex-1 dt-justify-between dt-w-full">
      <div className="dt-flex dt-flex-col dt-flex-1 dt-min-w-[0px]">
        <Header
          type={type}
          onClose={onModalClose}
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

                setDialectAddress('');
                navigate(RouteName.Main, {
                  sub: { name: MainRouteName.Thread },
                });
              }}
            />
          </Header.Icons>
          <Header.Title align="center">
            <div className="dt-flex dt-flex-col dt-items-center">
              <span className="dt-text-base dt-font-medium dt-text">
                {dialect && connection ? (
                  <DisplayAddress
                    connection={connection}
                    dialectMembers={dialect.dialect.members}
                    isLinkable={true}
                  />
                ) : (
                  'Loading...'
                )}
              </span>
              {dialect?.dialect.encrypted ? (
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
              <Thread />
            </Route>
            <Route name={ThreadRouteName.Settings}>
              <Settings />
            </Route>
          </Router>
        </div>
      </div>
    </div>
  );
};

export default ThreadPage;
