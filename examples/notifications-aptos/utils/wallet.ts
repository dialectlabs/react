import { DialectAptosWalletAdapter } from '@dialectlabs/react-sdk-blockchain-aptos';
import {
  SignMessageResponse as AptosSignMessageResponse,
  WalletAdapter as AptosWalletAdapter,
} from '@manahippo/aptos-wallet-adapter';

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
