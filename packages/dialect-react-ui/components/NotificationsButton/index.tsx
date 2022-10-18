import { AccountAddress, useUnreadMessages } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { useRef } from 'react';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import { DEFAULT_NOTIFICATIONS_CHANNELS } from '../common/constants';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import IconButton from '../IconButton';
import type { NotificationType } from '../Notifications';
import NotificationsModal from '../NotificationsModal';

const DEFAULT_POLLING_FOR_NOTIFICATIONS = 15000; // 15 sec refresh default

export type PropTypes = {
  dialectId: string;
  dappAddress: AccountAddress;
  bellClassName?: string;
  bellStyle?: object;
  notifications?: NotificationType[];
  gatedView?: string | JSX.Element;
  channels?: Channel[];
  onBackClick?: () => void;
  pollingInterval?: number;
  Component?: (props: any) => JSX.Element;
};

function WrappedNotificationsButton(props: PropTypes): JSX.Element {
  const { dappAddress } = props;
  const { ui, open, close } = useDialectUiId(props.dialectId);
  const { colors, bellButton, icons } = useTheme();

  const { hasUnreadMessages } = useUnreadMessages({
    otherMembers: dappAddress ? [dappAddress] : [],
    refreshInterval: props.pollingInterval,
  });

  const refs = useRef<HTMLElement[]>([]);
  useOutsideAlerter(refs, close);

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.textPrimary
      )}
    >
      {hasUnreadMessages && (
        <div
          className={clsx(
            'dt-absolute dt-h-3 dt-w-3 dt-z-50 dt-rounded-full',
            colors.notificationBadgeColor
          )}
        ></div>
      )}
      <IconButton
        ref={(el) => {
          if (!el) return;
          refs.current[0] = el;
        }}
        className={clsx(
          'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.bell className={clsx('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={ui?.open ? close : open}
      />
      <NotificationsModal
        ref={(el) => {
          if (!el) return;
          refs.current[0] = el;
        }}
        {...props}
      />
    </div>
  );
}

export default function NotificationsButton({
  channels = DEFAULT_NOTIFICATIONS_CHANNELS,
  pollingInterval = DEFAULT_POLLING_FOR_NOTIFICATIONS,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WrappedNotificationsButton
        channels={channels}
        pollingInterval={pollingInterval}
        {...props}
      />
    </div>
  );
}
