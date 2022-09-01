import clsx from 'clsx';
import { DEFAULT_NOTIFICATIONS_CHANNELS } from '../common/constants';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { Channel } from '../common/types';
import type { NotificationType } from '../Notifications';
import Subscribe from '../Subscribe';

export type PropTypes = {
  onWalletConnect: () => void;
  dialectId: string;
  notifications?: NotificationType[];
  channels?: Channel[];
  onBackClick?: () => void;
  pollingInterval?: number;
};

function WrappedSubscribeButton(props: PropTypes): JSX.Element {
  const { colors } = useTheme();
  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.textPrimary
      )}
    >
      <Subscribe {...props} />
    </div>
  );
}

export default function SubscribeButton({
  channels = DEFAULT_NOTIFICATIONS_CHANNELS,
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WrappedSubscribeButton channels={channels} {...props} />
    </div>
  );
}
