import { createContainer } from '../../../utils/container';

export type Gate = () => boolean;

export interface DialectGateState {
  gate?: Gate;
}

function useDialectGate(gate?: Gate): DialectGateState {
  return {
    gate,
  };
}

export const DialectGate = createContainer(useDialectGate);
