import type { AccountAddress, FindThreadQuery } from '@dialectlabs/sdk';

// v2 cache keys

export const CACHE_KEY_HISTORY = (appId: string) => ['HISTORY', appId];

export const CACHE_KEY_HISTORY_SUMMARY = (
  walletAddress: string,
  appId: string,
) => ['HISTORY_SUMMARY', walletAddress, appId];

export const CACHE_KEY_SUBSCRIBE_MUTATION = (
  appId: string,
  channel: string | string[],
) => ['SUBSCRIBE', appId, channel];

export const CACHE_KEY_UNSUBSCRIBE_MUTATION = (
  appId: string,
  channel: string | string[],
) => ['UNSUBSCRIBE', appId, channel];

export const CACHE_KEY_EMAIL_PREPARE_MUTATION = () => ['EMAIL_PREPARE'];

export const CACHE_KEY_EMAIL_VERIFY_MUTATION = () => ['EMAIL_VERIFY'];

export const CACHE_KEY_EMAIL_UNLINK_MUTATION = () => ['EMAIL_UNLINK'];

export const CACHE_KEY_EMAIL_RESEND_MUTATION = () => ['EMAIL_RESEND'];

export const CACHE_KEY_TELEGRAM_PREPARE_MUTATION = () => ['TELEGRAM_PREPARE'];

export const CACHE_KEY_TELEGRAM_UNLINK_MUTATION = () => ['TELEGRAM_UNLINK'];

export const CACHE_KEY_CHANNELS = (appId?: string | null) => [
  'CHANNELS',
  appId,
];

export const CACHE_KEY_READ_MUTATION = (appId: string) => [
  'READ_HISTORY',
  appId,
];

// v1 cache keys

export const CACHE_KEY_THREADS = 'THREADS';

export const CACHE_KEY_THREAD_FN = (findParams: FindThreadQuery): string => {
  const prefix = 'THREAD_';
  if ('id' in findParams) {
    return prefix + findParams.id.toString();
  }
  if ('otherMembers' in findParams) {
    return (
      prefix +
      findParams.otherMembers
        .filter((it) => it)
        .map((it) => it.toString())
        .join(':')
    );
  }
  throw new Error('should never happen');
};

export const CACHE_KEY_MESSAGES_FN = (id: string) => `MESSAGES_${id}`;

export const CACHE_KEY_THREAD_SUMMARY_FN = (otherMembers: AccountAddress[]) =>
  'THREAD_SUMMARY_' +
  otherMembers
    .filter((it) => it)
    .map((it) => it.toString())
    .join(':');

export const CACHE_KEY_THREADS_SUMMARY = 'THREADS_GENERAL_SUMMARY';

export const DAPPS_CACHE_KEY = 'DAPPS';

export const DAPP_CACHE_KEY_FN = (walletAddress: AccountAddress) =>
  'DAPPS_' + walletAddress;

export const DAPP_ADDRESSES_CACHE_KEY_FN = (dappAddress?: AccountAddress) =>
  'DAPP_ADDRESSES_' + dappAddress;

export const WALLET_ADDRESSES_CACHE_KEY_FN = (walletAddress: AccountAddress) =>
  'WALLET_ADDRESSES_' + walletAddress;

export const WALLET_DAPP_ADDRESSES_CACHE_KEY_FN = (
  walletAddress: AccountAddress,
  dappAddress: AccountAddress,
) => 'WALLET_DAPP_ADDRESSES_' + walletAddress + '_' + dappAddress;

export const WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  walletAddress: AccountAddress,
  dappAddress: AccountAddress = '',
) => `WALLET_NOTIFICATION_SUBSCRIPTIONS_${walletAddress}${dappAddress}`;

export const DAPP_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  dappAddress?: AccountAddress,
) => 'DAPP_NOTIFICATION_SUBSCRIPTIONS_' + dappAddress;
