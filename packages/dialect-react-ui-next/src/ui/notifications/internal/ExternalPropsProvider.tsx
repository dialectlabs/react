import { createContext, ReactNode, useContext } from 'react';

export interface ExternalProps {
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const ExternalPropsContext = createContext<ExternalProps | null>(null);

export const ExternalPropsProvider = ({
  children,
  props,
}: {
  children: ReactNode;
  props: ExternalProps;
}) => {
  return (
    <ExternalPropsContext.Provider value={props}>
      {children}
    </ExternalPropsContext.Provider>
  );
};

export const useExternalProps = () => {
  const context = useContext(ExternalPropsContext);

  if (!context) {
    throw new Error(
      'useExternalProps must be used within a ExternalPropsProvider',
    );
  }

  return context;
};
