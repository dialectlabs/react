import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

interface ModalState {
  open: boolean;
  setOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const ModalStateContext = createContext<ModalState | null>(null);

export const ModalStateProvider = ({
  children,
}: {
  children: (state: ModalState) => ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const context = useMemo(() => ({ open, setOpen }), [open, setOpen]);

  return (
    <ModalStateContext.Provider value={context}>
      {children(context)}
    </ModalStateContext.Provider>
  );
};

// no null check, since Notifications can be used without a modal
export const useModalState = () => {
  return useContext(ModalStateContext);
};
