import type {
  DialectSolanaWalletAdapter,
  SolanaConfigProps as SolanaSdkConfigProps,
} from '@dialectlabs/blockchain-sdk-solana';

type WalletOptional<T extends { wallet: DialectSolanaWalletAdapter }> = Omit<
  T,
  'wallet'
> & {
  wallet?: DialectSolanaWalletAdapter | null;
};

export type SolanaConfigProps = WalletOptional<SolanaSdkConfigProps>;
