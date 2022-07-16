import type {
  Address,
  DappAddress,
  AddressType,
  DialectSdkError,
} from '@dialectlabs/sdk';
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

interface CreateUpdateParams {
  addressType: AddressType;
  value: string;
}

interface DeleteParams {
  addressType: AddressType;
}

interface ToggleParams {
  addressType: AddressType;
  enabled: boolean;
}

interface VerifyParams {
  addressType: AddressType;
  code: string;
}
interface ResendParams {
  addressType: AddressType;
}

type AddressActionParams =
  | CreateUpdateParams
  | DeleteParams
  | ToggleParams
  | VerifyParams
  | ResendParams;

type AddressEnriched = Address & {
  enabled: boolean;
  dappAddress?: DappAddress;
};
interface UseAddressesValue {
  addresses: Record<AddressType, AddressEnriched>;
  create: (params: CreateUpdateParams) => Promise<void>;
  update: (params: CreateUpdateParams) => Promise<void>;
  delete: (params: DeleteParams) => Promise<void>;
  toggle: (params: ToggleParams) => Promise<void>;

  verify: (params: VerifyParams) => Promise<void>;
  resend: (params: ResendParams) => Promise<void>;

  isCreatingAddress: boolean;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
  isSendingCode: boolean;
  isVerifyingCode: boolean;

  isFetching: boolean;
  errorFetching: DialectSdkError | null;
}

interface UseAddressesParams {
  refreshInterval?: number;
}

type WrappedFuncParams = AddressActionParams;

function useAddresses({
  refreshInterval,
}: UseAddressesParams = EMPTY_OBJ): UseAddressesValue {
  const { wallet: walletsApi } = useDialectSdk();
  const { dappAddress: dappPublicKey } = useDialectDapp();
  const { connected: isWalletConnected } = useDialectWallet();

  const [isCreatingAddress, setCreatingAddress] = useState(false);
  const [isUpdatingAddress, setUpdatingAddress] = useState(false);
  const [isDeletingAddress, setDeletingAddress] = useState(false);
  const [isVerifyingCode, setVerifyingCode] = useState(false);
  const [isSendingCode, setSendingCode] = useState(false);

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
            dappPublicKey,
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

  const addressesEnriched = useMemo(
    () =>
      addresses
        ? addresses.map((address) => {
            const dappAddress = dappAddresses?.find(
              (dAddr) => dAddr.address.id === address.id
            );
            return {
              ...address,
              dappAddress,
              enabled: Boolean(dappAddress?.enabled),
            };
          })
        : [],
    [addresses, dappAddresses]
  );

  const errorFetching = errorFetchingAddresses || errorFetchingDappAddresses;

  const mergeAddress = useCallback(
    (address: AddressEnriched | Address) =>
      addressesEnriched
        ? addressesEnriched.map((add) =>
            add.type === address.type ? { ...address, ...add } : add
          )
        : [address],
    [addressesEnriched]
  );

  const getAddress = useCallback(
    (type: AddressType) =>
      addressesEnriched?.find((address) => address.type === type),
    [addressesEnriched]
  );

  const withAddress = useCallback(
    <
      F extends (
        params: AddressActionParams & {
          address?: AddressEnriched;
        }
      ) => Promise<void>
    >(
      fn: F
    ) => {
      return async function ({ addressType, ...args }: WrappedFuncParams) {
        const address = getAddress(addressType);
        if (!isWalletConnected || !dappPublicKey) {
          // Don't execute the function if wallet or dappPK is not present
          return;
        }
        return await fn({ addressType, address, ...args });
      };
    },
    [dappPublicKey, getAddress, isWalletConnected]
  );

  useEffect(
    function invalidateAddresses() {
      mutateAddresses();
    },
    [mutateAddresses, walletsApi]
  );

  const createAddress = useCallback(
    withAddress(async (params) => {
      const {
        address: currentAddress,
        addressType,
        value,
      } = params as CreateUpdateParams & { address?: AddressEnriched };
      if (!dappPublicKey || isCreatingAddress) {
        // Do not create address if it's already creating
        return;
      }
      setCreatingAddress(true);
      // Optimisticly update the current data while run actual request
      await mutateAddresses(
        async () => {
          const address = currentAddress
            ? currentAddress
            : await walletsApi.addresses.create({
                type: addressType,
                value,
              });
          const dappAddress = await walletsApi.dappAddresses.create({
            dappPublicKey,
            addressId: address.id,
            enabled: true,
          });
          return mergeAddress({ ...address, enabled: dappAddress.enabled });
        },
        {
          // FIXME: something goes wrong with assigning array in the optimisticData
          // optimisticData: (nextAddress) =>
          //   nextAddress ? mergeAddress(nextAddress) : [],
          rollbackOnError: true,
        }
      );
      await mutateDappAddresses();
      setCreatingAddress(false);
    }),
    [
      withAddress,
      dappPublicKey,
      isCreatingAddress,
      mutateAddresses,
      mutateDappAddresses,
      walletsApi.addresses,
      walletsApi.dappAddresses,
      mergeAddress,
    ]
  );

  const updateAddress = useCallback(
    withAddress(async (params) => {
      const { address, value } = params as CreateUpdateParams & {
        address?: AddressEnriched;
      };
      if (!address) {
        return;
      }
      setUpdatingAddress(true);
      try {
        const updatedAddress = await walletsApi.addresses.update({
          addressId: address.id,
          value,
        });
        await mutateAddresses(mergeAddress(updatedAddress));
      } catch (e) {
        throw e as Error;
      } finally {
        setUpdatingAddress(false);
      }
    }),
    [withAddress, walletsApi.addresses, mutateAddresses, mergeAddress]
  );

  const updateEnabled = useCallback(
    withAddress(async (params) => {
      const { address, enabled } = params as ToggleParams & {
        address?: AddressEnriched;
      };
      if (!address || !address?.dappAddress) {
        return;
      }
      setUpdatingAddress(true);
      const newDappAddress = await walletsApi.dappAddresses.update({
        dappAddressId: address.dappAddress.id,
        enabled,
      });
      await mutateAddresses(
        mergeAddress({ ...address, enabled: newDappAddress.enabled })
      );
      setUpdatingAddress(false);
    }),
    [
      withAddress,
      dappAddresses,
      walletsApi.dappAddresses,
      mutateAddresses,
      mergeAddress,
    ]
  );

  const deleteAddress = useCallback(
    withAddress(async (params) => {
      const { address } = params as DeleteParams & {
        address?: AddressEnriched;
      };
      if (!address || isDeletingAddress) {
        // Do not delete address if it's already deleting or not present
        return;
      }
      setDeletingAddress(true);
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
      setDeletingAddress(false);
    }),
    [
      withAddress,
      isDeletingAddress,
      addresses,
      mutateAddresses,
      walletsApi.addresses,
    ]
  );

  const verifyCode = useCallback(
    withAddress(async (params) => {
      const { address, code } = params as VerifyParams & {
        address?: AddressEnriched;
      };
      if (!address) {
        return;
      }
      setVerifyingCode(true);
      const nextAddress = await walletsApi.addresses.verify({
        addressId: address.id,
        code,
      });
      await mutateAddresses(mergeAddress(nextAddress));
      setVerifyingCode(false);
    }),
    [withAddress, walletsApi.addresses, mutateAddresses, mergeAddress]
  );

  const resendCode = useCallback(
    withAddress(async (params) => {
      const { address } = params as ResendParams & {
        address?: AddressEnriched;
      };
      if (!address) {
        return;
      }
      setSendingCode(true);
      await walletsApi.addresses.resendVerificationCode({
        addressId: address.id,
      });
      setSendingCode(false);
    }),
    [dappPublicKey, walletsApi.addresses, withAddress]
  );

  // Convert to object like { EMAIL: {...addr}, .. }
  const addressesObj = useMemo(() => {
    const obj = Object.fromEntries(
      // Since by default options everything is false, passed options are considered enabled
      addressesEnriched.map((addr) => [addr.type, addr])
    ) as Record<AddressType, AddressEnriched>;
    return obj;
  }, [addressesEnriched]);

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
    isSendingCode,
    isVerifyingCode,

    isFetching: isFetchingAddresses || isFetchingDappAddresses,
    errorFetching,
  };
}

export default useAddresses;
