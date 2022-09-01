import { useEffect, useRef } from 'react';
import { Transition } from '@headlessui/react';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
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

// TODO: deprecate or reuse?
function InnerNotificationsModal({
  wrapperClassName,
  animationStyle,
  dialectId,
  standalone,
  ...props
}: NotificationsModalProps): JSX.Element {
  const { modalWrapper, animations } = useTheme();
  const { ui, open, close } = useDialectUiId(dialectId);

  const refs = useRef<HTMLDivElement[]>([]);
  useOutsideAlerter(refs, close);

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
    <>
      {/* Page content overflow */}
      {ui?.open && standalone ? (
        <div className="dt-fixed dt-top-0 dt-bottom-0 dt-right-0 dt-left-0 dt-w-full dt-h-full dt-z-[99] dt-bg-black/50" />
      ) : null}
      <Transition
        className={clsx(modalWrapper, wrapperClassName)}
        show={ui?.open ?? false}
        {...animationProps}
      >
        <div
          ref={(el) => {
            if (!el) return;
            refs.current[0] = el;
          }}
          className="dt-w-full dt-h-full"
        >
          <Notifications onModalClose={close} {...props} />
        </div>
      </Transition>
    </>
  );
}

export default function NotificationsModal(
  props: NotificationsModalProps
): JSX.Element {
  return (
    <div className={clsx('dialect dt-w-full dt-h-full')}>
      <InnerNotificationsModal {...props} />
    </div>
  );
}
