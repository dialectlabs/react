import type {
  AptosConfigProps as AptosSdkConfigProps,
  DialectAptosWalletAdapter,
} from '@dialectlabs/blockchain-sdk-aptos';

type WalletOptional<T extends { wallet: DialectAptosWalletAdapter }> = Omit<
  T,
  'wallet'
> & {
  wallet?: DialectAptosWalletAdapter | null;
};

export type AptosConfigProps = WalletOptional<AptosSdkConfigProps>;
