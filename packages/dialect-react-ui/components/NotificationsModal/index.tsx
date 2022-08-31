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
  dialectId: string;
  wrapperClassName?: string;
  className?: string;
  notifications: NotificationType[];
  gatedView?: string | JSX.Element;
  channels?: Channel[];
  onBackClick?: () => void;
  pollingInterval?: number;
}

// TODO: deprecate or reuse?
function InnerNotificationsModal(props: NotificationsModalProps): JSX.Element {
  const { modalWrapper, animations } = useTheme();
  const { ui, open, close } = useDialectUiId(props.dialectId);

  const refs = useRef<HTMLDivElement[]>([]);
  useOutsideAlerter(refs, close);

  const isMobile = useMobile();

  useEffect(() => {
    // Prevent scrolling of backdrop content on mobile
    document.documentElement.classList[ui?.open && isMobile ? 'add' : 'remove'](
      'dt-overflow-hidden',
      'dt-static',
      'sm:dt-overflow-auto'
    );
  }, [ui?.open, isMobile]);

  return (
    <Transition
      className={clsx(modalWrapper, props.wrapperClassName)}
      show={ui?.open ?? false}
      {...animations.popup}
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
  );
}

export default function NotificationsModal(
  props: NotificationsModalProps
): JSX.Element {
  return (
    <div className={clsx('dialect dt-w-full dt-h-full', props?.className)}>
      <InnerNotificationsModal {...props} />
    </div>
  );
}
