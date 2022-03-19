import React, { useEffect, useRef, useState } from 'react';
import * as anchor from '@project-serum/anchor';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
  DialectProvider,
} from '@dialectlabs/react';
import { Transition } from '@headlessui/react';
import cs from '../../utils/classNames';
import Notifications, { NotificationType } from '../Notifications';
import IconButton from '../IconButton';
import {
  ThemeProvider,
  ThemeType,
  IncomingThemeVariables,
  useTheme,
} from '../common/ThemeProvider';

type PropTypes = {
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  publicKey: anchor.web3.PublicKey;
  theme?: ThemeType;
  variables?: IncomingThemeVariables;
  bellClassName?: string;
  bellStyle?: object;
  notifications: NotificationType[];
};

function useOutsideAlerter(
  ref: React.MutableRefObject<null>,
  bellRef: React.MutableRefObject<null>,
  setOpen: CallableFunction
) {
  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        bellRef.current &&
        !bellRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
}

function WrappedNotificationsButton(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const wrapperRef = useRef(null);
  const bellRef = useRef(null);
  const [open, setOpen] = useState(false);
  useOutsideAlerter(wrapperRef, bellRef, setOpen);
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

  const { colors, bellButton, icons, modalWrapper } = useTheme();

  return (
    <div className={cs('flex flex-col items-end relative', colors.primary)}>
      <IconButton
        ref={bellRef}
        className={cs(
          'flex items-center justify-center rounded-full focus:outline-none shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.bell className={cs('w-6 h-6 rounded-full')} />}
        onClick={() => setOpen(!open)}
      ></IconButton>
      <Transition
        className={modalWrapper}
        show={open}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          ref={wrapperRef}
          className="w-full h-full"
          // TODO: investigate blur
          // className="w-full h-full bg-white/10"
          // style={{ backdropFilter: 'blur(132px)' }}
        >
          <Notifications notifications={props?.notifications} />
        </div>
      </Transition>
    </div>
  );
}

export default function NotificationsButton({
  theme = 'dark',
  variables,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <ApiProvider>
        <DialectProvider publicKey={props.publicKey}>
          <ThemeProvider theme={theme} variables={variables}>
            <WrappedNotificationsButton {...props} />
          </ThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
