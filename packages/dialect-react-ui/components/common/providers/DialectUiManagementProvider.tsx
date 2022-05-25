import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import produce from 'immer';

interface UiState {
  open: boolean;
}

interface UiManagementContextType {
  ui: {
    [id: string]: UiState;
  };
  open(id: string): void;
  close(id: string): void;
  register(id: string): void;
}

export const DialectUiManagementContext =
  createContext<UiManagementContextType | null>(null);

export const DialectUiManagementProvider: FunctionComponent = ({
  children,
}) => {
  const [ui, setUi] = useState<UiManagementContextType['ui']>({});

  const register = useCallback(
    (id: string) =>
      setUi(
        produce((draft) => {
          draft[id] = draft[id] ?? { open: false };
        })
      ),
    []
  );

  const open = useCallback(
    (id: string) =>
      setUi(
        produce((draft) => {
          const window = draft[id];
          if (window) {
            window.open = true;
          }
        })
      ),
    []
  );

  const close = useCallback(
    (id: string) =>
      setUi(
        produce((draft) => {
          const window = draft[id];
          if (window) {
            window.open = false;
          }
        })
      ),
    []
  );

  return (
    <DialectUiManagementContext.Provider value={{ ui, register, open, close }}>
      {children}
    </DialectUiManagementContext.Provider>
  );
};

export const useDialectUi = () => {
  const context = useContext(DialectUiManagementContext);

  if (!context) {
    throw new Error(
      'useDialectUi must be used within an DialectUIManagementProvider'
    );
  }
  return context;
};

export const useDialectUiId = (id: string) => {
  const {
    ui: uis,
    open: mainOpen,
    close: mainClose,
    register,
  } = useDialectUi();

  const ui = useMemo(() => uis[id], [uis, id]);
  const open = useCallback(() => mainOpen(id), [mainOpen, id]);
  const close = useCallback(() => mainClose(id), [mainClose, id]);

  useEffect(() => register(id), [register, id]);

  return { ui, open, close };
};
