import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export enum Route {
  Notifications = 'notifications',
  Settings = 'settings',
}

export interface RouterValue {
  route: Route;
  setRoute: (route: Route) => void;
}

export const RouterContext = createContext<RouterValue | null>(null);

export const Router = ({
  initialRoute,
  children,
}: {
  initialRoute?: Route;
  children: (route: Route) => ReactNode;
}) => {
  const [route, setRoute] = useState(initialRoute ?? Route.Notifications);

  const context = useMemo(() => ({ route, setRoute }), [route]);

  return (
    <RouterContext.Provider value={context}>
      {children(route)}
    </RouterContext.Provider>
  );
};

export const useRouter = () => {
  const context = useContext(RouterContext);

  if (!context) {
    throw new Error('useRouter must be used within a Router');
  }

  return context;
};
