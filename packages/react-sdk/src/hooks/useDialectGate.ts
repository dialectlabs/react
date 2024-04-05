import { DialectGate, DialectGateState } from '../context/DialectContext/Gate';

const useDialectGate = (): Required<DialectGateState> => {
  const gateState = DialectGate.useContainer();
  return gateState;
};

export default useDialectGate;
