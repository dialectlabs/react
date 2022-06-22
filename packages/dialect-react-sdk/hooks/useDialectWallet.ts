import { DialectWallet } from '../context/DialectContext/Wallet';

const useDialectWallet = () => {
  const walletCtx = DialectWallet.useContainer();
  return walletCtx;
};

export default useDialectWallet;
