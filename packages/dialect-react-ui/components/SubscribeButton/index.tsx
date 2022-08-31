import clsx from 'clsx';
import { useTheme } from '../common/providers/DialectThemeProvider';
import type { Channel } from '../common/types';
import type { NotificationType } from '../Notifications';
import Subscribe from '../Subscribe';

export type PropTypes = {
  onWalletConnect: () => void;
  dialectId: string;
  bellClassName?: string;
  bellStyle?: object;
  notifications: NotificationType[];
  gatedView?: string | JSX.Element;
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
  channels = ['web3', 'telegram', 'sms', 'email'],
  ...props
}: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WrappedSubscribeButton channels={channels} {...props} />
    </div>
  );
}
