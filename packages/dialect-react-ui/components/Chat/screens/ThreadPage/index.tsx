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
  const { navigate, current } = useRoute();
  const { wallet, program } = useApi();
  const { dialect, dialectAddress, setDialectAddress } = useDialect();
  const { icons, xPaddedText } = useTheme();
  const { type, onChatOpen, id } = useChatInternal();
  const { ui } = useDialectUiId(id);
  const inbox = type === 'inbox';

  useEffect(() => {
    setDialectAddress('');
  }, [wallet]);

  if (!dialectAddress) {
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
                      sub: { name: ThreadRouteName.Messages },
                    },
                  });
                  return;
                }
                setDialectAddress('');
              }}
            />
          </Header.Icons>
          <Header.Title align="center">
            <div className="dt-flex dt-flex-col dt-items-center">
              <span className="dt-text-base dt-font-medium dt-text">
                {dialect && program ? (
                  <DisplayAddress
                    connection={program?.provider.connection}
                    dialectMembers={dialect?.dialect.members}
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
