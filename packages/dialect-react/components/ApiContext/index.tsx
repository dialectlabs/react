import * as anchor from '@project-serum/anchor';
import type {
  AnchorWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import { Connection } from '@solana/web3.js';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { idl, programs } from '@dialectlabs/web3';
import {
  deleteAddress,
  fetchAddressesForDapp,
  saveAddress,
  updateAddress,
  removeToken,
  verifyCode,
  resendCode,
} from '../../api';
import type { Address, AddressType } from '../../api/web2';
import type { ParsedErrorData } from '../../utils/errors';
import useSWR from 'swr';
import {
  connected,
  extractWalletAdapter,
  isAnchorWallet,
} from '../../utils/helpers';
import type { Adapter, WalletName } from '@solana/wallet-adapter-base';
import type { WalletAdapter } from '@saberhq/use-solana';

const URLS: Record<'mainnet' | 'devnet' | 'localnet', string> = {
  // TODO: Move to protocol/web3
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  localnet: 'http://localhost:8899',
};

type PropsType = {
  children: JSX.Element;
  dapp?: string; // base58 public key format
};

// TODO: this needs to be revisited...
export type WalletType =
  | WalletContextState
  | AnchorWallet
  | WalletAdapter
  | Adapter
  | null
  | undefined;

export type ProgramType = anchor.Program | null;

export const getWalletName = (wallet: WalletType): WalletName | null => {
  if (!wallet) {
    return null;
  }

  if (isAnchorWallet(wallet)) {
    return 'Anchor' as WalletName;
  }

  return extractWalletAdapter(wallet)?.name ?? null;
};

type ValueType = {
  wallet: WalletType;
  walletName: WalletName | null;
  setWallet: (_: WalletType) => void;
  network: string | null;
  setNetwork: (_: string | null) => void;
  rpcUrl: string | null;
  setRpcUrl: (_: string | null) => void;
  program: ProgramType;
  addresses: Record<Address, AddressType> | Record<string, never>;
  fetchingAddressesError: ParsedErrorData | null;
  saveAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  updateAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  deleteAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  verifyCode: (
    wallet: WalletType,
    address: AddressType,
    code: string
  ) => Promise<void>;
  resendCode: (wallet: WalletType, address: AddressType) => Promise<void>;
  getLastReadMessage: (threadId: string) => string | null;
  saveLastReadMessage: (
    threadId: string,
    timestamp: string | undefined
  ) => void;
};

const ApiContext = createContext<ValueType | null>(null);

export const ApiProvider = ({ dapp, children }: PropsType): JSX.Element => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const [program, setProgram] = useState<ProgramType>(null);
  const [network, setNetwork] = useState<string | null>('devnet');
  const [rpcUrl, setRpcUrl] = useState<string | null>(URLS.devnet);

  const [fetchingError, setFetchingError] =
    React.useState<ParsedErrorData | null>(null);

  const {
    data: addresses,
    mutate: mutateAddresses,
    error: fetchError,
  } = useSWR<AddressType[] | null, ParsedErrorData>(
    wallet && dapp ? [wallet, dapp] : null,
    fetchAddressesForDapp,
    {
      onError: (err) => {
        setFetchingError(err as ParsedErrorData);
      },
    }
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

  const isWalletConnected = connected(wallet);

  useEffect(() => {
    if (isWalletConnected) {
      const n: 'mainnet' | 'devnet' | 'localnet' =
        network && Object.keys(URLS).includes(network)
          ? (network as 'mainnet' | 'devnet' | 'localnet')
          : 'devnet';
      const u = rpcUrl || URLS[n]; // TODO: Move to protocol/web3
      const connection = new Connection(u, 'recent');
      const provider = new anchor.Provider(
        connection,
        wallet as anchor.Wallet, // TODO: Check that this cast is acceptable
        anchor.Provider.defaultOptions()
      );
      anchor.setProvider(provider);
      const program = new anchor.Program(
        idl as anchor.Idl,
        programs[n].programAddress
      );
      setProgram(program);
    } else {
      removeToken();
      setProgram(null);
    }
  }, [wallet, isWalletConnected, network, rpcUrl]);

  const saveAddressWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected || !dapp) return;
      try {
        const data = await saveAddress(wallet, dapp, address);
        await mutateAddresses(mergeAddress(data));
      } catch (e) {
        throw e as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses]
  );

  const updateAddressWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected || !dapp) return;

      try {
        const data = await updateAddress(wallet, dapp, address);
        await mutateAddresses(mergeAddress(data));
      } catch (e) {
        throw e as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses]
  );

  const deleteAddressWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected) return;

      try {
        await deleteAddress(wallet, address);
        const nextAddresses = addresses
          ? addresses.filter((add) => add.type !== address.type)
          : [];
        await mutateAddresses(nextAddresses);
      } catch (e) {
        throw e as Error;
      }
    },
    [addresses, isWalletConnected, mutateAddresses]
  );

  const verifyCodeWrapper = useCallback(
    async (wallet: WalletType, address: AddressType, code: string) => {
      if (!isWalletConnected || !dapp) return;
      try {
        const data = await verifyCode(wallet, dapp, address, code);
        await mutateAddresses(mergeAddress(data));
      } catch (err) {
        throw err as Error;
      }
    },
    [dapp, mergeAddress, isWalletConnected, mutateAddresses]
  );

  const resendCodeWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected || !dapp) return;
      try {
        await resendCode(wallet, dapp, address);
      } catch (err) {
        throw err as Error;
      }
    },
    [dapp, isWalletConnected]
  );

  const getLastReadMessageWrapper = useCallback((threadId: string) => {
    if (!window) return;
    const dialectReadReceipts = window.localStorage.getItem(
      'dialectReadReceipts'
    );

    if (!dialectReadReceipts) return null;

    const dialectReadReceiptsJSON = JSON.parse(dialectReadReceipts);
    return dialectReadReceiptsJSON[threadId] || null;
  }, []);

  const saveLastReadMessageWrapper = (
    threadId: string,
    timestamp: string | undefined
  ) => {
    if (!window || !timestamp) return;

    const dialectReadReceipts = window.localStorage.getItem(
      'dialectReadReceipts'
    );

    let dialectReadReceiptsObj: { [key: string]: string } = {};

    if (!dialectReadReceipts) {
      dialectReadReceiptsObj[threadId] = timestamp;
    } else {
      dialectReadReceiptsObj = JSON.parse(dialectReadReceipts);
      dialectReadReceiptsObj[threadId] = timestamp;
    }

    window.localStorage.setItem(
      'dialectReadReceipts',
      JSON.stringify(dialectReadReceiptsObj)
    );
  };

  // TODO: better naming or replace addresses
  const addressesObj = useMemo(
    () =>
      Object.fromEntries(
        // Since by default options everything is false, passed options are considered enabled
        addresses ? addresses.map((address) => [address.type, address]) : []
      ) as Record<Address, AddressType>,
    [addresses]
  );

  const value: ValueType = {
    wallet: extractWalletAdapter(wallet),
    walletName: getWalletName(wallet),
    setWallet,
    network,
    setNetwork,
    rpcUrl,
    setRpcUrl,
    program,
    addresses: addressesObj || {},
    fetchingAddressesError: fetchingError,
    saveAddress: saveAddressWrapper,
    updateAddress: updateAddressWrapper,
    deleteAddress: deleteAddressWrapper,
    verifyCode: verifyCodeWrapper,
    resendCode: resendCodeWrapper,
    getLastReadMessage: getLastReadMessageWrapper,
    saveLastReadMessage: saveLastReadMessageWrapper,
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export function useApi(): ValueType {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
