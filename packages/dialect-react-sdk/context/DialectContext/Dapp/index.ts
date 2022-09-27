import type { AccountAddress } from '@dialectlabs/sdk';
import { createContainer } from '../../../utils/container';

interface DialectDappProps {
  dappAddress?: AccountAddress;
}

export interface DialectDappState {
  dappAddress?: AccountAddress;
}

function useDialectDapp({ dappAddress }: DialectDappProps): DialectDappState {
  return {
    dappAddress: dappAddress,
  };
}

export const DialectDapp = createContainer(useDialectDapp);
