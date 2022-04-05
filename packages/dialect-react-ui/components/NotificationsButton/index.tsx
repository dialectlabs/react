import React, { useEffect, useRef, useState } from 'react';
import type * as anchor from '@project-serum/anchor';
import {
  ApiProvider,
  connected,
  useApi,
  WalletType,
  DialectProvider,
} from '@dialectlabs/react';
import { Transition } from '@headlessui/react';
import cs from '../../utils/classNames';
import useMobile from '../../utils/useMobile';
import Notifications, { NotificationType } from '../Notifications';
import IconButton from '../IconButton';
import {
  ThemeProvider,
  ThemeType,
  IncomingThemeVariables,
  useTheme,
} from '../common/ThemeProvider';
import type { Channel } from '../common/types';

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
  channels?: Channel[];
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
  }, [ref, bellRef, setOpen]);
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

  const isMobile = useMobile();

  useEffect(() => {
    // Prevent scrolling of backdrop content on mobile
    document.documentElement.classList[open && isMobile ? 'add' : 'remove'](
      'dt-overflow-hidden',
      'dt-static',
      'sm:overflow-auto'
    );
  }, [open, isMobile]);

  const { colors, bellButton, icons, modalWrapper } = useTheme();

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
        icon={<icons.bell className={cs('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={() => setOpen(!open)}
      />
      <Transition
        className={modalWrapper}
        show={open}
        enter="dt-transition-opacity dt-duration-300"
        enterFrom="dt-opacity-0"
        enterTo="dt-opacity-100"
        leave="dt-transition-opacity dt-duration-100"
        leaveFrom="dt-opacity-100"
        leaveTo="dt-opacity-0"
      >
        <div
          ref={wrapperRef}
          className="dt-w-full dt-h-full"
          // TODO: investigate blur
          // className="dt-w-full dt-h-full bg-white/10"
          // style={{ backdropFilter: 'blur(132px)' }}
        >
          <Notifications
            channels={props.channels}
            notifications={props?.notifications}
            toggleModal={() => setOpen((open) => !open)}
          />
        </div>
      </Transition>
    </div>
  );
}

export default function NotificationsButton({
  theme = 'dark',
  channels = ['web3'],
  variables,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <ApiProvider dapp={props.publicKey.toBase58()}>
        <DialectProvider publicKey={props.publicKey}>
          <ThemeProvider theme={theme} variables={variables}>
            <WrappedNotificationsButton channels={channels} {...props} />
          </ThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
