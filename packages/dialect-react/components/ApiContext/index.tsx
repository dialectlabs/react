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
  useState,
} from 'react';
import { idl, programs } from '@dialectlabs/web3';
import {
  AddressType,
  deleteAddress,
  fetchAddressesForDapp,
  saveAddress,
  updateAddress,
} from '../../api';
import { ParsedErrorData } from '../../utils/errors';
import useSWR from 'swr';

const URLS: Record<'mainnet' | 'devnet' | 'localnet', string> = {
  // TODO: Move to protocol/web3
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  localnet: 'http://localhost:8899',
};

export const connected = (
  wallet: WalletType
): wallet is WalletContextState | AnchorWallet => {
  /*
    Wallets can be of type AnchorWallet or WalletContextState.

    - AnchorWallet is undefined if not connected. It has no connected attribute.
    - WalletContextState may be either null/undefined, or its attribute connected is false if it's not connected.

    This function connected should accommodate both types of wallets.
  */
  return (
    (wallet || false) && ('connected' in wallet ? wallet?.connected : true)
  );
};

type PropsType = {
  children: JSX.Element;
  dapp?: string; // base58 public key format
};

export type WalletType = WalletContextState | AnchorWallet | null | undefined;
export type ProgramType = anchor.Program | null;

type ValueType = {
  wallet: WalletType;
  setWallet: (_: WalletType) => void;
  network: string | null;
  setNetwork: (_: string | null) => void;
  rpcUrl: string | null;
  setRpcUrl: (_: string | null) => void;
  program: ProgramType;
  addresses: AddressType[] | null;
  fetchingAddressesError: ParsedErrorData | null;
  isSavingAddress: boolean;
  saveAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  savingAddressError: ParsedErrorData | null;
  updateAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  isDeletingAddress: boolean;
  deleteAddress: (wallet: WalletType, address: AddressType) => Promise<void>;
  deletingAddressError: ParsedErrorData | null;
};

const ApiContext = createContext<ValueType | null>(null);

export const ApiProvider = (props: PropsType): JSX.Element => {
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

  const dapp = props.dapp;

  const {
    data: addresses,
    mutate: mutateAddresses,
    error: fetchError,
  } = useSWR<AddressType[] | null, ParsedErrorData>(
    wallet && dapp ? [wallet, dapp] : null,
    fetchAddressesForDapp,
    {
      onError: (err) => {
        console.log('error fetching', err);
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
      setProgram(null);
    }
  }, [wallet, isWalletConnected, network, rpcUrl]);

  const saveAddressWrapper = useCallback(
    async (wallet: WalletContextState, address: AddressType) => {
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
    [isWalletConnected, mutateAddresses]
  );

  const updateAddressWrapper = useCallback(
    async (wallet: WalletContextState, address: AddressType) => {
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
    [isWalletConnected, mutateAddresses]
  );

  const deleteAddressWrapper = useCallback(
    async (wallet: WalletContextState, address: AddressType) => {
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

  const value = {
    wallet,
    setWallet,
    network,
    setNetwork,
    rpcUrl,
    setRpcUrl,
    program,
    addresses: addresses || [],
    fetchingAddressesError: fetchingError,
    isSavingAddress,
    saveAddress: saveAddressWrapper,
    savingAddressError,
    updateAddress: updateAddressWrapper,
    isDeletingAddress,
    deleteAddress: deleteAddressWrapper,
    deletingAddressError,
  };

  return (
    <ApiContext.Provider value={value}>{props.children}</ApiContext.Provider>
  );
};

export function useApi(): ValueType {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
}
