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

type PropTypes = {
  id: string;
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
  const { ui, open, close } = useDialectUiId(props.id);
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
    <div
      className={clsx(
        // TODO: styling is not very intuitive and breaks the thought process, a lot.
        sliderWrapper,
        ui?.open ? animations.bottomSlide.enter : animations.bottomSlide.leave,
        ui?.open
          ? animations.bottomSlide.leaveTo
          : animations.bottomSlide.enterTo
      )}
    >
      <div className="dt-w-full dt-h-full">
        <Chat
          id={props.id}
          type="vertical-slider"
          onChatClose={close}
          onChatOpen={open}
        />
      </div>
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