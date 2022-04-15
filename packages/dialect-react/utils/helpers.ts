import type { Message } from '@dialectlabs/web3';
import type {
  AnchorWallet,
  WalletContextState,
} from '@solana/wallet-adapter-react';
import type { WalletType } from '../components/ApiContext';
import hash from "object-hash"

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

export const getMessageHash = (messages: Message[]) => {
  return hash(messages);
}