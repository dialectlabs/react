import { DialectDapp, DialectDappState } from '../context/DialectContext/Dapp';

const useDialectDapp = (): DialectDappState => {
  const dappObj = DialectDapp.useContainer();
  return dappObj;
};

export default useDialectDapp;
