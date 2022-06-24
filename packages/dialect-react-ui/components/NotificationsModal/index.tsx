import { useRef } from 'react';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import Notifications, { NotificationType } from '../Notifications';
import type { PropTypes } from '../NotificationsButton';

type ModalProps = {
  dialectId: string;
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
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect dt-w-full dt-h-full">
      <Modal {...props} />
    </div>
  );
}
