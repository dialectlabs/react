import { useEffect, useRef } from 'react';
import type { PropTypes } from '../NotificationsButton';
import type { WalletType } from '@dialectlabs/react';
import {
  ApiProvider,
  connected,
  DialectProvider,
  useApi,
} from '@dialectlabs/react';
import { DialectThemeProvider } from '../common/providers/DialectThemeProvider';
import type { Channel } from '../common/types';
import Notifications, { NotificationType } from '../Notifications';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';

type ModalProps = {
  dialectId: string;
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  notifications: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
};

// TODO: deprecate or reuse?
function Modal({ channels = ['web3'], ...props }: ModalProps): JSX.Element {
  const { close } = useDialectUiId(props.dialectId);

  const wrapperRef = useRef(null);
  const bellRef = useRef(null);

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

  return (
    <div
      ref={wrapperRef}
      className="dt-w-full dt-h-full"
      // TODO: investigate blur
      // className="dt-w-full dt-h-full bg-white/10"
      // style={{ backdropFilter: 'blur(132px)' }}
    >
      <Notifications
        channels={channels}
        notifications={props?.notifications}
        onModalClose={close}
        onBackClick={props?.onBackClick}
      />
    </div>
  );
}

export default function NotificationModal({
  theme = 'dark',
  channels = ['web3'],
  variables,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect dt-w-full dt-h-full">
      <ApiProvider dapp={props.publicKey.toBase58()}>
        <DialectProvider publicKey={props.publicKey}>
          <DialectThemeProvider theme={theme} variables={variables}>
            <Modal channels={channels} {...props} />
          </DialectThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}
