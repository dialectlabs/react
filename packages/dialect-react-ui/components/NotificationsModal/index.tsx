import { useEffect, forwardRef } from 'react';
import { Transition } from '@headlessui/react';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import Notifications, {
  NotificationType,
  RemoteNotificationExtension,
} from '../Notifications';
import {
  ThemeAnimations,
  useTheme,
} from '../common/providers/DialectThemeProvider';
import useMobile from '../../utils/useMobile';
import clsx from 'clsx';
import type { AccountAddress } from '@dialectlabs/react-sdk';

interface NotificationsModalProps {
  dappAddress: AccountAddress;
  wrapperClassName?: string;
  className?: string;
  animationStyle?: string;
  settingsOnly?: boolean;
  standalone?: boolean;

  dialectId: string;

  notifications?: NotificationType[];
  remoteNotificationExtensions?: RemoteNotificationExtension[];
  channels?: Channel[];
  gatedView?: string | JSX.Element;
  pollingInterval?: number;

  onBackClick?: () => void;

  Component?: (props: any) => JSX.Element;
}

const NotificationsModal = forwardRef<HTMLDivElement, NotificationsModalProps>(
  function InnerNotificationsModalWithRef(
    {
      wrapperClassName,
      animationStyle,
      dialectId,
      standalone,
      Component = Notifications,
      ...props
    }: NotificationsModalProps,
    ref
  ) {
    const { modalWrapper, modalBackdrop, animations } = useTheme();
    const { ui, close } = useDialectUiId(dialectId);

    const isMobile = useMobile();

    useEffect(() => {
      // Prevent scrolling of backdrop content on mobile
      document.documentElement.classList[
        ui?.open && (isMobile || standalone) ? 'add' : 'remove'
      ](
        ...clsx(
          'dt-overflow-hidden',
          'dt-static',
          !standalone && 'sm:dt-overflow-auto'
        ).split(' ')
      );
    }, [ui?.open, isMobile, standalone]);

    const animationKey = (animationStyle || 'popup') as ThemeAnimations;
    // TODO: fix types
    const animationProps = animations[animationKey];

    return (
      <div className="dialect dt-w-full dt-h-full">
        {/* Modal backdrop */}
        {ui?.open && standalone ? <div className={modalBackdrop} /> : null}
        <Transition
          className={clsx(modalWrapper, wrapperClassName)}
          show={ui?.open ?? false}
          {...animationProps}
        >
          <div ref={ref} className="dt-w-full dt-h-full">
            <Component onModalClose={close} {...props} />
          </div>
        </Transition>
      </div>
    );
  }
);

export default NotificationsModal;
