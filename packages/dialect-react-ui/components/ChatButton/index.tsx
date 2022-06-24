import { WalletIdentityProvider } from '@cardinal/namespaces-components';
import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { useRef } from 'react';
import { useOutsideAlerter } from '../../utils/useOutsideAlerter';
import Chat from '../Chat';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';
import IconButton from '../IconButton';

type PropTypes = {
  dialectId: string;
  bellClassName?: string;
  bellStyle?: object;
};

function WrappedChatButton(
  props: Omit<PropTypes, 'theme' | 'variables'>
): JSX.Element {
  const { ui, open, close } = useDialectUiId(props.dialectId);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  useOutsideAlerter(wrapperRef, bellRef, close);

  const { colors, bellButton, icons, modalWrapper, animations } = useTheme();

  return (
    <div
      className={clsx(
        'dt-flex dt-flex-col dt-items-end dt-relative',
        colors.primary
      )}
    >
      <IconButton
        ref={bellRef}
        className={clsx(
          'dt-flex dt-items-center dt-justify-center dt-rounded-full focus:dt-outline-none dt-shadow-md',
          colors.bg,
          bellButton
        )}
        icon={<icons.chat className={clsx('dt-w-6 dt-h-6 dt-rounded-full')} />}
        onClick={ui?.open ? close : open}
      ></IconButton>
      <Transition
        className={modalWrapper}
        show={ui?.open ?? false}
        {...animations.popup}
      >
        <div ref={wrapperRef} className="dt-w-full dt-h-full">
          <Chat dialectId={props.dialectId} type="popup" onChatClose={close} />
        </div>
      </Transition>
    </div>
  );
}

export default function ChatButton({ ...props }: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WalletIdentityProvider>
        <WrappedChatButton {...props} />
      </WalletIdentityProvider>
    </div>
  );
}
