import { useSingleFeed } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import LoadingThread from '../../entities/LoadingThread';
import NoNotifications from '../../entities/notifications/NoNotifications';
import { Notification } from '../../entities/notifications/Notification';
import ConnectionWrapper from '../../entities/wrappers/ConnectionWrapper';
import WalletStatesWrapper from '../../entities/wrappers/WalletStatesWrapper';
import { Footer } from '../common';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { Header } from './Header';

interface NotificationsSingleFeedProps {
  pollingInterval?: number;
  onModalClose?: () => void;
}

const NotificationsSingleFeedInternal = ({
  pollingInterval,
  onModalClose,
}: NotificationsSingleFeedProps) => {
  const { scrollbar } = useTheme();
  const { data, isLoading } = useSingleFeed({ pollingInterval });

  return (
    <div className="dt-h-full dt-pb-[3.5rem]">
      <Header onModalClose={onModalClose} />
      <div
        className={clsx(
          'dt-h-full dt-overflow-y-auto dt-p-4 dt-pb-0',
          scrollbar
        )}
      >
        {isLoading && <LoadingThread />}
        {!data.length && <NoNotifications />}
        {data.map((msg, index) => (
          <Notification
            key={index}
            message={msg.text}
            timestamp={msg.timestamp}
            author={msg.author}
          />
        ))}
        <Footer />
      </div>
    </div>
  );
};

export const NotificationsSingleFeed = ({
  onModalClose,
  pollingInterval,
}: NotificationsSingleFeedProps) => {
  const { colors, modal } = useTheme();

  const header = <Header onModalClose={onModalClose} />;

  return (
    <div className="dialect dt-h-full">
      <div
        className={clsx(
          'dt-flex dt-flex-col dt-h-full dt-overflow-hidden',
          colors.textPrimary,
          colors.bg,
          modal
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
