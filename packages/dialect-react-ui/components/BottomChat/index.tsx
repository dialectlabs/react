import { WalletIdentityProvider } from '@cardinal/namespaces-components';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import Chat from '../Chat';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';

type PropTypes = {
  dialectId: string;
};

function WrappedBottomChat({ dialectId }: PropTypes): JSX.Element {
  const { ui, open, close } = useDialectUiId(dialectId);

  const { sliderWrapper, animations } = useTheme();

  return (
    <div className={sliderWrapper}>
      {/* TODO: this transition is not fully working yet, will be adjusted. Leave animation is working, enter happens immediately */}
      <CSSTransition
        in={ui?.open ?? false}
        timeout={{
          enter: 300,
          exit: 100,
        }}
        appear
        classNames={{
          enter: animations.bottomSlide.enterFrom,
          enterActive: clsx(
            animations.bottomSlide.enter,
            animations.bottomSlide.enterTo
          ),
          enterDone: animations.bottomSlide.enterTo,
          exit: animations.bottomSlide.leaveFrom,
          exitActive: clsx(
            animations.bottomSlide.leave,
            animations.bottomSlide.leaveTo
          ),
          exitDone: animations.bottomSlide.leaveTo,
        }}
      >
        <div
          className={clsx(
            'dt-w-full dt-h-full',
            animations.bottomSlide.enterFrom
          )}
        >
          <Chat
            dialectId={dialectId}
            type="vertical-slider"
            onChatClose={close}
            onChatOpen={open}
          />
        </div>
      </CSSTransition>
    </div>
  );
}

export default function BottomChat(props: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WalletIdentityProvider>
        <WrappedBottomChat {...props} />
      </WalletIdentityProvider>
    </div>
  );
}
