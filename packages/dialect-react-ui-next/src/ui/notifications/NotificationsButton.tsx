import { Icons } from '../theme';
import { ModalStateProvider } from './internal/ModalStateProvider';
import { Notifications } from './Notifications';

export const NotificationsButton = () => {
  return (
    <div className="dt-relative">
      <ModalStateProvider>
        {({ open, setOpen }) => (
          <>
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="dt-rounded-xl dt-bg-light-60 dt-p-3"
            >
              <Icons.BellButton />
            </button>
            {open && (
              <div className="dt-absolute -dt-right-32 dt-top-14 dt-overflow-hidden dt-rounded-xl dt-bg-transparent dt-shadow-xl">
                {<Notifications />}
              </div>
            )}
          </>
        )}
      </ModalStateProvider>
    </div>
  );
};
