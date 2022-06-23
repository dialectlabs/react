import type { PublicKey } from '@solana/web3.js';
import { useMemo } from 'react';
import { createContainer } from '../../../utils/container';

export interface DialectDappState {
  dapp?: PublicKey;
}

function useDialectDapp(dapp?: PublicKey): DialectDappState {
  const PKString = dapp?.toBase58();
  const dappPK = useMemo(() => dapp, [PKString]);

  return {
    dapp: dappPK,
  };
}

export const DialectDapp = createContainer(useDialectDapp);
