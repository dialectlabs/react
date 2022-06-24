import { useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { EMPTY_OBJ } from '../utils';
import {
  Address,
  AddressType,
  deleteAddress,
  fetchAddressesForDapp,
  resendCode,
  saveAddress,
  updateAddress,
  verifyCode,
} from '../web2.api';
import useDialectConnectionInfo from './useDialectConnectionInfo';
import useDialectDapp from './useDialectDapp';
import useDialectSdk from './useDialectSdk';

// TODO: this is subject to change
interface DialectCloudApi {
  addresses: Record<Address, AddressType> | Record<string, never>;
  fetchingAddressesError?: Error | null;
  saveAddress: (address: AddressType) => Promise<void>;
  updateAddress: (address: AddressType) => Promise<void>;
  deleteAddress: (address: AddressType) => Promise<void>;
  verifyCode: (address: AddressType, code: string) => Promise<void>;
  resendCode: (address: AddressType) => Promise<void>;
}

const useDialectCloudApi = (): DialectCloudApi => {
  const { dappAddress: address } = useDialectDapp();
  const dapp = address?.toBase58();

  const {
    connected: { wallet: isWalletConnected },
  } = useDialectConnectionInfo();

  const {
    info: { wallet },
  } = useDialectSdk();

  const {
    data: addresses,
    mutate: mutateAddresses,
    error: fetchError,
  } = useSWR<AddressType[] | null, Error>(
    wallet && dapp ? [wallet, dapp] : null,
    fetchAddressesForDapp
  );

  const mergeAddress = useCallback(
    (data) =>
      addresses
        ? addresses.map((add: AddressType) =>
            add.type === data.type ? data : add
          )
        : [data],
    [addresses]
  );

  const saveAddressWrapper = useCallback(
    async (address: AddressType) => {
      if (!isWalletConnected || !dapp) return;
      try {
        // Optimisticly update the current data while run actual request
        mutateAddresses(
          async () => {
            const data = await saveAddress(wallet, dapp, address);
            return mergeAddress(data);
          },
          {
            optimisticData: mergeAddress(address),
            rollbackOnError: true,
          }
        );
      } catch (e) {
        throw e as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses, wallet]
  );

  const updateAddressWrapper = useCallback(
    async (address: AddressType) => {
      if (!isWalletConnected || !dapp) return;

      try {
        const data = await updateAddress(wallet, dapp, address);
        await mutateAddresses(mergeAddress(data));
      } catch (e) {
        throw e as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses, wallet]
  );

  const deleteAddressWrapper = useCallback(
    async (address: AddressType) => {
      if (!isWalletConnected) return;

      try {
        const nextAddresses = addresses
          ? addresses.filter((add) => add.type !== address.type)
          : [];
        // Optimisticly update the current data while run actual request
        mutateAddresses(
          async () => {
            await deleteAddress(wallet, address);
            return nextAddresses;
          },
          {
            optimisticData: nextAddresses,
            rollbackOnError: true,
          }
        );
      } catch (e) {
        throw e as Error;
      }
    },
    [addresses, isWalletConnected, mutateAddresses, wallet]
  );

  const verifyCodeWrapper = useCallback(
    async (address: AddressType, code: string) => {
      if (!isWalletConnected || !dapp) return;
      try {
        const data = await verifyCode(wallet, dapp, address, code);
        await mutateAddresses(mergeAddress(data));
      } catch (err) {
        throw err as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses, wallet]
  );

  const resendCodeWrapper = useCallback(
    async (address: AddressType) => {
      if (!isWalletConnected || !dapp) return;
      try {
        await resendCode(wallet, dapp, address);
      } catch (err) {
        throw err as Error;
      }
    },
    [dapp, isWalletConnected, wallet]
  );

  const addressesObj = useMemo(
    () =>
      Object.fromEntries(
        // Since by default options everything is false, passed options are considered enabled
        addresses ? addresses.map((address) => [address.type, address]) : []
      ) as Record<Address, AddressType>,
    [addresses]
  );

  return {
    addresses: addressesObj || EMPTY_OBJ,
    fetchingAddressesError: fetchError,
    saveAddress: saveAddressWrapper,
    updateAddress: updateAddressWrapper,
    deleteAddress: deleteAddressWrapper,
    verifyCode: verifyCodeWrapper,
    resendCode: resendCodeWrapper,
    // isSaving,
    // isUpdating,
    // isDeleting,
  };
};

export default useDialectCloudApi;
