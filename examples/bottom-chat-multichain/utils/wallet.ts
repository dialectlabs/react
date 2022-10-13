import { DialectAptosWalletAdapter } from '@dialectlabs/react-sdk-blockchain-aptos';
import { DialectSolanaWalletAdapter } from '@dialectlabs/react-sdk-blockchain-solana';
import {
  SignMessageResponse as AptosSignMessageResponse,
  WalletAdapter as AptosWalletAdapter,
} from '@manahippo/aptos-wallet-adapter';
import { WalletContextState as SolanaWalletContextState } from '@solana/wallet-adapter-react';

export const solanaWalletToDialectWallet = (
  wallet: SolanaWalletContextState
): DialectSolanaWalletAdapter | null => {
  if (
    !wallet.connected ||
    wallet.connecting ||
    wallet.disconnecting ||
    !wallet.publicKey
  ) {
    return null;
  }

  return {
    publicKey: wallet.publicKey!,
    signMessage: wallet.signMessage,
    signTransaction: wallet.signTransaction,
    signAllTransactions: wallet.signAllTransactions,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    diffieHellman: wallet.wallet?.adapter?._wallet?.diffieHellman
      ? async (pubKey: any) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          return wallet.wallet?.adapter?._wallet?.diffieHellman(pubKey);
        }
      : undefined,
  };
};

export const aptosWalletToDialectWallet = (
  wallet: AptosWalletAdapter
): DialectAptosWalletAdapter | null => {
  if (
    !wallet.connected ||
    wallet.connecting ||
    !wallet.publicAccount.address ||
    !wallet.publicAccount.publicKey
  ) {
    return null;
  }

  return {
    address: wallet.publicAccount.address,
    publicKey: wallet.publicAccount.publicKey,
    // TODO this is for martians only, because of the problems with aptos-wallet-adapter
    signMessagePayload: (payload) => {
      const res = wallet.signMessage(
        payload
      ) as Promise<AptosSignMessageResponse>;
      return res;
    },
  };
};
