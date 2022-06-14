import { useEffect, useRef } from 'react';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
  DialectProvider,
} from '@dialectlabs/react';
import { Transition } from '@headlessui/react';
import cs from '../../utils/classNames';
import {
  DialectThemeProvider,
  ThemeType,
  IncomingThemeVariables,
  useTheme,
} from '../common/providers/DialectThemeProvider';
import Chat from '../Chat';
import IconButton from '../IconButton';
import { WalletIdentityProvider } from '@cardinal/namespaces-components';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';

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

function WrappedChatButton(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  useOutsideAlerter(wrapperRef, bellRef, close);

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
      className={cs(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.primary
      )}
    >
      <IconButton
        ref={bellRef}
        className={cs(
          'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.chat className={cs('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={ui?.open ? close : open}
      ></IconButton>
      <Transition
        className={modalWrapper}
        show={ui?.open ?? false}
        {...animations.popup}
      >
        <div ref={wrapperRef} className="dt-w-full dt-h-full">
          <Chat dialectId={props.id} type="popup" onChatClose={close} />
        </div>
      </Transition>
    </div>
  );
}

export default function ChatButton({
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
              <WrappedChatButton {...props} />
            </DialectThemeProvider>
          </WalletIdentityProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
