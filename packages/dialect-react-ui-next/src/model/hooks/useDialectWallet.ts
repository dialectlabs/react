import { DialectWalletStatesHolder } from '../internal/context/DialectWalletStatesHolder';

const useDialectWallet = () => {
  return DialectWalletStatesHolder.useContainer();
};

export default useDialectWallet;
