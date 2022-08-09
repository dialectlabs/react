import {
  useDappAddresses,
  useDappNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import { useMemo } from 'react';
import {
  getAddressesCounts,
  getAddressesSummary,
  getUsersCount,
} from '../utils/addressesUtils';

const DEFAULT_ADDRESSES_REFRESH_INTERVAL = 10000;

interface UseDappAudienceParams {
  notificationTypeId?: string | null;
  refreshInterval?: number;
}

export default function useDappAudience({
  notificationTypeId,
  refreshInterval = DEFAULT_ADDRESSES_REFRESH_INTERVAL,
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
    refreshInterval,
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
