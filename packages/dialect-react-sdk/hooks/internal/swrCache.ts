import type {
  AccountAddress,
  FindDappMessageQuery,
  FindThreadQuery,
} from '@dialectlabs/sdk';

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
  dappAddress: AccountAddress
) => 'WALLET_DAPP_ADDRESSES_' + walletAddress + '_' + dappAddress;

export const WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  walletAddress: AccountAddress,
  dappAddress: AccountAddress = ''
) => `WALLET_NOTIFICATION_SUBSCRIPTIONS_${walletAddress}${dappAddress}`;

export const DAPP_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  dappAddress?: AccountAddress
) => 'DAPP_NOTIFICATION_SUBSCRIPTIONS_' + dappAddress;

export const IDENTITY_CACHE_KEY_FN = (address?: AccountAddress) =>
  `IDENTITY_${address?.toString()}`;

export const SINGLE_FEED_CACHE_KEY_FN = (query: FindDappMessageQuery) =>
  `SINGLE_FEED_${query.dappVerified}_${query.take}_${query.skip}`;
