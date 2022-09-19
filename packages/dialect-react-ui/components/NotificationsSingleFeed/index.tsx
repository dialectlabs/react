import { useSingleFeed } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import { Notification } from '../../entities/notifications/Notification';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import { Footer } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Header } from './Header';

interface NotificationsSingleFeedProps {
  pollingInterval?: number;
}

const NotificationsSingleFeedInternal = ({
  pollingInterval,
}: NotificationsSingleFeedProps) => {
  const { scrollbar } = useTheme();
  const { data } = useSingleFeed({ pollingInterval });

  return (
    <div className="dt-h-full dt-pb-[3.5rem]">
      <Header />
      <div className={clsx('dt-h-full dt-overflow-y-auto dt-px-4', scrollbar)}>
        {data.map((msg, index) => {
          return (
            <Notification
              key={index}
              message={msg.text}
              timestamp={msg.timestamp}
              author={msg.author}
            />
          );
        })}
        <Footer />
      </div>
    </div>
  );
};

export const NotificationsSingleFeed = ({
  pollingInterval,
}: NotificationsSingleFeedProps) => {
  const { colors } = useTheme();

  const header = <Header />;

  return (
    <div className="dialect dt-h-full">
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.textPrimary,
          colors.bg
        )}
      >
        <WalletStatesWrapper header={header}>
          <ConnectionWrapper header={header} pollingInterval={pollingInterval}>
            <NotificationsSingleFeedInternal />
          </ConnectionWrapper>
        </WalletStatesWrapper>
      </div>
    </div>
  );
};
