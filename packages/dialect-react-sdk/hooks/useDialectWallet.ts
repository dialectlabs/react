import { DialectWallet } from '../context/DialectContext/Wallet';
// TODO
const useDialectWallet = () => {
  const walletCtx = DialectWallet.useContainer();
  return walletCtx;
};

export default useDialectWallet;
