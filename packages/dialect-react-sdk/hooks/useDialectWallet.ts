import { DialectWalletStatesHolder } from '../context/DialectContext/Wallet';

const useDialectWallet = () => {
  const walletCtx = DialectWalletStatesHolder.useContainer();
  return walletCtx;
};

export default useDialectWallet;
