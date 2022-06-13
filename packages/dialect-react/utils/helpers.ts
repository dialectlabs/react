import type { Message } from '@dialectlabs/web3';
import type {
  AnchorWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import type { WalletType } from '../components/ApiContext';
import hash from 'object-hash';
import type { Adapter } from '@solana/wallet-adapter-base';

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

export const isWalletContextState = (
  wallet: WalletType
): wallet is WalletContextState => !!wallet && 'connected' in wallet;

export const isAnchorWallet = (wallet: WalletType): wallet is AnchorWallet =>
  !!wallet && !('connected' in wallet);

export const getMessageHash = (messages: Message[] | string) => {
  return hash(messages);
};

// this is kinda heuristic since we don't know which exactly wallet provider will be used in app
// so that we should try to extract adapter from(currently only two ways, for wallet-adapter and use-solana)
export const extractWalletAdapter = (
  /* due to current api, we expect to have either context with a wallet or a wallet itself... */
  walletOrWalletContext: WalletType
): Adapter | null => {
  if (!walletOrWalletContext) {
    return null;
  }
  let wallet: any;
  if ('wallet' in walletOrWalletContext) {
    wallet = walletOrWalletContext.wallet;
  } else {
    wallet = walletOrWalletContext;
  }
  if (!wallet) {
    return null;
  }
  const isSaberUseSolana = Boolean(wallet?.adapter?.adapter);
  if (isSaberUseSolana) {
    return wallet.adapter.adapter;
  } else if (wallet?.adapter) {
    return wallet.adapter;
  }
  return wallet;
};
