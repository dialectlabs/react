import {
  AddressType,
  DappAddress,
  DappNotificationSubscription,
} from '@dialectlabs/react-sdk';

const GENERAL_BROADCAST = 'general-broadcast';

export const getUsersCount = (
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

export const getAddressesCounts = (
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

export const getAddressesSummary = (
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
