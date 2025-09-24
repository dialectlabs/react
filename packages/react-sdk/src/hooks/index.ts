export { default as useDapp } from './useDapp';
export { default as useDialectGate } from './useDialectGate';
export { default as useDialectSdk } from './useDialectSdk';
export { default as useDialectWallet } from './useDialectWallet';

export { default as useChannels } from './useChannels';
export type { UseChannelsOptions } from './useChannels';
export { default as useHistory } from './useHistory';
export type {
  ActionElement,
  App,
  HistoricalAlert,
  History,
} from './useHistory';
export { default as useClearHistory } from './useClearHistory';
export { default as useReadHistory } from './useReadHistory';
export { default as useSubscribe } from './useSubscribe';
export { default as useUnreadSummary } from './useUnreadSummary';
export type { UnreadSummary } from './useUnreadSummary';
export { default as useUnsubscribe } from './useUnsubscribe';

export { default as useConnectEmail } from './useConnectEmail';
export type {
  EmailPrepareRequest,
  EmailPrepareResponse,
  EmailVerifyRequest,
  UseConnectEmailValue,
} from './useConnectEmail';
export { default as useManageTopics } from './useManageTopics';
export type { ManageTopicRequest } from './useManageTopics';
export { optimisticTopicUpdateFn, default as useTopics } from './useTopics';
export type { UseTopicsOptions, UseTopicsValue } from './useTopics';

export { default as useConnectTelegram } from './useConnectTelegram';
export type {
  TelegramPrepareResponse,
  UseConnectTelegramValue,
} from './useConnectTelegram';

export type * from './types';

export * from './deprecated';
