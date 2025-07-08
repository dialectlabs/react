import clsx from 'clsx';
import { ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { ClassTokens } from '../../theme';

interface TabsContextValue {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

export interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

export const Tabs = ({ defaultTab, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  const contextValue = useMemo(
    () => ({ activeTab, setActiveTab }),
    [activeTab],
  );
  return (
    <TabsContext.Provider value={contextValue}>{children}</TabsContext.Provider>
  );
};

export interface TabProps {
  name: string;
  children: ReactNode;
}

export const Tab = ({ name, children }: TabProps) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('Tab must be used within Tabs');
  if (ctx.activeTab !== name) return null;
  return <>{children}</>;
};

export interface TabListProps {
  tabs: { name: string; label: ReactNode }[];
  className?: string;
}

export const TabList = ({ tabs, className }: TabListProps) => {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error('TabList must be used within Tabs');
  return (
    <div
      className={clsx(
        'dt-flex dt-w-full dt-border-b dt-border-[--dt-stroke-primary]',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = ctx.activeTab === tab.name;
        return (
          <button
            key={tab.name}
            type="button"
            className={clsx(
              'dt-relative dt-flex-1 dt-border-0 dt-bg-transparent dt-py-4 dt-font-semibold dt-outline-none dt-transition-colors',
              isActive
                ? [ClassTokens.Text.Accent]
                : [
                    ClassTokens.Text.Tertiary,
                    'hover:dt-text-[--dt-text-accent]',
                  ],
            )}
            style={{ background: 'none' }}
            onClick={() => ctx.setActiveTab(tab.name)}
          >
            {tab.label}
            <span
              className={clsx(
                'dt-absolute dt-bottom-0 dt-left-0 dt-right-0 dt-h-0.5 dt-rounded-t',
                isActive
                  ? ClassTokens.Background.Input.Checked
                  : 'dt-bg-transparent',
              )}
            />
          </button>
        );
      })}
    </div>
  );
};
