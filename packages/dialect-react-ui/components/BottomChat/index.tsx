import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import Chat from '../Chat';
import { useTheme } from '../common/providers/DialectThemeProvider';
import { useDialectUiId } from '../common/providers/DialectUiManagementProvider';

type PropTypes = {
  dialectId: string;
  pollingInterval?: number;
};

function WrappedBottomChat({
  dialectId,
  pollingInterval,
}: PropTypes): JSX.Element {
  const { ui, open, close } = useDialectUiId(dialectId);

  const { sliderWrapper, animations } = useTheme();

  return (
    // Disable pointer-events to allow browse/select content behind the bottom chat box
    <div className={clsx('dt-pointer-events-none', sliderWrapper)}>
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
            // Enable pointer-events here to allow
            'dt-w-full dt-h-full dt-pointer-events-auto',
            animations.bottomSlide.enterFrom
          )}
        >
          <Chat
            dialectId={dialectId}
            type="vertical-slider"
            onChatClose={close}
            onChatOpen={open}
            pollingInterval={pollingInterval}
          />
        </div>
      </CSSTransition>
    </div>
  );
}

export default function BottomChat(props: PropTypes): JSX.Element {
  return (
    <div className="dialect">
      <WrappedBottomChat {...props} />
    </div>
  );
}
