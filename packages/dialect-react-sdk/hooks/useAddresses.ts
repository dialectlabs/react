import type { Address, AddressType, DialectSdkError } from '@dialectlabs/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';
import { EMPTY_OBJ } from '../utils';
import {
  WALLET_ADDRESSES_CACHE_KEY_FN,
  WALLET_DAPP_ADDRESSES_CACHE_KEY_FN,
} from './internal/swrCache';
import useDialectDapp from './useDialectDapp';
import useDialectSdk from './useDialectSdk';
import useDialectWallet from './useDialectWallet';

type AddressEnriched = Address & { enabled: boolean };
interface UseAddressesValue {
  addresses: Record<AddressType, AddressEnriched> | Record<string, never>;
  create: (type: AddressType, value?: string) => Promise<void>;
  update: (type: AddressType, value: string) => Promise<void>;
  delete: (type: AddressType) => Promise<void>;
  toggle: (type: AddressType, enabled: boolean) => Promise<void>;

  isCreatingAddress: boolean;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;

  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseAddressesParams {
  refreshInterval?: number;
}

function useAddresses({
  refreshInterval,
}: UseAddressesParams = EMPTY_OBJ): UseAddressesValue {
  const { wallet: walletsApi } = useDialectSdk();
  const { dappAddress: dappPublicKey } = useDialectDapp();
  const { connected: isWalletConnected } = useDialectWallet();
  const [isCreatingAddress, setCreatingAddress] = useState(false);
  const [isUpdatingAddress, setUpdatingAddress] = useState(false);
  const [isDeletingAddress, setDeletingAddress] = useState(false);

  // Fetch all wallet addresses (it doesn't include a enabled prop)
  const {
    data: addresses,
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

  const {
    data: dappAddresses,
    error: errorFetchingDappAddresses = null,
    mutate: mutateDappAddresses,
  } = useSWR(
    WALLET_DAPP_ADDRESSES_CACHE_KEY_FN(walletsApi, dappPublicKey),
    walletsApi && dappPublicKey
      ? () =>
          walletsApi.dappAddresses.findAll({
            addressIds: addresses?.map((addr) => addr.id),
          })
      : null,
    {
      refreshInterval,
      refreshWhenOffline: true,
    }
  );

  const isFetchingDappAddresses =
    Boolean(walletsApi) &&
    !errorFetchingDappAddresses &&
    dappAddresses === undefined;

  const mergeAddress = useCallback(
    (data) =>
      addresses
        ? addresses.map((add: Address) => (add.type === data.type ? data : add))
        : [data],
    [addresses]
  );

  const getAddress = useCallback(
    (type: AddressType) => addresses?.find((address) => address.type === type),
    [addresses]
  );

  const getDappAddress = useCallback(
    (type: AddressType) =>
      dappAddresses?.find((dappAddress) => dappAddress.address.type === type),
    [dappAddresses]
  );

  useEffect(
    function invalidateAddresses() {
      mutateAddresses();
    },
    [mutateAddresses, walletsApi]
  );

  const createAddress = useCallback(
    async (type: AddressType, value: string) => {
      if (!isWalletConnected || !dappPublicKey || isCreatingAddress) return;
      setCreatingAddress(true);
      try {
        const currentAddress = getAddress(type);
        // Optimisticly update the current data while run actual request
        await mutateAddresses(
          async () => {
            const address = currentAddress
              ? currentAddress
              : await walletsApi.addresses.create({
                  type,
                  value,
                });
            const dappAddress = await walletsApi.dappAddresses.create({
              dappPublicKey,
              addressId: address.id,
              enabled: true,
            });
            return mergeAddress({ address, enabled: dappAddress.enabled });
          },
          {
            optimisticData: (data) => mergeAddress(data),
            rollbackOnError: true,
          }
        );
        await mutateDappAddresses();
      } catch (e) {
        throw e as Error;
      } finally {
        setCreatingAddress(false);
      }
    },
    [
      isWalletConnected,
      dappPublicKey,
      isCreatingAddress,
      getAddress,
      mutateAddresses,
      mutateDappAddresses,
      walletsApi.addresses,
      walletsApi.dappAddresses,
      mergeAddress,
    ]
  );

  const updateAddress = useCallback(
    async (addressId: string, value: string) => {
      if (!isWalletConnected || !dappPublicKey) return;
      setUpdatingAddress(true);
      try {
        const address = await walletsApi.addresses.update({ addressId, value });
        await mutateAddresses(mergeAddress(address));
      } catch (e) {
        throw e as Error;
      } finally {
        setUpdatingAddress(false);
      }
    },
    [
      dappPublicKey,
      walletsApi.addresses,
      mergeAddress,
      isWalletConnected,
      mutateAddresses,
    ]
  );

  const updateEnabled = useCallback(
    async (type: AddressType, enabled: boolean) => {
      if (!isWalletConnected || !dappPublicKey || !dappAddresses) return;
      setUpdatingAddress(true);
      try {
        const address = getAddress(type);
        const dappAddress = getDappAddress(type);
        if (!dappAddress) {
          return;
        }
        const newDappAddress = await walletsApi.dappAddresses.update({
          dappAddressId: dappAddress.id,
          enabled,
        });
        await mutateAddresses(
          mergeAddress({ address, enabled: newDappAddress.enabled })
        );
      } catch (e) {
        throw e as Error;
      } finally {
        setUpdatingAddress(false);
      }
    },
    [
      isWalletConnected,
      dappPublicKey,
      dappAddresses,
      getAddress,
      getDappAddress,
      walletsApi.dappAddresses,
      mutateAddresses,
      mergeAddress,
    ]
  );

  const deleteAddress = useCallback(
    async (type: AddressType) => {
      if (!isWalletConnected || isDeletingAddress) return;
      setDeletingAddress(true);
      try {
        const address = getAddress(type);
        if (!address) {
          return;
        }
        const nextAddresses = addresses
          ? addresses.filter((add) => add.id !== address.id)
          : [];
        // Optimisticly update the current data while run actual request
        await mutateAddresses(
          async () => {
            await walletsApi.addresses.delete({ addressId: address.id });
            return nextAddresses;
          },
          {
            optimisticData: nextAddresses,
            rollbackOnError: true,
          }
        );
      } catch (e) {
        throw e as Error;
      } finally {
        setDeletingAddress(false);
      }
    },
    [
      isWalletConnected,
      isDeletingAddress,
      getAddress,
      addresses,
      mutateAddresses,
      walletsApi.addresses,
    ]
  );

  const verifyCode = useCallback(
    async (addressId: string, code: string) => {
      if (!isWalletConnected || !dappPublicKey) return;
      try {
        const data = await walletsApi.addresses.verify({ addressId, code });
        await mutateAddresses(mergeAddress(data));
      } catch (err) {
        throw err as Error;
      }
    },
    [
      isWalletConnected,
      dappPublicKey,
      walletsApi.addresses,
      mutateAddresses,
      mergeAddress,
    ]
  );

  const resendCode = useCallback(
    async (addressId: string) => {
      if (!isWalletConnected || !dappPublicKey) return;
      try {
        await walletsApi.addresses.resendVerificationCode({ addressId });
      } catch (err) {
        throw err as Error;
      }
    },
    [dappPublicKey, isWalletConnected, walletsApi.addresses]
  );

  const addressesObj = useMemo(() => {
    const obj = Object.fromEntries(
      // Since by default options everything is false, passed options are considered enabled
      addresses
        ? addresses.map((addr) => [
            addr.type,
            {
              ...addr,
              enabled: Boolean(
                dappAddresses?.find((dAddr) => dAddr.address.id === addr.id)
                  ?.enabled
              ),
            },
          ])
        : []
    ) as Record<AddressType, AddressEnriched>;
    return obj;
  }, [addresses, dappAddresses]);

  return {
    addresses: addressesObj || EMPTY_OBJ,

    create: createAddress,
    update: updateAddress,
    delete: deleteAddress,
    verify: verifyCode,
    resend: resendCode,

    toggle: updateEnabled,

    isCreatingAddress,
    isUpdatingAddress,
    isDeletingAddress,

    isFetching: isFetchingAddresses || isFetchingDappAddresses,
    errorFetchingAddresses,
    errorFetchingDappAddresses,
  };
}

export default useAddresses;
