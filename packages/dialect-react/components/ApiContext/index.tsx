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
import type { WalletName } from '@solana/wallet-adapter-base';
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

export type WalletType =
  | WalletContextState
  | AnchorWallet
  | WalletAdapter
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
  isSavingAddress: boolean;
  saveAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  savingAddressError: ParsedErrorData | null;
  updateAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  isDeletingAddress: boolean;
  deleteAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  verifyCode: (
    wallet: WalletType,
    address: AddressType,
    code: string
  ) => Promise<void>;
  deletingAddressError: ParsedErrorData | null;
  isSendingCode: boolean;
  verificationCodeError: ParsedErrorData | null;
  resendCode: (wallet: WalletType, address: AddressType) => Promise<void>;
};

const ApiContext = createContext<ValueType | null>(null);

export const ApiProvider = ({ dapp, children }: PropsType): JSX.Element => {
  const [wallet, setWallet] = useState<WalletType>(null);
  const [program, setProgram] = useState<ProgramType>(null);
  const [network, setNetwork] = useState<string | null>('devnet');
  const [rpcUrl, setRpcUrl] = useState<string | null>(URLS.devnet);

  const [isSavingAddress, setSavingAddress] = React.useState(false);
  const [savingAddressError, setSavingAddressError] =
    React.useState<ParsedErrorData | null>(null);

  const [isDeletingAddress, setDeletingAddress] = React.useState(false);
  const [deletingAddressError, setDeletingAddressError] =
    React.useState<ParsedErrorData | null>(null);

  const [fetchingError, setFetchingError] =
    React.useState<ParsedErrorData | null>(null);

  const [verificationCodeError, setVerificationCodeError] =
    useState<ParsedErrorData | null>(null);
  const [isSendingCode, setSendingCode] = React.useState(false);

  const {
    data: addresses,
    mutate: mutateAddresses,
    error: fetchError,
  } = useSWR<AddressType[] | null, ParsedErrorData>(
    wallet && dapp ? [wallet, dapp] : null,
    fetchAddressesForDapp,
    {
      onError: (err) => {
        console.log('Error fetching web2 addresses', err);
        setFetchingError(err as ParsedErrorData);
      },
    }
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

      setSavingAddress(true);

      try {
        const data = await saveAddress(wallet, dapp, address);

        await mutateAddresses([data]);
        setSavingAddressError(null);
      } catch (e) {
        // TODO: implement safer error handling
        setSavingAddressError(e as ParsedErrorData);

        // Passing through the error, in case for additional UI error handling
        throw e;
      } finally {
        setSavingAddress(false);
      }
    },
    [dapp, isWalletConnected, mutateAddresses]
  );

  const updateAddressWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected || !dapp) return;

      setSavingAddress(true);

      try {
        const data = await updateAddress(wallet, dapp, address);

        await mutateAddresses([data]);
        setSavingAddressError(null);
      } catch (e) {
        // TODO: implement safer error handling
        setSavingAddressError(e as ParsedErrorData);
        // Passing through the error, in case for additional UI error handling
        throw e;
      } finally {
        setSavingAddress(false);
      }
    },
    [dapp, isWalletConnected, mutateAddresses]
  );

  const deleteAddressWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected) return;

      setDeletingAddress(true);

      try {
        await deleteAddress(wallet, address);
        await mutateAddresses([]);
        setDeletingAddressError(null);
      } catch (e) {
        // TODO: implement safer error handling
        setDeletingAddressError(e as ParsedErrorData);

        // Passing through the error, in case for additional UI error handling
        throw e;
      } finally {
        setDeletingAddress(false);
      }
    },
    [isWalletConnected, mutateAddresses]
  );

  const verifyCodeWrapper = useCallback(
    async (wallet: WalletType, address: AddressType, code: string) => {
      if (!isWalletConnected || !dapp) return;
      setSendingCode(true);
      try {
        const data = await verifyCode(wallet, dapp, address, code);
        await mutateAddresses([data]);
        setSendingCode(false);
        setVerificationCodeError(null);
      } catch (err) {
        setVerificationCodeError(err as ParsedErrorData);
        throw err;
      } finally {
        setSendingCode(false);
      }
    },
    [dapp, isWalletConnected, mutateAddresses]
  );

  const resendCodeWrapper = useCallback(
    async (wallet: WalletType, address: AddressType) => {
      if (!isWalletConnected || !dapp) return;
      setSendingCode(true);
      try {
        await resendCode(wallet, dapp, address);
        setSendingCode(false);
        setVerificationCodeError(null);
      } catch (err) {
        setVerificationCodeError(err as ParsedErrorData);
        throw err;
      } finally {
        setSendingCode(false);
      }
    },
    [dapp, isWalletConnected, mutateAddresses]
  );

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
    wallet,
    walletName: getWalletName(wallet),
    setWallet,
    network,
    setNetwork,
    rpcUrl,
    setRpcUrl,
    program,
    addresses: addressesObj || {},
    fetchingAddressesError: fetchingError,
    isSavingAddress,
    saveAddress: saveAddressWrapper,
    savingAddressError,
    updateAddress: updateAddressWrapper,
    isDeletingAddress,
    deleteAddress: deleteAddressWrapper,
    verifyCode: verifyCodeWrapper,
    resendCode: resendCodeWrapper,
    verificationCodeError,
    isSendingCode,
    deletingAddressError,
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
