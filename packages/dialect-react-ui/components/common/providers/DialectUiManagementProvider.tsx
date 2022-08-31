import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import produce from 'immer';
import type { RouterContextValue } from './Router';

interface UiState {
  open: boolean;
}

type Navigator<N extends Record<string, any> = Record<string, never>> = N & {
  navigate?: RouterContextValue['navigate'];
};

interface ManagementConfig<N extends Record<string, any>> {
  navigation?: Partial<{
    navigate: Navigator['navigate'];
  }> &
    N;
}

interface UiManagementContextType {
  ui: {
    [id: string]: UiState;
  };
  navigation: {
    [id: string]: Navigator | null;
  };
  open(id: string): void;
  close(id: string): void;
  register(id: string): void;
  configure<N>(id: string, config: ManagementConfig<N> | null): void;
}

export const DialectUiManagementContext =
  createContext<UiManagementContextType | null>(null);

interface DialectUiManagementProviderProps {
  children?: React.ReactNode;
}

export const DialectUiManagementProvider: React.FC<
  DialectUiManagementProviderProps
> = ({ children }) => {
  const [ui, setUi] = useState<UiManagementContextType['ui']>({});
  const [navigation, setNavigation] = useState<
    UiManagementContextType['navigation']
  >({});

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

  // Extend for necessary configurations
  const configure = useCallback(
    <N extends Record<any, any>>(
      id: string,
      config: ManagementConfig<N> | null
    ) => {
      setNavigation(
        produce((draft) => {
          if (!config) {
            draft[id] = null;
            return;
          }

          const { navigation } = config;

          // Also, this is not great probably in terms of immer usage
          draft[id] = { ...draft[id], ...navigation } as any; // FIXME: types...
        })
      );
    },
    []
  );

  return (
    <DialectUiManagementContext.Provider
      value={{ ui, navigation, register, open, close, configure }}
    >
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

export const useDialectUiId = <
  N extends Record<string, any> = Record<string, never>
>(
  id: string
) => {
  const {
    ui: uis,
    navigation: navigations,
    open: mainOpen,
    close: mainClose,
    register,
    configure: mainConfigure,
  } = useDialectUi();

  const ui = useMemo(() => uis[id], [uis, id]);
  const navigation: Navigator<N> | undefined = useMemo(
    () => navigations[id] as Navigator<N> | undefined,
    [navigations, id]
  );
  const open = useCallback(() => mainOpen(id), [mainOpen, id]);
  const close = useCallback(() => mainClose(id), [mainClose, id]);
  const configure = useCallback(
    <N extends Record<any, any>>(config: ManagementConfig<N> | null) =>
      mainConfigure(id, config),
    [mainConfigure, id]
  );

  useEffect(() => register(id), [register, id]);

  return { ui, navigation, open, close, configure };
};
