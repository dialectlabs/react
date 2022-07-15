import { DialectGate, DialectGateState } from '../context/DialectContext/Gate';
import { useEffect, useState } from 'react';
import useDialectWallet from './useDialectWallet';

const PASSING_GATE = () => true;

const useDialectGate = (): Required<DialectGateState> & {
  isGatePassing: boolean;
} => {
  const { gate } = DialectGate.useContainer();
  const { connected } = useDialectWallet();
  const [isGatePassing, setIsGatePassing] = useState(true);

  useEffect(
    function verifyGate() {
      (async () => {
        setIsGatePassing(connected && gate ? await gate() : true);
      })();
    },
    [gate, connected]
  );

  return { isGatePassing, gate: gate ?? PASSING_GATE };
};

export default useDialectGate;
