import { DialectWalletStatesHolder } from '../internal/context/DialectWalletStatesHolder';

export const useDialectWallet = () => {
  return DialectWalletStatesHolder.useContainer();
};
