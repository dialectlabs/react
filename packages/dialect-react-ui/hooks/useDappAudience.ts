import {
  DialectSdkError,
  useDappAddresses,
  useDappNotificationSubscriptions,
} from '@dialectlabs/react-sdk';
import { useMemo } from 'react';
import {
  ChannelCountsType,
  getAddressesCounts,
  getAddressesSummary,
  getUsersCount,
} from '../utils/addressesUtils';

const DEFAULT_ADDRESSES_REFRESH_INTERVAL = 10000;

interface UseDappAudienceParams {
  notificationTypeId?: string | null;
  refreshInterval?: number;
}

interface UseDappAudienceValue {
  counts: ChannelCountsType;
  totalCount: number;
  isFetching: boolean;
  summary: string;
  error: DialectSdkError | null;
}

export default function useDappAudience({
  notificationTypeId,
  refreshInterval = DEFAULT_ADDRESSES_REFRESH_INTERVAL,
}: UseDappAudienceParams): UseDappAudienceValue {
  const {
    subscriptions: notificationsSubscriptions,
    isFetching: isFetchingSubscriptions,
    errorFetching: errorFetchingNotificationSubscriptions = null,
  } = useDappNotificationSubscriptions();
  const {
    addresses,
    isFetching: isFetchingAddresses,
    errorFetching: errorFetchingAddresses = null,
  } = useDappAddresses({
    refreshInterval,
  });
  const isFetching = isFetchingSubscriptions || isFetchingAddresses;

  const counts = useMemo(
    () =>
      getAddressesCounts(
        isFetching ? null : addresses,
        isFetching ? null : notificationsSubscriptions,
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
