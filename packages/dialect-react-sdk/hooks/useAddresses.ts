import { Address, AddressType, DialectSdkError } from '@dialectlabs/sdk';
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
import useThread from './useThread';
import useThreads from './useThreads';

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
  const { adapter: wallet, connected: isWalletConnected } = useDialectWallet();
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
    WALLET_DAPP_ADDRESSES_CACHE_KEY_FN(walletsApi),
    walletsApi && dappPublicKey
      ? () => walletsApi.dappAddresses.findAll({ dappPublicKey })
      : null,
    {
      onSuccess: (data) => {
        console.log('success loading dapp connections', data);
      },
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
    async (type: AddressType, value?: string) => {
      if (
        !isWalletConnected ||
        !dappPublicKey ||
        !value ||
        !addresses ||
        !dappAddresses
      )
        return;
      setCreatingAddress(true);
      try {
        const currentAddress = getAddress(type);
        console.log(currentAddress, addresses);
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
      } catch (e) {
        throw e as Error;
      } finally {
        setCreatingAddress(false);
      }
    },
    [
      isWalletConnected,
      dappPublicKey,
      addresses,
      dappAddresses,
      getAddress,
      mutateAddresses,
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
        console.log('updateEnabled', { address, dappAddress });
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
      if (!isWalletConnected) return;
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
        ? addresses.map((address) => [
            address.type,
            {
              ...address,
              enabled: Boolean(
                dappAddresses?.find((dappAddress) => {
                  console.log(dappAddress.address.id === address.id);
                  return dappAddress.address.id === address.id;
                })?.enabled
              ),
            },
          ])
        : []
    ) as Record<AddressType, AddressEnriched>;
    console.log('addressesObj', { addresses, dappAddresses, obj });
    return obj;
  }, [addresses, dappAddresses]);

  const { isCreatingThread } = useThreads();
  const { thread, isFetchingThread, isDeletingThread } = useThread({
    findParams: { otherMembers: dappPublicKey ? [dappPublicKey] : [] },
  });

  // Sync state for web3 channel in case of errors
  useEffect(() => {
    const walletAddress = getAddress(AddressType.Wallet);

    if (
      !addresses ||
      !dappAddresses ||
      isFetchingThread ||
      isCreatingAddress ||
      isDeletingAddress ||
      isCreatingThread ||
      isDeletingThread
    )
      return;

    if (thread && !walletAddress) {
      // In case the wallet isn't in web2 db, but the actual thread was created
      // console.log('trying to save in useEffect');
      console.log('try to create wallet address');
      createAddress(AddressType.Wallet, wallet.publicKey?.toBase58());
    } else if (!thread && walletAddress) {
      // In case the wallet is set to enabled in web2 db, but the actual thread wasn't created
      console.log('try to delete wallet address');
      deleteAddress(AddressType.Wallet);
    }
  }, [
    isFetchingThread,
    thread,
    isDeletingAddress,
    isCreatingThread,
    isDeletingThread,
    isCreatingAddress,
    deleteAddress,
    wallet.publicKey,
    getAddress,
    createAddress,
    addresses,
    dappAddresses,
  ]);

  console.log(addressesObj);

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
