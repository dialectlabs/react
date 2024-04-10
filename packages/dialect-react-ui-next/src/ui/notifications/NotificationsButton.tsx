import { useRef } from 'react';
import { Icons } from '../theme';
import { Notifications } from './Notifications';
import { ModalState, ModalStateProvider } from './internal/ModalStateProvider';
import { useClickAway } from './internal/useClickAway';

const Modal = ({ open, setOpen }: ModalState) => {
  const modalRef = useRef<HTMLDivElement>(null);
  useClickAway(modalRef, () => setOpen(false));

  if (!open) {
    return null;
  }
  return (
    <div ref={modalRef} className="modal">
      {<Notifications />}
    </div>
  );
};

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
            <Modal open={open} setOpen={setOpen} />
          </>
        )}
      </ModalStateProvider>
    </div>
  );
};
