import { ExternalChannelType } from '@dialectlabs/react-sdk';
import { createContext, ReactNode, useContext } from 'react';

export type IncomingExternalChannelType =
  | 'email'
  | 'telegram'
  | 'EMAIL'
  | 'TELEGRAM';

const channelNormalizationMap: Record<
  IncomingExternalChannelType,
  ExternalChannelType
> = {
  email: 'EMAIL',
  EMAIL: 'EMAIL',
  telegram: 'TELEGRAM',
  TELEGRAM: 'TELEGRAM',
};

const normalizeChannels = (
  channels: IncomingExternalChannelType[],
): ExternalChannelType[] => channels.map((c) => channelNormalizationMap[c]);

export interface IncomingExternalProps {
  channels: IncomingExternalChannelType[];
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
}

export interface ExternalProps {
  channels: ExternalChannelType[];
  open?: boolean;
  setOpen?: (open: boolean | ((prev: boolean) => boolean)) => void;
}

const ExternalPropsContext = createContext<ExternalProps | null>(null);

export const ExternalPropsProvider = ({
  children,
  props: { channels, ...props },
}: {
  children: ReactNode;
  props: IncomingExternalProps;
}) => {
  return (
    <ExternalPropsContext.Provider
      value={{ ...props, channels: normalizeChannels(channels) }}
    >
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
