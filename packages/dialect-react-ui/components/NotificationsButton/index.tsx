import { useEffect, useRef, useState } from 'react';
import type * as anchor from '@project-serum/anchor';
import {
  ApiProvider,
  connected,
  useApi,
  DialectProvider,
  useDialect,
} from '@dialectlabs/react';
import type { WalletType } from '@dialectlabs/react';
import { Transition } from '@headlessui/react';
import cs from '../../utils/classNames';
import useMobile from '../../utils/useMobile';
import {
  DialectThemeProvider,
  ThemeType,
  IncomingThemeVariables,
  useTheme,
} from '../common/providers/DialectThemeProvider';
import type { Channel } from '../common/types';
import Notifications, { NotificationType } from '../Notifications';
import IconButton from '../IconButton';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import clsx from 'clsx';

export type PropTypes = {
  dialectId: string;
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
  onBackClick?: () => void;
  pollingInterval?: number;
};

function WrappedNotificationsButton(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const [hasNewMessages, setHasNewMessages] = useState(false);

  useOutsideAlerter(wrapperRef, bellRef, close);

  const { setWallet, setNetwork, setRpcUrl, saveLastReadMessage } = useApi();
  const isWalletConnected = connected(props.wallet);

  const { messages, checkUnreadMessages } = useDialect();

  useEffect(() => {
    if (!ui?.open) {
      setHasNewMessages(checkUnreadMessages('notifications'));
    }
  }, [checkUnreadMessages, messages, ui?.open]);

  useEffect(() => {
    if (ui?.open) {
      saveLastReadMessage('notifications', messages[0]?.timestamp);
      setHasNewMessages(checkUnreadMessages('notifications'));
    }
  }, [checkUnreadMessages, messages, saveLastReadMessage, ui?.open]);

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
    document.documentElement.classList[ui?.open && isMobile ? 'add' : 'remove'](
      'dt-overflow-hidden',
      'dt-static',
      'sm:dt-overflow-auto'
    );
  }, [ui?.open, isMobile]);

  const { colors, bellButton, icons, modalWrapper, animations } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.primary
      )}
    >
      {hasNewMessages && (
        <div
          className={clsx(
            'dt-absolute dt-h-3 dt-w-3 dt-z-50 dt-rounded-full',
            colors.notificationBadgeColor
          )}
        ></div>
      )}
      <IconButton
        ref={bellRef}
        className={clsx(
          'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.bell className={cs('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={ui?.open ? close : open}
      />
      <Transition
        className={modalWrapper}
        show={ui?.open ?? false}
        {...animations.popup}
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
            onModalClose={close}
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
        <DialectProvider
          pollingInterval={props.pollingInterval}
          publicKey={props.publicKey}
        >
          <DialectThemeProvider theme={theme} variables={variables}>
            <WrappedNotificationsButton channels={channels} {...props} />
          </DialectThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
