import { useEffect } from 'react';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
  DialectProvider,
} from '@dialectlabs/react';
import {
  DialectThemeProvider,
  ThemeType,
  IncomingThemeVariables,
  useTheme,
} from '../common/providers/DialectThemeProvider';
import Chat from '../Chat';
import { WalletIdentityProvider } from '@cardinal/namespaces-components';
import clsx from 'clsx';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { CSSTransition } from 'react-transition-group';

type PropTypes = {
  dialectId: string;
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  theme?: ThemeType;
  variables?: IncomingThemeVariables;
  bellClassName?: string;
  bellStyle?: object;
};

function WrappedBottomChat(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);
  const { setWallet, setNetwork, setRpcUrl } = useApi();
  const isWalletConnected = connected(props.wallet);

  useEffect(
    () => setWallet(connected(props.wallet) ? props.wallet : null),
    [props.wallet, isWalletConnected, setWallet]
  );
  useEffect(
    () => setNetwork(props.network || null),
    [props.network, setNetwork]
  );
  useEffect(() => setRpcUrl(props.rpcUrl || null), [props.rpcUrl, setRpcUrl]);

  const { sliderWrapper, animations } = useTheme();

  return (
    // Disable pointer-events to allow browse/select content behind the bottom chat box
    <div className={clsx('dt-pointer-events-none', sliderWrapper)}>
      <CSSTransition
        in={ui?.open ?? false}
        timeout={{
          enter: 300,
          exit: 100,
        }}
        appear
        classNames={{
          enter: animations.bottomSlide.enterFrom,
          enterActive: clsx(
            animations.bottomSlide.enter,
            animations.bottomSlide.enterTo
          ),
          enterDone: animations.bottomSlide.enterTo,
          exit: animations.bottomSlide.leaveFrom,
          exitActive: clsx(
            animations.bottomSlide.leave,
            animations.bottomSlide.leaveTo
          ),
          exitDone: animations.bottomSlide.leaveTo,
        }}
      >
        <div
          className={clsx(
            // Enable pointer-events here to allow
            'dt-w-full dt-h-full dt-pointer-events-auto',
            animations.bottomSlide.enterFrom
          )}
        >
          <Chat
            dialectId={props.dialectId}
            type="vertical-slider"
            onChatClose={close}
            onChatOpen={open}
          />
        </div>
      </CSSTransition>
    </div>
  );
}

export default function BottomChat({
  theme = 'dark',
  variables,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <ApiProvider>
        <DialectProvider>
          <WalletIdentityProvider>
            <DialectThemeProvider theme={theme} variables={variables}>
              <WrappedBottomChat {...props} />
            </DialectThemeProvider>
          </WalletIdentityProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
