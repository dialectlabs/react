import { useEffect, useState } from 'react';
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

type PropTypes = {
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
  const [open, setOpen] = useState(false);
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

  const { colors, bellButton, icons, modalWrapper, animations } = useTheme();

  return (
    <div
      className={clsx(
        // TODO: move to theme, also this styling is not very intuitive and breaks the thought process, a lot.
        'dt-fixed sm:dt-w-[30rem] sm:dt-h-[40rem] sm:dt-right-10 sm:dt-top-auto dt-bottom-14',
        open ? animations.bottomSlide.enter : animations.bottomSlide.leave,
        open ? animations.bottomSlide.leaveTo : animations.bottomSlide.enterTo
      )}
    >
      <div className="dt-w-full dt-h-full">
        <Chat onChatClose={() => setOpen(false)} />
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
