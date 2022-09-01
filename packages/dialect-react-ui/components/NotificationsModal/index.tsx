import { useEffect, forwardRef } from 'react';
import { Transition } from '@headlessui/react';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import type { Channel } from '../common/types';
import Notifications, { NotificationType } from '../Notifications';
import { useTheme } from '../common/providers/DialectThemeProvider';
import useMobile from '../../utils/useMobile';
import clsx from 'clsx';

interface NotificationsModalProps {
  wrapperClassName?: string;
  className?: string;
  animationStyle?: string;
  settingsOnly?: boolean;
  standalone?: boolean;

  dialectId: string;

  notifications?: NotificationType[];
  channels?: Channel[];
  gatedView?: string | JSX.Element;
  pollingInterval?: number;

  onBackClick?: () => void;
}

const NotificationsModal = forwardRef(function InnerNotificationsModalWithRef(
  {
    wrapperClassName,
    animationStyle,
    dialectId,
    standalone,
    ...props
  }: NotificationsModalProps,
  ref
) {
  const { modalWrapper, animations } = useTheme();
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

  const animationKey = animationStyle || 'popup';
  // TODO: fix types
  const animationProps = animations[animationKey];

  return (
    <div className="dialect dt-w-full dt-h-full">
      {/* Page content overflow */}
      {ui?.open && standalone ? (
        <div className="dt-fixed dt-top-0 dt-bottom-0 dt-right-0 dt-left-0 dt-w-full dt-h-full dt-z-[99] dt-bg-black/50" />
      ) : null}
      <Transition
        className={clsx(modalWrapper, wrapperClassName)}
        show={ui?.open ?? false}
        {...animationProps}
      >
        {/* TODO: fix type error */}
        <div ref={ref} className="dt-w-full dt-h-full">
          <Notifications onModalClose={close} {...props} />
        </div>
      </Transition>
    </div>
  );
});

export default NotificationsModal;
