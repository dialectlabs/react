import { useDialectContext, useUnreadMessages } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import {
  PropsWithChildren,
  ReactNode,
  RefObject,
  forwardRef,
  useRef,
} from 'react';
import { ClassTokens, Icons } from '../theme';
import { Notifications } from './Notifications';
import { ModalStateProvider } from './internal/ModalStateProvider';
import { useClickAway } from './internal/useClickAway';

const Modal = forwardRef<HTMLDivElement, { open: boolean }>(function Modal(
  { open },
  modalRef,
) {
  if (!open) {
    return null;
  }
  return (
    <div ref={modalRef} className="dt-modal">
      {<Notifications />}
    </div>
  );
});

const DefaultNotificationIconButton = forwardRef<
  HTMLButtonElement,
  {
    onClick: () => void;
    unread?: boolean;
  }
>(function DefaultNotificationIconButton({ onClick, unread }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={clsx(
        'dt-relative dt-p-3',
        ClassTokens.Background.Tertiary,
        ClassTokens.Radius.Medium,
      )}
    >
      {unread && (
        <span
          className={clsx(
            'dt-absolute -dt-right-1 -dt-top-1 dt-h-3 dt-w-3 dt-rounded-full',
            ClassTokens.Background.Success,
          )}
        />
      )}
      <Icons.BellButton />
    </button>
  );
});

const NotificationsButtonPresentation = ({
  clickAwayRefs,
  setOpen,
  children,
}: PropsWithChildren<{
  setOpen: (open: boolean) => void;
  clickAwayRefs: RefObject<HTMLElement | null>[];
}>) => {
  useClickAway(clickAwayRefs, () => setOpen(false));

  return <div className="dt-relative">{children}</div>;
};

interface NotificationsButtonProps {
  children?: (args: {
    open: boolean;
    setOpen: (open: boolean) => void;
    unreadCount: number;
    ref: RefObject<HTMLElement | null>;
  }) => ReactNode | ReactNode[];
}

NotificationsButtonPresentation.Container =
  function NotificationButtonContainer({ children }: NotificationsButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const { dappAddress } = useDialectContext();
    const { unreadCount } = useUnreadMessages({
      otherMembers: [dappAddress],
      refreshInterval: 20000,
    });

    return (
      <ModalStateProvider>
        {({ open, setOpen }) => (
          <NotificationsButtonPresentation
            clickAwayRefs={[buttonRef, modalRef]}
            setOpen={setOpen}
          >
            {children ? (
              children({ open, setOpen, unreadCount, ref: buttonRef })
            ) : (
              <DefaultNotificationIconButton
                ref={buttonRef}
                onClick={() => setOpen((prev) => !prev)}
                unread={unreadCount > 0}
              />
            )}
            <Modal ref={modalRef} open={open} />
          </NotificationsButtonPresentation>
        )}
      </ModalStateProvider>
    );
  };

export const NotificationsButton = NotificationsButtonPresentation.Container;
