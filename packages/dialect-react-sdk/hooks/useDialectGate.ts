import { DialectGate, DialectGateState } from '../context/DialectContext/Gate';

const PASSING_GATE = () => true;

const useDialectGate = (): Required<DialectGateState> => {
  const { gate } = DialectGate.useContainer();

  return { gate: gate ?? PASSING_GATE };
};

export default useDialectGate;
