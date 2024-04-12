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
    open: boolean;
    onClick: () => void;
    unread?: boolean;
  }
>(function DefaultNotificationIconButton({ open, onClick, unread }, ref) {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={clsx(
        'dt-group dt-relative dt-p-3 dt-transition-colors dt-duration-200 dt-ease-in-out',
        ClassTokens.Background.Button.Secondary.Default,
        ClassTokens.Background.Button.Secondary.Hover,
        ClassTokens.Radius.Medium,
      )}
    >
      <div className="dt-relative">
        {unread && (
          <span
            className={clsx(
              'dt-absolute dt-right-0 dt-top-[1px] dt-h-2 dt-w-2 dt-rounded-full dt-border-2 dt-border-[--dt-button-secondary] dt-transition-colors dt-duration-200 dt-ease-in-out group-hover:dt-border-[--dt-button-secondary-hover]',
              ClassTokens.Background.Success,
            )}
          />
        )}
        {open ? <Icons.BellButton /> : <Icons.BellButtonOutline />}
      </div>
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
                open={open}
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
