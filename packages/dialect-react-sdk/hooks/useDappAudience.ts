import {
  AddressType,
  DappAddress,
  DappNotificationSubscription,
  useDappAddresses,
  useDappNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import { useMemo } from 'react';

const GENERAL_BROADCAST = 'general-broadcast';

const getUsersCount = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null,
  addressTypePredicate: (addressType: AddressType) => boolean = () => true
) => {
  const enabledAndVerifiedAddresses = addresses
    .filter((address) => address.enabled)
    .filter((address) => address.address.verified)
    .filter((address) => addressTypePredicate(address.address.type));

  // If there're no notifications type set up for this dapp, return all addresses count
  if (!subscriptions.length) {
    return enabledAndVerifiedAddresses.length;
  }

  // Otherwise, filter enabled subscriptions ...
  const enabledSubscriptionsPKs = subscriptions
    .filter((sub) => {
      if (notificationTypeId === GENERAL_BROADCAST) {
        return true;
      }
      return (
        (sub.notificationType.id === notificationTypeId ||
          !notificationTypeId) &&
        sub.subscriptions.find((subscription) => subscription.config.enabled)
      );
    })
    .flatMap((it) => it.subscriptions);

  // And intersect subscriptions with addresses
  const filtered = enabledSubscriptionsPKs.filter((subscription) =>
    enabledAndVerifiedAddresses.find((address) =>
      address.address.wallet.publicKey.equals(subscription.wallet.publicKey)
    )
  );

  return [...new Set(filtered.map((it) => it.wallet.publicKey.toBase58()))]
    .length;
};

const getAddressesCounts = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null
) => {
  const wallets = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (type) => type === AddressType.Wallet
  );
  const emails = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.Email
  );
  const phones = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.PhoneNumber
  );
  const telegrams = getUsersCount(
    addresses,
    subscriptions,
    notificationTypeId,
    (it) => it === AddressType.Telegram
  );
  return {
    wallets,
    emails,
    phones,
    telegrams,
  };
};

const getAddressesSummary = (
  addresses: DappAddress[],
  subscriptions: DappNotificationSubscription[],
  notificationTypeId?: string | null
) => {
  const { wallets, emails, phones, telegrams } = getAddressesCounts(
    addresses,
    subscriptions,
    notificationTypeId
  );
  return [
    wallets && `${wallets} wallet${wallets > 1 ? 's' : ''} (off-chain)`,
    emails && `${emails} email${emails > 1 ? 's' : ''}`,
    phones && `${phones} phone${phones > 1 ? 's' : ''}`,
    telegrams && `${telegrams} telegram account${telegrams > 1 ? 's' : ''}`,
  ]
    .filter(Boolean)
    .join(', ');
};

const ADDRESSES_REFRESH_INTERVAL = 10000;

interface UseDappAudienceParams {
  notificationTypeId?: string | null;
}

export default function useDappAudience({
  notificationTypeId,
}: UseDappAudienceParams) {
  const {
    subscriptions: notificationsSubscriptions,
    isFetching: isFetchingSubscriptions,
    errorFetching: errorFetchingNotificationSubscriptions,
  } = useDappNotificationSubscriptions();
  const {
    addresses,
    isFetching: isFetchingAddresses,
    errorFetching: errorFetchingAddresses,
  } = useDappAddresses({
    refreshInterval: ADDRESSES_REFRESH_INTERVAL,
  });
  const isFetching = isFetchingSubscriptions || isFetchingAddresses;

  const counts = useMemo(
    () =>
      isFetching
        ? {
            wallet: undefined,
            email: undefined,
            phone: undefined,
            telegram: undefined,
          }
        : getAddressesCounts(
            addresses,
            notificationsSubscriptions,
            notificationTypeId
          ),
    [isFetching, addresses, notificationsSubscriptions, notificationTypeId]
  );

  const totalCount = useMemo(
    () =>
      getUsersCount(addresses, notificationsSubscriptions, notificationTypeId),
    [addresses, notificationTypeId, notificationsSubscriptions]
  );

  const summary = useMemo(
    () =>
      getAddressesSummary(
        addresses,
        notificationsSubscriptions,
        notificationTypeId
      ),
    [addresses, notificationsSubscriptions, notificationTypeId]
  );

  return {
    counts,
    totalCount,
    summary,
    error: errorFetchingNotificationSubscriptions || errorFetchingAddresses,
    isFetching,
  };
}
