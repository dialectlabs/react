import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import Chat from '../Chat';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import IconButton from '../IconButton';
import { useUnreadMessages } from '@dialectlabs/react-sdk';
import { UnreadMessagesBadge } from '../common';
import { DEFAULT_POLLING_INTERVAL } from '../Chat/provider';

type PropTypes = {
  dialectId: string;
  bellClassName?: string;
  bellStyle?: object;
  pollingInterval?: number;
};

function WrappedChatButton(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);
  const { unreadCount } = useUnreadMessages({
    refreshInterval: props.pollingInterval ?? DEFAULT_POLLING_INTERVAL,
  });

  const refs = useRef<HTMLElement[]>([]);

  useOutsideAlerter(refs, close);

  const { colors, bellButton, icons, modalWrapper, animations } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.textPrimary
      )}
    >
      <div className="dt-relative">
        <IconButton
          ref={(el) => {
            if (!el) return;
            refs.current[0] = el;
          }}
          className={clsx(
            'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
            colors.bg,
            bellButton
          )}
          icon={
            <icons.chat className={clsx('dt-w-6 dt-h-6 dt-rounded-full')} />
          }
          onClick={ui?.open ? close : open}
        />
        <div className="dt-absolute -dt-top-1 -dt-right-1">
          <UnreadMessagesBadge amount={unreadCount} />
        </div>
      </div>
      <Transition
        className={modalWrapper}
        show={ui?.open ?? false}
        {...animations.popup}
      >
        <div
          ref={(el) => {
            if (!el) return;
            refs.current[1] = el;
          }}
          className="dt-w-full dt-h-full"
        >
          <Chat
            dialectId={props.dialectId}
            type="popup"
            onChatClose={close}
            pollingInterval={props.pollingInterval}
          />
        </div>
      </Transition>
    </div>
  );
}

export default function ChatButton(props: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WrappedChatButton {...props} />
    </div>
  );
}
