import type { Address, AddressType, DialectSdkError } from '@dialectlabs/sdk';
import { useCallback, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_ARR } from '../utils';
import { WALLET_ADDRESSES_CACHE_KEY_FN } from './internal/swrCache';
import useDialectSdk from './useDialectSdk';

interface CreateParams {
  value: string;
}

interface UpdateParams {
  value: string;
}

interface VerifyParams {
  code: string;
}

interface UseNotificationChannelValue {
  globalAddress?: Address;
  create: (params: CreateParams) => Promise<Address | null>;
  update: (params: UpdateParams) => Promise<Address | null>;
  delete: () => Promise<void>;

  verify: (params: VerifyParams) => Promise<void>;
  resend: () => Promise<void>;

  isCreatingAddress: boolean;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;

  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseNotificationChannelParams {
  addressType: AddressType;
  refreshInterval?: number;
}

function useNotificationChannel({
  addressType,
  refreshInterval,
}: UseNotificationChannelParams): UseNotificationChannelValue {
  const { wallet: walletsApi } = useDialectSdk();

  const [isCreatingAddress, setCreatingAddress] = useState(false);
  const [isUpdatingAddress, setUpdatingAddress] = useState(false);
  const [isDeletingAddress, setDeletingAddress] = useState(false);
  const [isVerifyingCode, setVerifyingCode] = useState(false);
  const [isSendingCode, setSendingCode] = useState(false);

  // Fetch all wallet addresses (it doesn't include a enabled prop)
  const {
    data: addresses = EMPTY_ARR,
    error: errorFetchingAddresses = null,
    mutate: mutateAddresses,
  } = useSWR(
    WALLET_ADDRESSES_CACHE_KEY_FN(walletsApi),
    walletsApi ? () => walletsApi.addresses.findAll() : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  const isFetchingAddresses =
    Boolean(walletsApi) && !errorFetchingAddresses && addresses === undefined;

  const address = addresses.find((it) => it.type === addressType);

  const errorFetching = errorFetchingAddresses;

  const createAddress = useCallback(
    async ({ value }: CreateParams) => {
      if (isCreatingAddress) {
        // Do not create address if it's already creating
        return null;
      }
      setCreatingAddress(true);
      try {
        // not sure if optimistic update needed here, cause:
        // - address creating is the action that user expect to take a while
        await walletsApi.addresses.create({
          type: addressType,
          value,
        });
        return (
          (await mutateAddresses())?.find((it) => it.type === addressType) ||
          null
        );
      } finally {
        setCreatingAddress(false);
      }
    },
    [addressType, isCreatingAddress, mutateAddresses, walletsApi]
  );

  const updateAddress = useCallback(
    async ({ value }: UpdateParams) => {
      if (!address || isUpdatingAddress) {
        return null;
      }
      setUpdatingAddress(true);
      try {
        await walletsApi.addresses.update({
          addressId: address.id,
          value,
        });
        return (
          (await mutateAddresses())?.find((it) => it.type === addressType) ||
          null
        );
      } finally {
        setUpdatingAddress(false);
      }
    },
    [address, addressType, isUpdatingAddress, mutateAddresses, walletsApi]
  );

  const deleteAddress = useCallback(async () => {
    if (!address || isDeletingAddress) {
      return;
    }
    setDeletingAddress(true);
    try {
      await walletsApi.addresses.delete({ addressId: address.id });
      await mutateAddresses();
    } finally {
      setDeletingAddress(false);
    }
  }, [address, isDeletingAddress, mutateAddresses, walletsApi]);

  const verifyCode = useCallback(
    async ({ code }: VerifyParams) => {
      if (!address || isVerifyingCode) {
        return;
      }
      setVerifyingCode(true);
      try {
        await walletsApi.addresses.verify({
          addressId: address.id,
          code,
        });
        await mutateAddresses();
      } finally {
        setVerifyingCode(false);
      }
    },
    [address, isVerifyingCode, mutateAddresses, walletsApi]
  );

  const resendCode = useCallback(async () => {
    if (!address || isSendingCode) {
      return;
    }
    setSendingCode(true);
    try {
      await walletsApi.addresses.resendVerificationCode({
        addressId: address.id,
      });
      await mutateAddresses();
    } finally {
      setSendingCode(false);
    }
  }, [address, isSendingCode, mutateAddresses, walletsApi]);

  return {
    globalAddress: address,

    create: createAddress,
    update: updateAddress,
    delete: deleteAddress,
    verify: verifyCode,
    resend: resendCode,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,
    isSendingCode,
    isVerifyingCode,

    isFetching: isFetchingAddresses,
    errorFetching,
  };
}

export default useNotificationChannel;
