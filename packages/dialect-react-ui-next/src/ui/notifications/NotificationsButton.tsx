import { useDialectContext, useUnreadMessages } from '@dialectlabs/react-sdk';
import clsx from 'clsx';
import {
  PropsWithChildren,
  ReactNode,
  RefObject,
  forwardRef,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { ChannelType, ThemeType } from '../../types';
import { ClassTokens, Icons } from '../theme';
import { NotificationsBase } from './Notifications';
import { useClickAway } from './internal/useClickAway';

const Modal = forwardRef<
  HTMLDivElement,
  {
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    channels?: ChannelType[];
    theme?: ThemeType;
  }
>(function Modal(props, modalRef) {
  if (!props.open) {
    return null;
  }
  return (
    <div ref={modalRef} className="dt-modal">
      <NotificationsBase {...props} />
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
        ClassTokens.Radius.Small,
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
  theme,
  children,
}: PropsWithChildren<{ theme?: ThemeType }>) => {
  return (
    <div className="dialect" data-theme={theme}>
      <div className={clsx('dt-relative', ClassTokens.Text.Primary)}>
        {children}
      </div>
    </div>
  );
};

interface NotificationsButtonProps {
  children?: (args: {
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    unreadCount: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: RefObject<any>;
  }) => ReactNode | ReactNode[];
  renderModalComponent?: (args: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ref: RefObject<any>;
    open: boolean;
    setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
    children: ReactNode;
  }) => ReactNode;
  channels?: ChannelType[];
  theme?: ThemeType;
}

NotificationsButtonPresentation.Container =
  function NotificationsButtonContainer({
    channels,
    renderModalComponent,
    children,
    theme,
  }: NotificationsButtonProps) {
    const buttonRef = useRef<HTMLButtonElement | null>(null);
    const modalRef = useRef<HTMLDivElement | null>(null);

    const [open, setOpen] = useState(false);

    const { dappAddress } = useDialectContext();
    const { unreadCount } = useUnreadMessages({
      otherMembers: [dappAddress],
      refreshInterval: open ? 0 : 10000,
    });

    useClickAway([buttonRef, modalRef], () => setOpen(false));

    const externalProps = useMemo(
      () => ({ open, setOpen, channels, theme }),
      [open, channels, theme],
    );
    const toggle = useCallback(() => setOpen((prev) => !prev), []);

    return (
      <NotificationsButtonPresentation theme={theme}>
        {/* Button Render */}
        {children ? (
          children({ open, setOpen, unreadCount, ref: buttonRef })
        ) : (
          <DefaultNotificationIconButton
            ref={buttonRef}
            open={open}
            onClick={toggle}
            unread={unreadCount > 0}
          />
        )}
        {/* Modal Render */}
        {renderModalComponent ? (
          renderModalComponent({
            open,
            setOpen,
            ref: modalRef,
            children: <NotificationsBase {...externalProps} />, // `children` MUST BE USED
          })
        ) : (
          <Modal ref={modalRef} {...externalProps} />
        )}
      </NotificationsButtonPresentation>
    );
  };

export const NotificationsButton = NotificationsButtonPresentation.Container;
