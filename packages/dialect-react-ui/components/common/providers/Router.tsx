import {
  createContext,
  FunctionComponent,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

type RouteParams = Record<string, any> | undefined | null;

interface RouterContextValue<
  ActiveRouteParams extends RouteParams = undefined
> {
  activeRoute: RouteType<ActiveRouteParams> | null;
  navigate(to: string, args?: Omit<RouteType, 'name'>): void;
}

interface RouteType<P extends RouteParams = undefined> {
  name: string;
  params?: P;
  sub?: RouteType;
}

interface RouterProps {
  initialRoute?: string;
}

interface RouteProps {
  name: string;
}

const RouterContext = createContext<RouterContextValue | null>(null);

export const Router: FunctionComponent<RouterProps> = ({
  children,
  initialRoute,
}) => {
  const parent = useContext(RouterContext);
  const [activeRoute, setActiveRoute] = useState<RouteType | null>(
    initialRoute ? { name: initialRoute } : null
  );

  const navigate = useCallback(
    (to: string, args: Omit<RouteType, 'name'> = {}) =>
      setActiveRoute({ name: to, ...args }),
    []
  );

  useEffect(() => {
    if (!parent) {
      return;
    }

    // If this is a nested router, we need to tell all child Routes that the active route is the nested one
    if (parent?.activeRoute?.sub) {
      setActiveRoute(parent.activeRoute.sub);
    }
  }, [parent]);

  return (
    <RouterContext.Provider
      // If this is a nested router we want to have a single source of truth for the whole app, which is the parent router
      // When we update the parent's active route, that will propagate to all nested Routers
      value={{ activeRoute, navigate: parent ? parent.navigate : navigate }}
    >
      {children}
    </RouterContext.Provider>
  );
};

export const Route: FunctionComponent<RouteProps> = ({ name, children }) => {
  const router = useContext(RouterContext);

  return router?.activeRoute?.name === name ? <>{children}</> : null;
};

export const useRoute = <P extends RouteParams = undefined>() => {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error('useRoute must be used within Router');
  }

  const { activeRoute, navigate } = context as RouterContextValue<P>;

  return {
    current: activeRoute,
    params: activeRoute?.params ?? {},
    name: activeRoute?.name || null,
    navigate,
  };
};
