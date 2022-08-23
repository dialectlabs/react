import type {
  FindThreadQuery,
  DialectWalletAdapter,
  Dapp,
  Wallets,
} from '@dialectlabs/sdk';
import type { PublicKey } from '@solana/web3.js';

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

export const CACHE_KEY_THREAD_SUMMARY_FN = (otherMembers: PublicKey[]) =>
  'THREAD_SUMMARY_' +
  otherMembers
    .filter((it) => it)
    .map((it) => it.toString())
    .join(':');

export const CACHE_KEY_THREADS_SUMMARY = 'THREADS_GENERAL_SUMMARY';

export const DAPPS_CACHE_KEY = 'DAPPS';

export const DAPP_CACHE_KEY_FN = (wallet: DialectWalletAdapter) =>
  'DAPPS_' + wallet?.publicKey?.toBase58();

export const DAPP_ADDRESSES_CACHE_KEY_FN = (dapp: Dapp | null) =>
  'DAPP_ADDRESSES_' + dapp?.publicKey;

export const WALLET_ADDRESSES_CACHE_KEY_FN = (wallet: Wallets) =>
  'WALLET_ADDRESSES_' + wallet?.publicKey?.toBase58();

export const WALLET_DAPP_ADDRESSES_CACHE_KEY_FN = (
  wallet: Wallets,
  dappPublicKey?: PublicKey
) =>
  'WALLET_DAPP_ADDRESSES_' +
  wallet?.publicKey?.toBase58() +
  '_' +
  dappPublicKey?.toBase58();

export const WALLET_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  wallet: Wallets
) => 'WALLET_NOTIFICATION_SUBSCRIPTIONS_' + wallet?.publicKey?.toBase58();

export const DAPP_NOTIFICATION_SUBSCRIPTIONS_CACHE_KEY_FN = (
  dapp: Dapp | null
) => 'DAPP_NOTIFICATION_SUBSCRIPTIONS_' + dapp?.publicKey?.toBase58();

export const IDENTITY_CACHE_KEY_FN = (publicKey: PublicKey) =>
  `IDENTITY_${publicKey.toString()}`;
