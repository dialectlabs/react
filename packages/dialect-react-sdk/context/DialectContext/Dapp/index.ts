import type { PublicKey } from '@solana/web3.js';
import { createContainer } from '../../../utils/container';

export interface DialectDappState {
  dappAddress?: PublicKey;
}

function useDialectDapp(dapp?: PublicKey): DialectDappState {
  return {
    dappAddress: dapp,
  };
}

export const DialectDapp = createContainer(useDialectDapp);
