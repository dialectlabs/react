import { useEffect, useRef, useState } from 'react';
import type { PropTypes } from "../NotificationsButton";
import { useOutsideAlerter } from "../NotificationsButton";
import type { WalletType } from '@dialectlabs/react';
import {
  ApiProvider,
  connected,
  DialectProvider,
  useApi,
} from '@dialectlabs/react';
import {
  ThemeProvider,
} from '../common/ThemeProvider';
import type { Channel } from '../common/types';
import Notifications, { NotificationType } from '../Notifications';

type ModalProps = {
  wallet: WalletType;
  network?: string;
  rpcUrl?: string;
  notifications: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
};

function Modal({
  channels = ['web3'],
  ...props
}: ModalProps): JSX.Element {
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
        onModalClose={() => {}}
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
          <ThemeProvider theme={theme} variables={variables}>
            <Modal
              channels={channels}
              notifications={props?.notifications}
              wallet={props?.wallet}
              network={props?.network}
              rpcUrl={props?.rpcUrl}
              onBackClick={props?.onBackClick}
            />
          </ThemeProvider>
        </DialectProvider>
      </ApiProvider>
    </div>
  );
}