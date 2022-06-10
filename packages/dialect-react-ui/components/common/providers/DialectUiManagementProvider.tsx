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
import type { RouteParams, RouterContextValue } from './Router';

interface UiState {
  open: boolean;
}

interface Navigator<P extends RouteParams = undefined> {
  navigate?: RouterContextValue<P>['navigate'];
}

interface ManagementConfig {
  navigation?: Partial<{
    navigate: Navigator['navigate'];
  }>;
}

interface UiManagementContextType {
  ui: {
    [id: string]: UiState;
  };
  navigation: {
    [id: string]: Navigator;
  };
  open(id: string): void;
  close(id: string): void;
  register(id: string): void;
  configure(id: string, config: ManagementConfig): void;
}

export const DialectUiManagementContext =
  createContext<UiManagementContextType | null>(null);

export const DialectUiManagementProvider: FunctionComponent = ({
  children,
}) => {
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
  const configure = useCallback((id: string, config: ManagementConfig) => {
    setNavigation(
      produce((draft) => {
        const nav = draft[id] ?? {};
        const { navigation } = config;

        nav.navigate = navigation?.navigate;

        draft[id] = nav;
      })
    );
  }, []);

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

export const useDialectUiId = (id: string) => {
  const {
    ui: uis,
    navigation: navigations,
    open: mainOpen,
    close: mainClose,
    register,
    configure: mainConfigure,
  } = useDialectUi();

  const ui = useMemo(() => uis[id], [uis, id]);
  const navigation: Navigator<Record<string, any>> | undefined = useMemo(
    () => navigations[id],
    [navigations, id]
  );
  const open = useCallback(() => mainOpen(id), [mainOpen, id]);
  const close = useCallback(() => mainClose(id), [mainClose, id]);
  const configure = useCallback(
    (config: ManagementConfig) => mainConfigure(id, config),
    [mainConfigure, id]
  );

  useEffect(() => register(id), [register, id]);

  return { ui, navigation, open, close, configure };
};
