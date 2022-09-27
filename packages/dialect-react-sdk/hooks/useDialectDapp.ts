import { DialectDapp, DialectDappState } from '../context/DialectContext/Dapp';

const useDialectDapp = <TUnsafe extends boolean = false>(
  unsafe?: TUnsafe
): TUnsafe extends true ? DialectDappState : Required<DialectDappState> => {
  const dappContainerState = DialectDapp.useContainer();
  if (unsafe) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return dappContainerState;
  }
  if (!dappContainerState || !dappContainerState.dappAddress) {
    throw new Error('dapp not initialized');
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return dappContainerState;
};

export default useDialectDapp;
