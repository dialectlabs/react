import type {
  DialectEvmWalletAdapter,
  EvmConfigProps as EvmSdkConfigProps,
} from '@dialectlabs/blockchain-sdk-evm';

type WalletOptional<T extends { wallet: DialectEvmWalletAdapter }> = Omit<
  T,
  'wallet'
> & {
  wallet?: DialectEvmWalletAdapter | null;
};

export type EvmConfigProps = WalletOptional<EvmSdkConfigProps>;
